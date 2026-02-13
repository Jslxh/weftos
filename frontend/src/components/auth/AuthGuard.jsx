import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function AuthGuard({ children }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
