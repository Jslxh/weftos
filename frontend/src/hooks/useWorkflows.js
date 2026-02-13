import { useState, useCallback, useEffect } from "react"
import workflowService from "@/services/workflowService"
import { toast } from "sonner"

export function useWorkflows() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWorkflows = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await workflowService.getAll()
      setWorkflows(res.data.data || [])
    } catch (err) {
      setError(err)
      toast.error("Failed to fetch workflows")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const deleteWorkflow = async (id) => {
    try {
      await workflowService.delete(id)
      setWorkflows((prev) => prev.filter((w) => w._id !== id))
      toast.success("Workflow deleted successfully")
    } catch (err) {
      toast.error("Failed to delete workflow")
      console.error(err)
      throw err
    }
  }

  const toggleWorkflow = async (id, isActive) => {
    try {
      await workflowService.toggleActive(id, isActive)
      setWorkflows((prev) =>
        prev.map((w) =>
          w._id === id ? { ...w, isActive: !isActive } : w
        )
      )
      toast.success(isActive ? "Workflow deactivated" : "Workflow activated")
    } catch (err) {
      toast.error("Failed to toggle workflow status")
      console.error(err)
      throw err
    }
  }

  const startWorkflow = async (id) => {
    try {
      const instance = await workflowService.start(id)
      toast.success("Workflow started successfully")
      return instance
    } catch (err) {
      toast.error("Failed to start workflow")
      console.error(err)
      throw err
    }
  }

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    deleteWorkflow,
    toggleWorkflow,
    startWorkflow
  }
}
