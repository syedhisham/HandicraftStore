import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      min: 0,
    },
    deliveryTime: {
        type: String, 
      },
      specifications: {
        type: Map, 
        of: mongoose.Schema.Types.Mixed, 
      },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(aggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
