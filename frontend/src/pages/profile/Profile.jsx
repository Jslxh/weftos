import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import userService from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User, Lock, Building } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    try {
      await userService.updateProfile(data)
      // Update local storage/context if needed, or just notify
      // Assuming context updates on next fetch or we can force update
      // For now, simple success
       // Ideally update the auth context user
      // login(localStorage.getItem('token')) // brute force refresh user
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match")
        setPasswordLoading(false)
        return
    }

    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      toast.success("Password changed successfully")
      e.target.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and security settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="clay-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Personal Information
            </CardTitle>
            <CardDescription>Update your public display name and email.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.name || user?.username} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} required />
              </div>
               <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className="capitalize">{user?.role}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="clay-card">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Security
            </CardTitle>
            <CardDescription>Change your password to keep your account secure.</CardDescription>
          </CardHeader>
          <form onSubmit={handleChangePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="outline" disabled={passwordLoading}>
                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
