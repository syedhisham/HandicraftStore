import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../models/cart/cart.model.js";
import { Product } from "../../models/product/product.model.js";
import { User } from "../../models/user/user.model.js";
import mongoose from "mongoose";

const createCart = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId, userId } = req.params;

  if (!quantity) {
    throw new ApiError(400, "Select the quantity to proceed");
  }

  if (!productId || !userId) {
    throw new ApiError(400, "Product and User ID's are required to proceed");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: user._id });

  if (cart) {
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
      });
    }

    await cart.save();
  } else {
    cart = await Cart.create({
      user: user._id,
      items: [
        {
          product: product._id,
          quantity
        },
      ],
    });
  }

  if (!cart) {
    throw new ApiError(
      500,
      "Something went wrong while creating/updating the cart"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, cart, "Cart created/updated successfully"));
});

const getCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new ApiError(400, "User ID is required to proceed");
    }
  
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    const cart = await Cart.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) }, // Match the cart by user
      },
      {
        $unwind: "$items", // Unwind the items array to work with individual cart items
      },
      {
        $lookup: {
          from: "products", // Join with the products collection
          localField: "items.product", // The field in cart item that links to product
          foreignField: "_id", // The field in products that matches the product ID
          as: "productDetails", // Alias to hold the product details
        },
      },
      {
        $unwind: "$productDetails", // Unwind the productDetails array to get a flat structure
      },
      {
        $project: {
          _id: 0, // Exclude cart ID as it's not necessary for the response
          user: 1, // Include user
          product: "$items.product", // Keep the product ID from the cart item
          quantity: "$items.quantity", // Keep the quantity of the product
          name: "$productDetails.name", // Include the product name from productDetails
          description: "$productDetails.description", // Product description
          price: "$productDetails.price", // Product price
          stock: "$productDetails.stock", // Product stock
          images: "$productDetails.images", // Product images
          category: "$productDetails.category", // Product category
          subcategory: "$productDetails.subcategory", // Product subcategory
          deliveryTime: "$productDetails.deliveryTime", // Product delivery time
        },
      },
      {
        $group: {
          _id: "$user", // Group by user to reconstruct the cart structure
          items: {
            $push: {
              product: "$product", // Product ID
              quantity: "$quantity", // Quantity of the product
              name: "$name", // Product name
              description: "$description", // Product description
              price: "$price", // Product price
              stock: "$stock", // Product stock
              images: "$images", // Product images
              category: "$category", // Product category
              subcategory: "$subcategory", // Product subcategory
              deliveryTime: "$deliveryTime", // Product delivery time
            },
          },
        },
      },
    ]);
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cart.length ? cart[0] : { items: [] }, // Return the first cart or an empty items array
          "Cart fetched successfully"
        )
      );
  });
  

const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    throw new ApiError(400, "User ID and Product ID are required to proceed");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

const getTotalItemsInCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required to proceed");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cart = await Cart.findOne({ user: user._id });

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { totalItems: 0 }, "Cart is empty"));
  }

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalItems }, "Total items fetched successfully")
    );
});

const deleteCartItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const resetCart = await Cart.findOneAndDelete({ user: userId });
  if (!resetCart) {
    throw new ApiError(500, "Something went wrong while reseting the cart");
  }
});

export {
  createCart,
  getCart,
  deleteCartItem,
  getTotalItemsInCart,
  deleteCartItems,
};
