import { useState, useEffect } from "react"
import authService from "@/services/authService"
import { AuthContext } from "./AuthContextUpdated"

export { AuthContext }

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setToken(localStorage.getItem("token"))
      } else {
        authService.logout()
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (jwt) => {
    localStorage.setItem("token", jwt)
    setToken(jwt)
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }

  const logout = () => {
    authService.logout()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
