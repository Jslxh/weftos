import { useState } from "react"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"
import authService from "@/services/authService"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [organizationName, setOrganizationName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await authService.register(organizationName, name, email, password)

      // Save token
      login(res.data.token)

      navigate("/dashboard")
    } catch (err) {
      toast.error("Registration failed")
      console.error(err)
    }
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">

          <h1 className="text-2xl font-bold text-center">
            Register Organization
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />

            <Input
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Register
            </Button>

          </form>

          <p className="text-sm text-center">
            Already have account?{" "}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>

        </CardContent>
      </Card>
    </>
  )
}
