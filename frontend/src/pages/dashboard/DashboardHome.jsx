import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import dashboardService from "@/services/dashboardService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, CheckCircle, Clock, GitGraph, Play, XCircle, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { KPICard } from "@/components/dashboard/KPICard"

export default function DashboardHome() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await dashboardService.getMetrics()
        setMetrics(res.data.data)
      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!metrics) {
    return <div className="p-4">Failed to load dashboard data.</div>
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your workflow ecosystem.</p>
      </div>

      {/* KPI Cards */}
      <motion.div 
        variants={itemVariants} 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <KPICard
          title="Total Workflows"
          value={metrics.totalWorkflows}
          subtext={`${metrics.activeWorkflows} active`}
          icon={GitGraph}
          color="text-blue-600"
        />
        <KPICard
          title="Total Instances"
          value={metrics.totalInstances}
          subtext="Lifetime executions"
          icon={Play}
          color="text-purple-600"
        />
        <KPICard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          subtext={`${metrics.completedInstances} completed`}
          icon={CheckCircle}
          color="text-green-600"
        />
        <KPICard
          title="Running Now"
          value={metrics.runningInstances}
          subtext="Currently active"
          icon={Clock}
          color="text-orange-600"
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        variants={itemVariants} 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-4 clay-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityList activities={metrics.recentActivity} />
          </CardContent>
        </Card>

        {/* Status Breakdown (Optional/Placeholder for future chart) */}
        <Card className="col-span-3 clay-card">
          <CardHeader>
            <CardTitle>Instance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatusRow label="Completed" value={metrics.completedInstances} total={metrics.totalInstances} color="bg-green-500" />
              <StatusRow label="Running" value={metrics.runningInstances} total={metrics.totalInstances} color="bg-orange-500" />
              <StatusRow label="Rejected" value={metrics.rejectedInstances} total={metrics.totalInstances} color="bg-red-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}



function RecentActivityList({ activities }) {
  if (!activities || activities.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent activity.</div>
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-center">
          <Avatar className="h-9 w-9">
             <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-5 w-5" />
             </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.workflowId?.name || "Unknown Workflow"}</p>
            <p className="text-sm text-muted-foreground">
              Initiated by {activity.initiatedBy?.username || "Unknown"}
            </p>
          </div>
          <div className="ml-auto font-medium">
             <BadgeStatus status={activity.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BadgeStatus({ status }) {
    const styles = {
        Completed: "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs",
        Running: "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs",
        Rejected: "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs",
    }
    return <span className={styles[status] || "text-gray-600"}>{status}</span>
}

function StatusRow({ label, value, total, color }) {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0
    return (
        <div className="flex items-center">
             <div className={`w-2 h-2 rounded-full mr-2 ${color}`} />
             <div className="flex-1 text-sm font-medium">{label}</div>
             <div className="text-sm text-muted-foreground">{value} ({percentage}%)</div>
        </div>
    )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-64" />
        <Skeleton className="col-span-3 h-64" />
      </div>
    </div>
  )
}
