import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.")
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.")
    } else if (!status) {
      toast.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  }
)

export default api
