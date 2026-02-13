const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  allowedRoles: [
    {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      required: true,
    },
  ],
});

const transitionSchema = new mongoose.Schema({
  fromStep: {
    type: String,
    required: true,
  },
  toStep: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

const workflowDefinitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    steps: [stepSchema],

    transitions: [transitionSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkflowDefinition", workflowDefinitionSchema);
