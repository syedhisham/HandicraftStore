import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { addProduct, deleteProduct, getAllProducts, getAllProductsByCategory, getMyProducts, getMyTotalProducts, getProductById, getUserProductsWithRatings, updateProductSelective } from "../../controllers/product/product.controller.js";
import { verifySeller } from "../../middleware/isSeller.middleware.js";


const router = Router();
//Routes
router.route("/getAllProducts").get(getAllProducts);
router.route("/getAllProductsByCategory").get(getAllProductsByCategory);
router.route("/productById/:productId").get(getProductById);

//Secure Routes
router.route("/getRatedProductStats").get(verifyJWT,getUserProductsWithRatings);

router
  .route("/addProduct")
  .post(upload.array("images", 20), verifySeller, verifyJWT, addProduct);
router
  .route("/myProducts").get(verifySeller, verifyJWT, getMyProducts);
router
  .route("/myTotalProducts").get(verifySeller, verifyJWT, getMyTotalProducts);
router
  .route("/deleteProduct/:productId").delete(verifySeller, verifyJWT, deleteProduct);
router
  .route("/updateProduct/:productId").put(upload.array("images", 20),verifySeller, verifyJWT, updateProductSelective);

  export default router;