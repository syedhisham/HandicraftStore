import { Router } from "express";
import { createCheckoutSession,getSessionStatus,completeSession } from '../../controllers/session/session.controller.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// Route to create checkout session
router.route('/create-checkout-session').post(verifyJWT, createCheckoutSession);
// router.route("/product/:productId/comment").post(verifyJWT, createAComment);

// Route to retrieve session status
router.route('/session-status').get(verifyJWT,getSessionStatus);

router.route('/complete-session').post(verifyJWT,completeSession);


export default router;
