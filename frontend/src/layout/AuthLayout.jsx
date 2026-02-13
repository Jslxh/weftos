export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Optional: Add a subtle background pattern or gradient blob if desired for "full" effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {children}
      </div>
    </div>
  )
}
