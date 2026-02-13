const WorkflowDefinition = require("../models/WorkflowDefinition");
const WorkflowInstance = require("../models/WorkflowInstance");
const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");
/**
 * Start a new workflow instance
 */
exports.startWorkflow = async (workflowId, user) => {

  console.log("Incoming workflowId:", workflowId);
  console.log("User orgId:", user.organizationId);
  console.log("Type of user orgId:", typeof user.organizationId);

  const workflow = await WorkflowDefinition.findOne({
    _id: workflowId,
    organizationId: user.organizationId,
    isActive: true,
  });

  console.log("Workflow found:", workflow);

  if (!workflow) {
    throw new Error("Workflow not found or inactive");
  }

  const firstStep = workflow.steps[0];

  if (!firstStep) {
    throw new Error("Workflow has no steps defined");
  }

  const instance = await WorkflowInstance.create({
    workflowId: workflow._id,
    organizationId: user.organizationId,
    currentStep: firstStep.name,
    initiatedBy: user._id,
  });

  return instance;
};

/**
 * Transition workflow instance
 */
exports.transitionWorkflow = async (instanceId, action, user) => {
  if (!user || !user.organizationId) {
    throw new Error("User context required involving organizationId");
  }

  // 1️⃣ Fetch instance
 const instance = await WorkflowInstance.findOne({
    _id: instanceId,
    organizationId: new mongoose.Types.ObjectId(user.organizationId),
  });

  if (!instance) {
    throw new Error("Workflow instance not found");
  }

  if (instance.status !== "Running") {
    throw new Error("Workflow already completed");
  }

  // 2️⃣ Fetch workflow definition
  const workflow = await WorkflowDefinition.findById(instance.workflowId);

  // 3️⃣ Find current step config
  const currentStepConfig = workflow.steps.find(
    (step) => step.name === instance.currentStep
  );

  if (!currentStepConfig) {
    throw new Error("Invalid current step");
  }

  // 4️⃣ Validate role
  if (!currentStepConfig.allowedRoles.includes(user.role)) {
    throw new Error("You are not allowed to perform action on this step");
  }

  // 5️⃣ Find valid transition
  const validTransition = workflow.transitions.find(
    (t) =>
      t.fromStep === instance.currentStep &&
      t.action === action
  );

  if (!validTransition) {
    throw new Error("Invalid transition action");
  }

  const previousStep = instance.currentStep;

  // 6️⃣ Update instance step
  instance.currentStep = validTransition.toStep;

  // Optional: mark as completed if no further transitions
  const hasNextTransition = workflow.transitions.some(
    (t) => t.fromStep === validTransition.toStep
  );

  if (!hasNextTransition) {
    instance.status = "Completed";
  }

  await instance.save();

  // 7️⃣ Log activity
  await ActivityLog.create({
    workflowInstanceId: instance._id,
    organizationId: user.organizationId,
    performedBy: user._id,
    action: action,
    fromStep: previousStep,
    toStep: validTransition.toStep,
  });

  return instance;
};
