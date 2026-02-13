const mongoose = require("mongoose");

const workflowInstanceSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowDefinition",
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    currentStep: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Running", "Completed", "Rejected"],
      default: "Running",
    },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkflowInstance", workflowInstanceSchema);
