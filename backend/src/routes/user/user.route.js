import { Router } from "express";
import { upload } from "../../middleware/multer.middleware.js";
import {
  ForgotPassword,
  getAllUsers,
  getMostActiveUsers,
  getUserDetails,
  getUserFirstName,
  getUserRole,
  getUserStats,
  loginUser,
  logoutUser,
  registerUser,
  removeUser,
  ResetPassword,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";

const router = Router();

router.route("/register").post(upload.single('image'), registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/userDetails").get(verifyJWT, getUserDetails);
router.route("/getUserFirstName").get(verifyJWT, getUserFirstName);
router.route("/getUserRole").get(verifyJWT, getUserRole);
router.route("/getAllUsers").get(verifyAdmin, verifyJWT, getAllUsers);
router
  .route("/mostActiveUsers")
  .get(verifyAdmin, verifyJWT, getMostActiveUsers);
router
  .route("/getUserStats")
  .get(verifyAdmin, verifyJWT, getUserStats);
router.route("/removeUser/:userId").delete(verifyAdmin, verifyJWT, removeUser);



export default router;
