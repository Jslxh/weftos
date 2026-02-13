import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import instanceService from "@/services/instanceService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function InstanceDetail() {
  const { id } = useParams()
  const { user } = useAuth() 

  const [instance, setInstance] = useState(null)
  const [logs, setLogs] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fetchInstance = useCallback(async () => {
    try {
      const res = await instanceService.getById(id)
      setInstance(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  const fetchLogs = useCallback(async () => {
    try {
      const res = await instanceService.getLogs(id)
      setLogs(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    const loadData = async () => {
      await fetchInstance()
      await fetchLogs()
    }
    loadData()
  }, [fetchInstance, fetchLogs])

  const handleTransition = async (action) => {
    try {
      setSubmitting(true)
      await instanceService.transition(id, action)
      toast.success("Transition successful")
      await fetchInstance()
      await fetchLogs()
    } catch (err) {
      toast.error("Transition failed")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!instance) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  // ✅ Determine current step config
  const currentStepConfig =
    instance.workflowId.steps.find(
      (step) => step.name === instance.currentStep
    )

  // ✅ Check role permission
  const roleAllowed =
    currentStepConfig?.allowedRoles.includes(user?.role)

  // ✅ Get transitions only if role allowed
  const availableTransitions =
    roleAllowed
      ? instance.workflowId.transitions.filter(
          (t) => t.fromStep === instance.currentStep
        )
      : []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold">
                    {instance.workflowId.name}
                </h1>
                <p className="text-muted-foreground">
                    Instance ID: {instance._id}
                </p>
            </div>
             <Button variant="outline" onClick={() => window.history.back()}>
                Back to Instances
             </Button>
        </div>
      </div>

      {/* Visual Step Indicator */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded" />
        <div className="flex justify-between items-center">
            {instance.workflowId.steps.map((step, index) => {
                const isCurrent = step.name === instance.currentStep;
                // const isCompleted = false; // logic for completed requires parsing logs, simpler to just highlight current for now
                
                return (
                    <div key={index} className="flex flex-col items-center bg-background px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCurrent ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-card text-muted-foreground'}`}>
                            {index + 1}
                        </div>
                        <span className={`text-xs mt-1 font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                            {step.name}
                        </span>
                    </div>
                )
            })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
                <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                <p className="text-sm text-muted-foreground">
                    Current Step
                </p>
                <h2 className="text-lg font-semibold">
                    {instance.currentStep}
                </h2>
                </div>

                <Badge
                variant={
                    instance.status === "Completed"
                    ? "default"
                    : instance.status === "Running" ? "secondary" : "destructive"
                }
                >
                {instance.status}
                </Badge>
            </div>

            <Separator />

            <div>
                <p className="text-sm text-muted-foreground">
                Initiated By
                </p>
                <p>{instance.initiatedBy.name}</p>
            </div>
            </CardContent>
          </Card>

          {/* Available Actions */}
          {instance.status !== "Completed" && instance.status !== "Rejected" && (
            <Card>
            <CardHeader>
                <CardTitle>Available Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {availableTransitions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                    <p className="text-muted-foreground">
                     No actions available for your role ({user?.role}) at this step.
                    </p>
                </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                    {availableTransitions.map((t, index) => (
                        <Button
                        key={index}
                        onClick={() => handleTransition(t.action)}
                        disabled={submitting}
                        className="w-full"
                        >
                         {submitting ? "Processing..." : t.action}
                        </Button>
                    ))}
                    </div>
                )}
            </CardContent>
            </Card>
          )}
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
            <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No activity yet
            </p>
          )}

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {logs.map((log) => (
                <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted group-[.is-active]:bg-emerald-500 text-muted-foreground group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                            <path fillRule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"/>
                        </svg>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded border border-border shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-foreground">{log.action}</div>
                            <time className="font-caveat font-medium text-indigo-500">{new Date(log.createdAt).toLocaleString()}</time>
                        </div>
                        <div className="text-muted-foreground">Transitioned from <span className="font-medium text-foreground">{log.fromStep}</span> to <span className="font-medium text-foreground">{log.toStep}</span></div>
                    </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
