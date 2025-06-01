// services/userService.js
import axios from 'axios';

export async function getAuthenticatedUser() {
  const response = await axios.get('/api/me');
  return response.data.user;
}
