const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    workflowInstanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowInstance",
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    fromStep: {
      type: String,
      required: true,
    },

    toStep: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
