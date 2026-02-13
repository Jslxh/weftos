const WorkflowDefinition = require("../models/WorkflowDefinition");
const WorkflowInstance = require("../models/WorkflowInstance");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const totalWorkflows = await WorkflowDefinition.countDocuments({
      organizationId,
    });

    const activeWorkflows = await WorkflowDefinition.countDocuments({
      organizationId,
      isActive: true,
    });

    const totalInstances = await WorkflowInstance.countDocuments({
      organizationId,
    });

    const completedInstances = await WorkflowInstance.countDocuments({
      organizationId,
      status: "Completed",
    });

    const runningInstances = await WorkflowInstance.countDocuments({
      organizationId,
      status: "Running",
    });

    const rejectedInstances = await WorkflowInstance.countDocuments({
        organizationId,
        status: "Rejected",
    })

    const completionRate =
      totalInstances > 0
        ? Math.round((completedInstances / totalInstances) * 100)
        : 0;

    const recentActivity = await WorkflowInstance.find({ organizationId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("workflowId", "name")
      .populate("initiatedBy", "username");

    res.status(200).json({
      status: "success",
      data: {
        totalWorkflows,
        activeWorkflows,
        totalInstances,
        completedInstances,
        runningInstances,
        rejectedInstances,
        completionRate,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard metrics",
    });
  }
};
