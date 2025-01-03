import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  createAComment,
  createARating,
  deleteAComment,
  getAllCommentsOnAProduct,
  getAllRatings,
  getAverageRating,
  getCurrentUserComment,
  getCurrentUserRating,
  updateAComment,
} from "../../controllers/review/review.controller.js";
const router = Router();

// Comment Routes
router.route("/product/:productId/comment").post(verifyJWT, createAComment);
router
  .route("/user/:userId/product/:productId/comment")
  .get(verifyJWT, getCurrentUserComment);
router.route("/comment/:commentId").patch(verifyJWT, updateAComment);
router.route("/comment/:commentId").delete(verifyJWT, deleteAComment);
router.route("/product/:productId/allComments").get(getAllCommentsOnAProduct);

// Rating Routes
router.route("/product/:productId/rating").post(verifyJWT, createARating);
router.route("/product/:productId/rating").get(verifyJWT, getCurrentUserRating);
router.route("/product/:productId/avgRating").get(getAverageRating);
router.route("/product/:productId/ratingDistribution").get(getAllRatings);

export default router;
