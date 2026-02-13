import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4 text-center">
          <div className="bg-background border rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Go Home
              </Button>
            </div>
            {import.meta.env.VITE_NODE_ENV === "development" && (
              <div className="mt-6 text-left bg-muted p-4 rounded text-xs font-mono overflow-auto max-h-40">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
