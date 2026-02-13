import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import instanceService from "@/services/instanceService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { Play, Search, Filter } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


export default function Instances() {
  const [instances, setInstances] = useState([])
  const [filteredInstances, setFilteredInstances] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const navigate = useNavigate()

  const fetchInstances = useCallback(async () => {
    try {
      setLoading(true)
      const res = await instanceService.getAll()
      // Ensure we handle the response structure correctly
      const data = res.data.data || res.data || []
      setInstances(data)
      setFilteredInstances(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInstances()
  }, [fetchInstances])

  useEffect(() => {
    let result = instances

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.workflowId?.name.toLowerCase().includes(query) ||
          i.initiatedBy?.name.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((i) => i.status === statusFilter)
    }

    setFilteredInstances(result)
  }, [searchQuery, statusFilter, instances])

  const handleView = (id) => {
    navigate(`/instances/${id}`)
  }

  if (loading) {
    return <InstancesSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
         <h2 className="text-3xl font-bold tracking-tight">Workflow Instances</h2>
         <p className="text-muted-foreground">Track and manage your workflow executions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
              placeholder="Search by workflow or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {filteredInstances.length === 0 ? (
        <EmptyState
          icon={Play}
          title={searchQuery || statusFilter !== "All" ? "No matching instances" : "No instances found"}
          description={searchQuery || statusFilter !== "All" ? "Try adjusting your filters." : "Start a workflow to create an instance."}
          action={searchQuery || statusFilter !== "All" ? { label: "Clear Filters", onClick: () => {setSearchQuery(""); setStatusFilter("All")} } : {
            label: "Go to Workflows",
            onClick: () => navigate("/workflows"),
          }}
        />
      ) : (
        <div className="rounded-md border bg-card shadow-sm">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredInstances.map((instance) => (
                <TableRow key={instance._id}>
                    <TableCell className="font-medium">{instance.workflowId?.name}</TableCell>
                    <TableCell>{instance.currentStep}</TableCell>
                    <TableCell>{instance.initiatedBy?.name}</TableCell>
                    <TableCell>
                        <Badge
                            variant={
                            instance.status === "Completed"
                                ? "default"
                                : instance.status === "Running" ? "secondary" : "destructive" // Added destructive for Rejected
                            }
                        >
                            {instance.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(instance._id)}
                    >
                        View Details
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      )}
    </div>
  )
}

function InstancesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
         </div>
         <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-4">
         <Skeleton className="h-10 w-72" />
         <Skeleton className="h-10 w-48" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
