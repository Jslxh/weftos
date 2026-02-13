import api from "./api"

const instanceService = {
  getAll() {
    return api.get("/instances")
  },

  getById(id) {
    return api.get(`/instances/${id}`)
  },

  create(workflowId, data) {
    return api.post("/instances", { workflowId, ...data })
  },

  transition(id, action) {
    return api.post(`/instances/${id}/transition`, { action })
  },

  getLogs(id) {
    return api.get(`/instances/${id}/logs`)
  },
}

export default instanceService
