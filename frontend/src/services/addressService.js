// services/addressService.js
import axios from 'axios'

export default {
  getAll() {
    return axios.get('/api/address');
  },
  create(data) {
    return axios.post('/api/address', data);
  },
  update(id, data) {
    return axios.put(`/api/address/${id}`, data);
  },
  destroy(id) {
    return axios.delete(`/api/address/${id}`);
  }
}
