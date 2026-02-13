import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Globe,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const isAdmin = user?.role === "Admin";
  const isManager = user?.role === "Manager" || isAdmin;

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and organization settings.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Preferences - All Users */}
        <Card className="clay-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" /> General Preferences
            </CardTitle>
            <CardDescription>
              Customize your personal view and interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily digest of activity.
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred appearance.
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Manager/Admin Section */}
        {isManager && (
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Rules
              </CardTitle>
              <CardDescription>
                Configure when alerts are triggered for workflow failures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Failed Workflow Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify immediately on critical failures.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Only Section */}
        {isAdmin && (
          <Card className="clay-card border-l-4 border-l-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Organization Settings
              </CardTitle>
              <CardDescription>
                Manage organization-wide configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input defaultValue="WeftOS Inc." />
              </div>
              <div className="space-y-2">
                <Label>Default User Role</Label>
                <Input defaultValue="Employee" disabled />
                <p className="text-xs text-muted-foreground">
                  New users will be assigned this role by default.
                </p>
              </div>
              <div className="pt-2">
                <Button onClick={handleSave}>Save Organization Settings</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
