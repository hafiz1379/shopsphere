const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  createReview,
  getCategories,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  updateProduct,
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.delete(
  "/:productId/images/:imageId",
  protect,
  authorize("admin"),
  deleteProductImage,
);

router.post("/:id/reviews", protect, createReview);

module.exports = router;
