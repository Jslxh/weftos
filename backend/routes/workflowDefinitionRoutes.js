const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const workflowEngine = require("../services/workflowEngine");

const {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} = require("../controllers/workflowDefinitionController");

const router = express.Router();

// Admin can create/update/delete
router.post("/", protect, authorize("Admin"), createWorkflow);
router.put("/:id", protect, authorize("Admin"), updateWorkflow);
router.delete("/:id", protect, authorize("Admin"), deleteWorkflow);

// Any authenticated user can view
router.get("/", protect, getWorkflows);
router.get("/:id", protect, getWorkflowById);
router.post("/:id/start", protect, async (req, res, next) => {
  try {
    const instance = await workflowEngine.startWorkflow(
      req.params.id,
      req.user
    );

    res.status(201).json(instance);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
