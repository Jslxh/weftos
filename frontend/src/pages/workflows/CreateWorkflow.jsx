import { useState } from "react"
import { toast } from "sonner"
import workflowService from "@/services/workflowService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateWorkflow() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [steps, setSteps] = useState([
    { name: "", allowedRoles: [] }
  ])
  const [transitions, setTransitions] = useState([
    { fromStep: "", toStep: "", action: "" }
  ])

  const addStep = () => {
    setSteps([...steps, { name: "", allowedRoles: [] }])
  }

  const addTransition = () => {
    setTransitions([...transitions, { fromStep: "", toStep: "", action: "" }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name) {
      toast.error("Workflow name required")
      return
    }

    if (steps.some(s => !s.name || s.allowedRoles.length === 0)) {
      toast.error("All steps must have name and role")
      return
    }

    if (transitions.some(t => !t.fromStep || !t.toStep || !t.action)) {
      toast.error("All transitions must be complete")
      return
    }

    try {
      await workflowService.create({
        name,
        steps,
        transitions,
        isActive: true,
      })

      toast.success("Workflow created successfully")
      navigate("/workflows")
    } catch (err) {
      toast.error("Error creating workflow")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Workflow</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Workflow Name */}
            <div>
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Steps Section */}
            <div className="space-y-4">
              <h2 className="font-semibold">Steps</h2>

              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 items-center">

                  {/* Step Name */}
                  <Input
                    placeholder="Step Name"
                    value={step.name}
                    onChange={(e) => {
                      const newSteps = [...steps]
                      newSteps[index].name = e.target.value
                      setSteps(newSteps)
                    }}
                  />

                  {/* Role Select */}
                  <Select
                    onValueChange={(value) => {
                      const newSteps = [...steps]
                      newSteps[index].allowedRoles = [value]
                      setSteps(newSteps)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
              ))}

              <Button type="button" onClick={addStep}>
                Add Step
              </Button>
            </div>

            {/* Transitions Section */}
            <div className="space-y-4">
              <h2 className="font-semibold">Transitions</h2>

              {transitions.map((t, index) => (
                <div key={index} className="flex gap-4 items-center">

                  {/* From Step */}
                  <Select
                    onValueChange={(value) => {
                      const newTransitions = [...transitions]
                      newTransitions[index].fromStep = value
                      setTransitions(newTransitions)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="From Step" />
                    </SelectTrigger>
                    <SelectContent>
                      {steps
                        .filter(step => step.name.trim() !== "")
                        .map((step, i) => (
                          <SelectItem key={i} value={step.name}>
                            {step.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* To Step */}
                  <Select
                    onValueChange={(value) => {
                      const newTransitions = [...transitions]
                      newTransitions[index].toStep = value
                      setTransitions(newTransitions)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="To Step" />
                    </SelectTrigger>
                    <SelectContent>
                      {steps
                        .filter(step => step.name.trim() !== "")
                        .map((step, i) => (
                          <SelectItem key={i} value={step.name}>
                            {step.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* Action */}
                  <Input
                    placeholder="Action"
                    value={t.action}
                    onChange={(e) => {
                      const newTransitions = [...transitions]
                      newTransitions[index].action = e.target.value
                      setTransitions(newTransitions)
                    }}
                  />

                </div>
              ))}

              <Button type="button" onClick={addTransition}>
                Add Transition
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Create Workflow
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
