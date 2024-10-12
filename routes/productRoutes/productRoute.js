const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController/productController");
const multerMiddleware = require("../../middleware/multer.middleware");

//Blank Commit//

router.get("/src", productController.getAllProductsControllers);
router.get("/src/all", productController.idealGetAllProds);
router.get("/src/byid/:id", productController.showSingleProdController);
router.get(
  "/src/category/:id",
  productController.getAllCategorisedProductsControllers
);
router.get("/deleted/src", productController.getAllDeletedProductsControllers);
router.get("/del/:id", productController.productDeleteController);
router.get("/actv/:id", productController.productAcitvateController);
router.post("/upt/:id", productController.productUpdateController);
router.get("/src/popular/all");
router.post(
  "/crt",
  multerMiddleware.fields([
    { name: "productThumb", maxCount: 1 },
    { name: "productImg", maxCount: 5 },
  ]),
  productController.createProductController
);

module.exports = router;
