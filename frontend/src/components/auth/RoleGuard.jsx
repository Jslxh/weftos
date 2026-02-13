import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function RoleGuard({ allowedRoles, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null // or a spinner, but AuthGuard probably handled it
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? children : <Outlet />
}
