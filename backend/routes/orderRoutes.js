const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  createStripePaymentIntent,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
  validateDiscount,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.post("/validate-discount", protect, validateDiscount);
router.post("/create-payment-intent", protect, createStripePaymentIntent);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);

router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
