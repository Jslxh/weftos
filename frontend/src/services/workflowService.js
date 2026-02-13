import api from "./api"

const workflowService = {
  getAll() {
    return api.get("/workflows")
  },

  getById(id) {
    return api.get(`/workflows/${id}`)
  },

  create(data) {
    return api.post("/workflows", data)
  },

  update(id, data) {
    return api.put(`/workflows/${id}`, data)
  },

  delete(id) {
    return api.delete(`/workflows/${id}`)
  },

  start(id) {
    return api.post(`/workflows/${id}/start`)
  },

  toggleActive(id, isActive) {
     return api.patch(`/workflows/${id}/toggle`, { isActive: !isActive })
  },
}

export default workflowService
