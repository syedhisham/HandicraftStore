import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user/user.model.js";
import { Auth } from "../../models/user/auth.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { sendEmail } from "../../mail/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const updateActivityScoreOnLogin = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { activityScore: 10 }, // Increment score by 10 for login
    });
  } catch (error) {
    console.error("Error updating activity score on login:", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    password,
    role = "buyer",
  } = req.body;

  if (!firstName || !lastName || !email || !gender || !password) {
    throw new ApiError(401, "Fill all the fields");
  }

  // Check for existing email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }

  // Save details
  const auth = new Auth({ password });
  await auth.save();

  // Upload image if provided
  let imageUrl = "";
  console.log(req.file);

  if (req.file) {
    const uploadResponse = await uploadOnCloudinary(req.file.path);

    console.log(req.file.path);

    if (uploadResponse) {
      imageUrl = uploadResponse.secure_url;
    }
  }

  // Create the user
  const createUser = await User.create({
    firstName,
    lastName,
    email,
    gender,
    role,
    image: imageUrl, // Include the image URL in the user document
    auth: auth._id,
  });
  await sendEmail({
    email,
    subject: "Account Created Successfully",
    type: "welcome",
    name: `${createUser.firstName} ${createUser.lastName}`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).populate("auth");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.auth) {
    throw new ApiError(404, "Authentication details not found.");
  }

  const isPasswordValid = await user.auth.isPasswordCorrect(password);
  console.log("Password entered:", password);
  console.log("Stored hashed password:", user.auth.password);
  console.log("Password comparison result:", isPasswordValid); // Debug log

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password.");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select("-auth.password -refreshToken -auth")
    .populate({
      path: "auth",
      select: "-password",
    })
    .lean();

  if (!loggedInUser) {
    throw new ApiError(500, "Error fetching user details.");
  }

  delete loggedInUser.auth;

  await updateActivityScoreOnLogin(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you extract userId from the token in middleware
  console.log("This is userId", userId);

  // Fetch user details
  const user = await User.findById(userId).select("image firstName role");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully."));
});
const getUserFirstName = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user.firstName, "User First Name fetched"));
});
const getUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user.role, "User Role fetched"));
});
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  // Aggregation pipeline for fetching users without sensitive information
  const aggregationPipeline = [
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        gender: 1,
        image: 1,
        role: 1,
        activityScore: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
  };

  // Fetch users using aggregatePaginate
  const allUsers = await User.aggregatePaginate(
    User.aggregate(aggregationPipeline),
    options
  );

  if (!allUsers.docs || allUsers.docs.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users: allUsers.docs, totalUsers: allUsers.totalDocs },
        "All users fetched successfully"
      )
    );
});

const removeUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    throw new ApiError(
      400,
      "User Id is required to proceed to delete the user"
    );
  }
  const deleteUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deleteUser, "The user deleted successfuly"));
});

const getMostActiveUsers = asyncHandler(async (req, res) => {
  const mostActiveUsers = await User.find({})
    .sort({ activityScore: -1 })
    .limit(10);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: mostActiveUsers },
        "Most active user fetched"
      )
    );
});
const getUserStats = asyncHandler(async (req, res) => {
  try {
    // Fetch total users
    const totalUsers = await User.countDocuments();

    // Define the criteria for active users (e.g., activityScore > 0)
    const activeUsers = await User.countDocuments({
      activityScore: { $gt: 0 },
    });

    // Respond with stats
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalUsers, activeUsers },
          "User stats fetched successfully"
        )
      );
  } catch (error) {
    // Handle potential errors
    throw new ApiError(500, "Failed to fetch user stats");
  }
});

const ForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token with 30 minutes expiration
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    // Construct reset URL
    const resetUrl = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Send reset email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      resetUrl,
      type: "verify",
      name: `${user.firstName} ${user.lastName}`,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Forgot Password successfully processed"));
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    throw new ApiError(500, "Failed to proceed with forgot password");
  }
});

const ResetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Step 1: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Found User:", user);

    // Step 2: Find corresponding Auth document
    const auth = await Auth.findById(user.auth);
    if (!auth) {
      return res.status(404).json({ message: "Auth details not found" });
    }
    console.log("Found Auth Document:", auth);

    // Step 3: Update password
    auth.password = await bcrypt.hash(newPassword, 10);
    console.log("Hashed Password:", auth.password);

    await auth.save();
    console.log("Updated Auth Document:", auth);

    // Step 4: Send confirmation email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Successful",
      type: "reset",
      name: `${user.firstName} ${user.lastName}`,
    });

    // Step 5: Respond with success message
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  getUserFirstName,
  getAllUsers,
  removeUser,
  getMostActiveUsers,
  getUserRole,
  getUserStats,
  ForgotPassword,
  ResetPassword,
};
