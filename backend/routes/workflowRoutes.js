const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { createWorkflow } = require("../controllers/workflowController");
const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");

const {
  transitionInstance,
  startInstance,
} = require("../controllers/workflowController");

const {
  getAllInstances,
  getInstanceById,
} = require("../controllers/workflowInstanceController")

const router = express.Router();

// Transition workflow instance
router.get("/", protect, getAllInstances)
router.get("/:id", protect, getInstanceById)
router.post("/:id/transition", protect, transitionInstance);
router.post("/", protect, authorize("Admin"), createWorkflow);
router.post("/:id/start", protect, authorize("Admin"), startInstance);

// Get logs for an instance
router.get("/:id/logs", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid instance ID");
    }

    const logs = await ActivityLog.find({
      workflowInstanceId: req.params.id,
      organizationId: req.user.organizationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;