import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function LoadingSpinner({ className, size = 24, text }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary")} size={size} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <LoadingSpinner size={40} />
    </div>
  )
}
