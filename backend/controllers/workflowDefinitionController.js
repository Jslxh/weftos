const WorkflowDefinition = require("../models/WorkflowDefinition");
const mongoose = require("mongoose");

/**
 * Create Workflow
 */
exports.createWorkflow = async (req, res, next) => {
  try {
    const { name, steps, transitions } = req.body;

    if (!name || !steps || !transitions) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const workflow = await WorkflowDefinition.create({
      name,
      organizationId: req.user.organizationId,
      steps,
      transitions,
      isActive: true,
    });

    res.status(201).json(workflow);
  } catch (error) {
    next(error);
  }
};


/**
 * Get All Workflows (same org)
 */
exports.getWorkflows = async (req, res) => {
  try {
    const workflows = await WorkflowDefinition.find({
      organizationId: req.user.organizationId,
    });

    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get Single Workflow
 */
exports.getWorkflowById = async (req, res, next) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid ID format");
    }

    const workflow = await WorkflowDefinition.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!workflow) {
      res.status(404);
      throw new Error("Workflow not found");
    }

    res.status(200).json(workflow);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Workflow
 */
exports.updateWorkflow = async (req, res) => {
  try {
    const workflow = await WorkflowDefinition.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      req.body,
      { new: true }
    );

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Delete Workflow
 */
exports.deleteWorkflow = async (req, res, next) => {
  try {
    const workflow = await WorkflowDefinition.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!workflow) {
      res.status(404);
      throw new Error("Workflow not found");
    }

    res.status(200).json({
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

