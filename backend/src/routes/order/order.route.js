import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { createOrder, getSellerOrders, getTotalSalesForAll, updateOrderStatus } from "../../controllers/order/order.controller.js";
import { verifySeller } from "../../middleware/isSeller.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";


const router = Router()

router.route("/create").post(verifyJWT, createOrder)
router.route("/getAllOrders").get(verifyJWT, getSellerOrders)
router.route("/allTotalSales").get(verifyJWT, getTotalSalesForAll)
router.route("/updateOrderStatus").put(verifySeller,verifyJWT, updateOrderStatus)

export default router