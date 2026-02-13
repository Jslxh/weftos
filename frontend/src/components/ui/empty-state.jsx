import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  children,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 min-h-[300px]", className)}>
      {Icon && (
        <div className="flex bg-background p-4 rounded-full mb-4 shadow-sm">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant={action.variant || "default"}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  )
}
