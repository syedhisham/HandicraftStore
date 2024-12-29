import { asyncHandler } from "../../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product/product.model.js";
import mongoose from "mongoose";
import { Rating } from "../../models/product/rating.model.js";
import { User } from "../../models/user/user.model.js";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    subcategory,
    stock,
    deliveryTime,
    specifications,
  } = req.body;
  const user = req.user?._id;
  console.log("This is the user adding the product", user);

  const images = req.files;

  // Validate required fields
  if (!name || !price || !category || !subcategory || !stock || !deliveryTime) {
    throw new ApiError(400, "Fill all the required fields");
  }

  if (!images || images.length === 0) {
    throw new ApiError(400, "Images are required");
  }

  // Parse specifications if it's a JSON string
  let parsedSpecifications = {};
  if (typeof specifications === "string") {
    try {
      parsedSpecifications = JSON.parse(specifications);
    } catch (error) {
      throw new ApiError(400, "Invalid format for specifications");
    }
  } else if (typeof specifications === "object") {
    parsedSpecifications = specifications;
  }

  // Upload images to Cloudinary
  const uploadPromises = images.map((file) => uploadOnCloudinary(file.path));
  const uploadedImages = await Promise.all(uploadPromises);

  const imageUrls = uploadedImages.map((upload) => upload.secure_url);

  // Create and save product
  const product = new Product({
    owner: user,
    name,
    description,
    price,
    category,
    subcategory,
    stock,
    deliveryTime,
    specifications: parsedSpecifications,
    images: imageUrls,
  });

  const savedProduct = await product.save();

  // Respond with success
  return res
    .status(201)
    .json(new ApiResponse(201, savedProduct, "Product added successfully"));
});

// Controller to get all products and include owner's first and last name
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search } = req.query; // Get search query from request

  // Initialize filter object
  const productsQuery = {};

  // If search query exists, use it to filter products by name (case-insensitive)
  if (search) {
    productsQuery.name = { $regex: search, $options: "i" }; // 'i' makes it case-insensitive
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const products = await Product.aggregatePaginate(
      Product.aggregate([
        {
          $lookup: {
            from: "users", // The collection that the 'owner' references (in this case, the 'User' model)
            localField: "owner", // The field in the product model
            foreignField: "_id", // The field in the User model
            as: "ownerDetails", // The alias for the populated data
          },
        },
        {
          $unwind: "$ownerDetails", // Unwind the populated owner details
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            subcategory: 1,
            stock: 1,
            deliveryTime: 1,
            specifications: 1,
            images: 1,
            "ownerDetails.firstName": 1,
            "ownerDetails.lastName": 1,
          },
        },
      ]),
      options
    );

    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Fetch the product by ID and populate the owner field
  const product = await Product.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(productId) }, // Match the product by its ID
    },
    {
      $lookup: {
        from: "users", // Collection for the 'owner' reference (User model)
        localField: "owner", // The field in the Product schema referencing the User
        foreignField: "_id", // The field in the User model to match
        as: "ownerDetails", // Alias for the populated data
      },
    },
    {
      $unwind: "$ownerDetails", // Flatten the array created by the lookup
    },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        category: 1,
        subcategory: 1,
        stock: 1,
        deliveryTime: 1,
        specifications: 1,
        images: 1,
        "ownerDetails.firstName": 1,
        "ownerDetails.lastName": 1,
        "ownerDetails.email": 1, // Include additional owner fields if necessary
      },
    },
  ]);

  // If no product is found, throw an error
  if (!product.length) {
    throw new ApiError(404, "Product not found");
  }

  // Send the response with the product details
  return res
    .status(200)
    .json(new ApiResponse(200, product[0], "Product fetched successfully"));
});
const getMyProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user contains the logged-in user's details

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Fetch products added by the logged-in user
  const products = await Product.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        category: 1,
        subcategory: 1,
        stock: 1,
        deliveryTime: 1,
        specifications: 1,
        images: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!products.length) {
    return res.status(200).json(new ApiResponse(200, [], "No products found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const updateProductSelective = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Filter out empty or undefined fields from updates
  const validUpdates = Object.fromEntries(
    Object.entries(updates).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  // Find the product and check ownership
  const product = await Product.findOne({ _id: productId, owner: req.user._id });
  if (!product) {
    throw new ApiError(404, "Product not found or you're not authorized");
  }

  // Delete old images from Cloudinary if new images are uploaded
  if (req.files && req.files.length > 0) {
    

    // Upload new images to Cloudinary
    const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);

    // Extract URLs from successful uploads
    const imageUrls = uploadResults
      .filter((result) => result !== null)
      .map((result) => result.secure_url);

    // Add new images to the updates
    validUpdates.images = imageUrls;
  }

  // Update product with new details and images
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: validUpdates },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});


