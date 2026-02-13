import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { LayoutDashboard, GitGraph, Box, Users, Shield } from "lucide-react"

export default function Sidebar() {
  const { user } = useAuth()

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    // Workflows: Hidden for Employees
    ...(["Admin", "Manager"].includes(user?.role) ? [{ label: "Workflows", href: "/workflows", icon: GitGraph }] : []),
    { label: "Instances", href: "/instances", icon: Box },
  ]

  const adminItems = [
    { label: "Users", href: "/users", icon: Users },
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">WeftOS</h2>
        <p className="text-sm text-muted-foreground">Workflow OS</p>
      </div>
      <Separator />
      
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {({ isActive }) => (
                  <Button
                  variant="ghost"
                  className={cn("w-full justify-start gap-4 hover:bg-primary/5 transition-all duration-300", isActive && "sidebar-active")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )}
            </NavLink>
          ))}

          {user?.role === "Admin" && (
            <>
              <div className="mt-4 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase">
                Admin
              </div>
              {adminItems.map((item) => (
                <NavLink key={item.href} to={item.href}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start gap-4 hover:bg-primary/5 transition-all duration-300", isActive && "sidebar-active")}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">{user?.username || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || "Guest"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
