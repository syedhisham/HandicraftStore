import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    image: {
        type: String, // URL or path of the uploaded image
       required: true
      },

    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },

    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["seller", "buyer", "admin"],
      default: "buyer",
    },
    activityScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
userSchema.plugin(aggregatePaginate);

export const User = mongoose.model("User", userSchema);
