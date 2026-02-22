const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, updatePassword);

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUserByAdmin);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
