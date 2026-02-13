const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Public/Self routes
router.put("/profile", protect, require("../controllers/userController").updateUserProfile);
router.put("/password", protect, require("../controllers/userController").changePassword);

// Admin only routes
router.post("/", protect, authorize("Admin"), createUser);
router.get("/", protect, authorize("Admin"), getUsers);
router.delete("/:id", protect, authorize("Admin"), deleteUser);
router.put("/:id/role", protect, authorize("Admin"), require("../controllers/userController").updateRole);

module.exports = router;
