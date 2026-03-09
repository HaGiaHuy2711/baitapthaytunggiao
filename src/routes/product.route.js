const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", productController.getProducts);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "mod"]),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "mod"]),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.deleteProduct
);

module.exports = router;