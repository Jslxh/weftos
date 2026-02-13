import { useNavigate } from "react-router-dom"
import { useWorkflows } from "@/hooks/useWorkflows"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { GitGraph, Play, Trash2, Power, Plus } from "lucide-react"

export default function Workflows() {
  const { workflows, loading, deleteWorkflow, toggleWorkflow, startWorkflow } = useWorkflows()
  const navigate = useNavigate()

  const handleStart = async (id) => {
    try {
      const instance = await startWorkflow(id)
      navigate(`/instances/${instance._id}`)
    } catch (_) {
      // Error handled by hook toast
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <EmptyState
        icon={GitGraph}
        title="No workflows found"
        description="Get started by creating your first workflow."
        action={{
          label: "Create Workflow",
          onClick: () => navigate("/workflows/create"),
        }}
        className="mt-8"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
          <p className="text-muted-foreground">Manage and automate your processes.</p>
        </div>
        <Button onClick={() => navigate("/workflows/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((wf) => (
          <Card key={wf._id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {wf.name}
              </CardTitle>
              <Badge variant={wf.isActive ? "default" : "secondary"}>
                {wf.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="mt-2 mb-4">
                {wf.steps?.length || 0} steps defined
              </CardDescription>
              
              <div className="flex justify-end gap-2 mt-auto">
                {wf.isActive && (
                  <Button size="sm" onClick={() => handleStart(wf._id)}>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleWorkflow(wf._id, wf.isActive)}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {wf.isActive ? "Deactivate" : "Activate"}
                </Button>

                <ConfirmationDialog
                  trigger={
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                  title={`Delete ${wf.name}?`}
                  description="This action cannot be undone. This will permanently delete the workflow and all associated data."
                  confirmText="Delete"
                  onConfirm={() => deleteWorkflow(wf._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
