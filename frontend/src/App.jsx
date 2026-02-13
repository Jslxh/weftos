import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import AppLayout from "@/layout/AppLayout"
import AuthLayout from "@/layout/AuthLayout"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import Workflows from "@/pages/workflows/Workflows"
import CreateWorkflow from "@/pages/workflows/CreateWorkflow"
import Instances from "@/pages/instances/Instances"
import InstanceDetail from "@/pages/instances/InstanceDetail"
import AuthGuard from "@/components/auth/AuthGuard"
import RoleGuard from "@/components/auth/RoleGuard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/ErrorBoundary"

import DashboardHome from "@/pages/dashboard/DashboardHome"

import Users from "@/pages/dashboard/Users"
import Profile from "@/pages/profile/Profile"
import Settings from "@/pages/settings/Settings"

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Public Routes with AuthLayout */}
            <Route element={<AuthLayout><Outlet /></AuthLayout>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Home redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <AuthGuard>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/workflows" element={
                        <RoleGuard allowedRoles={['Admin', 'Manager']}>
                            <Workflows />
                        </RoleGuard>
                    } />
                    <Route path="/workflows/create" element={
                        <RoleGuard allowedRoles={['Admin', 'Manager']}>
                            <CreateWorkflow />
                        </RoleGuard>
                    } />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/instances" element={<Instances />} />
                    <Route path="/instances/:id" element={<InstanceDetail />} />
                    <Route path="/users" element={
                        <RoleGuard allowedRoles={['Admin']}>
                            <Users />
                        </RoleGuard>
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Routes>
                </AuthGuard>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
