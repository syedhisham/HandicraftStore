import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order/order.model.js";
import { Product } from "../../models/product/product.model.js";
import { deleteCartItems } from "../cart/cart.controller.js";
import mongoose from "mongoose";
import { User } from "../../models/user/user.model.js";
import { sendEmail } from "../../mail/sendEmail.js";

// Updated createOrder controller
const createOrder = asyncHandler(async (req, res, next) => {
  const { products, totalAmount, paymentMethod, shippingAddress } = req.body;

  // Validate request data
  if (!products || !totalAmount || !paymentMethod || !shippingAddress) {
    throw new ApiError(400, "Please provide all required order details");
  }

  // Ensure the user is logged in
  const user = req.user?._id;
  if (!user) {
    throw new ApiError(403, "Unauthorized request");
  }

  // Retrieve logged-in user's details
  const userDetails = await User.findById(user);
  if (!userDetails) {
    throw new ApiError(404, "User not found");
  }

  // Validate products and calculate total
  const validatedProducts = [];
  let calculatedTotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }

    if (item.quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    validatedProducts.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price, // Add price for email template
    });

    calculatedTotal += product.price * item.quantity;
  }

  if (calculatedTotal !== totalAmount) {
    throw new ApiError(400, "Total amount mismatch with product prices");
  }

  // Create the order
  const order = await Order.create({
    user,
    products: validatedProducts,
    totalAmount: calculatedTotal,
    paymentMethod,
    shippingAddress,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create the order");
  }

  // Send an order confirmation email
  try {
    const orderDetails = {
      items: validatedProducts.map((product) => ({
        name: product.productName,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: calculatedTotal,
      deliveryDate: "2024-12-15", // Replace with dynamic delivery date if applicable
    };

    await sendEmail({
      email: userDetails.email,
      subject: "Order Confirmation",
      type: "placingOrder",
      name: userDetails.firstName,
      orderStatus: "Confirmed",
      orderId: order._id,
      orderDetails, // Pass the structured order details
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }

  // Optionally clear cart items
  deleteCartItems(req, res, next);

  // Respond with order details
  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});
// Controller to fetch all orders for a specific seller
const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id; // Assuming seller's ID is available in req.user

  const orders = await Order.aggregate([
    {
      $unwind: "$products", // Deconstruct products array to work with individual items
    },
    {
      $lookup: {
        from: "products", // Product collection
        localField: "products.product", // Field from Order
        foreignField: "_id", // Field from Product
        as: "productDetails", // Name of the new array field
      },
    },
    {
      $unwind: "$productDetails", // Deconstruct productDetails array
    },
    {
      $match: {
        "productDetails.owner": sellerId, // Match products owned by the seller
      },
    },
    {
      $group: {
        _id: "$_id", // Group back orders by their original IDs
        user: { $first: "$user" },
        totalAmount: { $first: "$totalAmount" },
        status: { $first: "$status" },
        paymentMethod: { $first: "$paymentMethod" },
        shippingAddress: { $first: "$shippingAddress" },
        products: {
          $push: {
            product: "$products.product",
            productName: "$products.productName",
            quantity: "$products.quantity",
            productDetails: "$productDetails",
          },
        },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort orders by most recent
    },
  ]);

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this seller" });
  }

  res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  // Validate status
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  // Find and update the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  // Retrieve user details using MongoDB aggregation pipeline
  const user = await User.aggregate([
    { $match: { _id: order.user } },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    },
  ]);

  if (user.length === 0) {
    throw new ApiError(404, "User not found");
  }

  const { firstName, email } = user[0];

  // Send email to the user when the order status is updated
  try {
    const orderDetails = {
      orderId: order._id,
      status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
    };

    await sendEmail({
      email: email,
      subject: "Order Status Update",
      type: "orderStatus",
      name: firstName,
      orderStatus: status,
      orderDetails, // Pass the order details to the email template
    });
  } catch (error) {
    console.error("Failed to send order status update email:", error);
  }

  // Respond with order details
  res.status(200).json({
    message: "Order status updated successfully",
    order,
  });
});
// const getTotalSales = asyncHandler(async (req, res) => {
//   const sellerId = req.user._id; // Assuming seller's ID is available in req.user

//   // Aggregate to calculate the total sales amount for the seller
//   const totalSalesData = await Order.aggregate([
//     {
//       $unwind: "$products", // Deconstruct products array to work with individual items
//     },
//     {
//       $lookup: {
//         from: "products", // Product collection
//         localField: "products.product", // Field from Order
//         foreignField: "_id", // Field from Product
//         as: "productDetails", // Name of the new array field
//       },
//     },
//     {
//       $unwind: "$productDetails", // Deconstruct productDetails array
//     },
//     {
//       $match: {
//         "productDetails.owner": sellerId, // Match products owned by the seller
//       },
//     },
//     {
//       $group: {
//         _id: null, // Grouping all orders together
//         totalSalesAmount: { $sum: "$totalAmount" }, // Sum up the totalAmount for the seller
//       },
//     },
//   ]);

//   if (!totalSalesData || totalSalesData.length === 0) {
//     return res.status(404).json({ message: "No sales data found for this seller" });
//   }

//   // Extract the total sales amount, default to 0 if not available
//   const totalSales = totalSalesData[0]?.totalSalesAmount || 0;

//   res.status(200).json({
//     success: true,
//     totalSales, // Return the total sales
//   });
// });

const getTotalSalesForAll = asyncHandler(async (req, res) => {
  // Aggregate to calculate the total sales amount for all orders
  const totalSalesData = await Order.aggregate([
    {
      $unwind: "$products", // Deconstruct products array to work with individual items
    },
    {
      $lookup: {
        from: "products", // Product collection
        localField: "products.product", // Field from Order
        foreignField: "_id", // Field from Product
        as: "productDetails", // Name of the new array field
      },
    },
    {
      $unwind: "$productDetails", // Deconstruct productDetails array
    },
    {
      $group: {
        _id: null, // Grouping all orders together
        totalSalesAmount: { $sum: "$totalAmount" }, // Sum up the totalAmount for all orders
      },
    },
  ]);

  if (!totalSalesData || totalSalesData.length === 0) {
    return res.status(404).json({ message: "No sales data found" });
  }

  // Extract the total sales amount, default to 0 if not available
  const totalSales = totalSalesData[0]?.totalSalesAmount || 0;

  res.status(200).json({
    success: true,
    totalSales, // Return the total sales for all orders
  });
});


export { createOrder, getSellerOrders, updateOrderStatus, getTotalSalesForAll };
