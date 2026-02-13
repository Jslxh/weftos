const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", protect, (req, res) => {
    res.json({ message: "Protected route accessed", user: req.user });
});

router.get("/admin", protect, authorize("Admin"), (req, res) => {
    res.json({ message: "Admin route accessed", user: req.user });
});

module.exports = router;