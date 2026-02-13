const WorkflowInstance = require("../models/WorkflowInstance")

// GET /api/v1/instances
exports.getAllInstances = async (req, res) => {
  try {
    const { status } = req.query

    const filter = {
      organizationId: req.user.organizationId,
    }

    if (status) {
      filter.status = status
    }

    const instances = await WorkflowInstance.find(filter)
      .populate("workflowId", "name")
      .populate("initiatedBy", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: instances.length,
      data: instances,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// GET /api/v1/instances/:id
exports.getInstanceById = async (req, res) => {
  try {
    const instance = await WorkflowInstance.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    })
      .populate("workflowId", "name steps transitions")
      .populate("initiatedBy", "name email")

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: "Instance not found",
      })
    }

    res.status(200).json({
      success: true,
      data: instance,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
