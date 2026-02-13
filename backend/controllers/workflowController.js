const workflowEngine = require("../services/workflowEngine");
const WorkflowDefinition = require("../models/WorkflowDefinition");

exports.startInstance = async (req, res) => {
  try {
    const { workflowId } = req.body;

    const instance = await workflowEngine.startWorkflow(
      workflowId,
      req.user
    );

    res.status(201).json(instance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.transitionInstance = async (req, res) => {
  try {
    const { action } = req.body;

    const instance = await workflowEngine.transitionWorkflow(
      req.params.id,
      action,
      req.user
    );

    res.status(200).json(instance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createWorkflow = async (req, res) => {
  try {
    const workflow = await WorkflowDefinition.create({
      name: req.body.name,
      organizationId: req.user.organizationId,
      steps: req.body.steps,
      transitions: req.body.transitions,
      isActive: true
    });

    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
