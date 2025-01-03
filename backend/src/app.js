import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //For handling form data (configuration)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //For handling URL data (configuration)
app.use(express.static("public")); //For public assets (configuration)
app.use(cookieParser());

//imports
import userRoutes from "./routes/user/user.route.js";
import productRoutes from "./routes/products/product.route.js"
import reviewRoutes from "./routes/review/review.routes.js"
import cartRoutes from "./routes/cart/cart.routes.js";
import orderRoutes from "./routes/order/order.route.js"
import sessionRoutes from './routes/session/session.route.js'

//routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/session", sessionRoutes);



export { app };
