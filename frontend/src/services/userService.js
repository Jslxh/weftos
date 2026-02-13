import api from "./api"

const userService = {
  getAll() {
    return api.get("/users")
  },

  getById(id) {
    return api.get(`/users/${id}`)
  },

  create(userData) {
    return api.post("/users", userData)
  },

  updateRole(id, role) {
    return api.put(`/users/${id}/role`, { role });
  },

  updateProfile(data) {
    return api.put("/users/profile", data);
  },

  changePassword(data) {
    return api.put("/users/password", data);
  },

  delete(id) {
    return api.delete(`/users/${id}`)
  },
}

export default userService
