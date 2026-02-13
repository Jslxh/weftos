import api from "./api"
import { jwtDecode } from "jwt-decode"

const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  async register(username, email, password) {
    return api.post("/auth/register", {
      username,
      email,
      password,
    })
  },

  logout() {
    localStorage.removeItem("token")
  },

  getCurrentUser() {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        return jwtDecode(token)
      }
      return null
    } catch {
      return null
    }
  },
}

export default authService