const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findOneAndDelete({
    _id: productId,
    owner: req.user._id, // Ensure only the owner can delete
  });

  if (!product) {
    throw new ApiError(404, "Product not found or you're not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});

const getAllProductsByCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, subcategory } = req.query;

  const filter = subcategory ? { subcategory } : {}; // Filter by subcategory if provided

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const products = await Product.aggregatePaginate(
    Product.aggregate([
      { $match: filter }, // Apply subcategory filter here
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      { $unwind: "$ownerDetails" },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          subcategory: 1,
          stock: 1,
          deliveryTime: 1,
          specifications: 1,
          images: 1,
          "ownerDetails.firstName": 1,
          "ownerDetails.lastName": 1,
        },
      },
    ]),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getMyTotalProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user contains the logged-in user's details

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Calculate the total number of products added by the logged-in user
  const totalProducts = await Product.countDocuments({ owner: new mongoose.Types.ObjectId(userId) });

  return res.status(200).json(new ApiResponse(200, { totalProducts }, "Total products fetched successfully"));
});
// const getRatedProductStats = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // Assuming req.user contains the logged-in user's details

//   if (!userId) {
//     throw new ApiError(401, "User not authenticated");
//   }

//   // Total Rated Products (Count of unique products rated by the user)
//   const totalRatedProducts = await Rating.aggregate([
//     { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Correct usage of new
//     { $group: { _id: "$product" } },
//     { $count: "totalRatedProducts" }
//   ]);

//   // High Rated Products (Count of unique products with rating > 3)
//   const highRatedProducts = await Rating.aggregate([
//     { $match: { user: new mongoose.Types.ObjectId(userId), rating: { $gt: 3 } } }, // Correct usage of new
//     { $group: { _id: "$product" } },
//     { $count: "highRatedProducts" }
//   ]);

//   // Low Rated Products (Count of unique products with rating ≤ 3)
//   const lowRatedProducts = await Rating.aggregate([
//     { $match: { user: new mongoose.Types.ObjectId(userId), rating: { $lte: 3 } } }, // Correct usage of new
//     { $group: { _id: "$product" } },
//     { $count: "lowRatedProducts" }
//   ]);

//   // If no products rated, return default response with 0
//   const totalRatedCount = totalRatedProducts[0]?.totalRatedProducts || 0;
//   const highRatedCount = highRatedProducts[0]?.highRatedProducts || 0;
//   const lowRatedCount = lowRatedProducts[0]?.lowRatedProducts || 0;

//   // Optionally, you can include product details using a lookup to fetch related products
//   const ratedProductsDetails = await Rating.aggregate([
//     { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Correct usage of new
//     {
//       $lookup: {
//         from: "products", // The collection name for products
//         localField: "product",
//         foreignField: "_id",
//         as: "productDetails"
//       }
//     },
//     { $unwind: "$productDetails" },
//     {
//       $project: {
//         productName: "$productDetails.name",
//         productCategory: "$productDetails.category",
//         productPrice: "$productDetails.price",
//         rating: 1
//       }
//     }
//   ]);

//   return res.status(200).json({
//     totalRatedProducts: totalRatedCount,
//     highRatedProducts: highRatedCount,
//     lowRatedProducts: lowRatedCount,
//     ratedProductsDetails
//   });
// });
const getUserProductsWithRatings = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user contains the logged-in user's details

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Fetch all products added by the logged-in user along with their ratings
  const products = await Product.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "ratings", // Join with the ratings collection
        localField: "_id", // Join the product's _id with the ratings' product field
        foreignField: "product", // ratings.product should match product._id
        as: "ratings" // This will add the ratings array in each product
      }
    },
    {
      $addFields: {
        averageRating: {
          $avg: "$ratings.rating" // Calculate the average rating for each product
        },
        highRatedCount: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $gt: ["$$rating.rating", 3] } // Count ratings greater than 3
            }
          }
        },
        lowRatedCount: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $lte: ["$$rating.rating", 3] } // Count ratings less than or equal to 3
            }
          }
        }
      }
    },
    {
      $project: {
        name: 1, // Select only the necessary fields
        description: 1,
        price: 1,
        category: 1,
        images: 1,
        stock: 1,
        deliveryTime: 1,
        averageRating: 1, // Add the average rating
        ratingsCount: { $size: "$ratings" }, // Count the number of ratings for the product
        highRatedCount: 1, // Include high-rated count
        lowRatedCount: 1, // Include low-rated count
      }
    }
  ]);

  // Count the total number of high-rated and low-rated products
  const totalHighRatedProducts = products.filter(product => product.highRatedCount > 0).length;
  const totalLowRatedProducts = products.filter(product => product.lowRatedCount > 0).length;

  // If no products found, return an empty array
  if (!products || products.length === 0) {
    return res.status(404).json({
      message: "No products found for this user"
    });
  }

  return res.status(200).json({
    products,
    totalHighRatedProducts, // Total count of high-rated products (rating > 3)
    totalLowRatedProducts, // Total count of low-rated products (rating <= 3)
  });
});





export {
  addProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProductSelective,
  deleteProduct,
  getAllProductsByCategory,
  getMyTotalProducts,
  getUserProductsWithRatings
};
