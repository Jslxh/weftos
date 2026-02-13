import { useState } from "react"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import authService from "@/services/authService"
import { useAuth } from "@/hooks/useAuth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await authService.login(email, password)
      login(res.token)
      navigate("/dashboard")
    } catch {
      toast.error("Invalid credentials")
    }
  }

  return (
    <>
      <Card className="w-96">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="w-full">Login</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-primary hover:text-primary/80">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
