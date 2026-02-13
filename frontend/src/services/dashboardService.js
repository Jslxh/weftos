import api from "./api"

const dashboardService = {
  getMetrics() {
    return api.get("/dashboard/metrics")
  },
}

export default dashboardService
