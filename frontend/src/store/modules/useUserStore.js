import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('Users', () => {

  async function getAuthenticatedUser() {
    try {
      const response = await axios.get('/api/me')
      return response.data.user
    } catch (error) {
      console.error('Failed to fetch authenticated user:', error)
      return null
    }
  }
  
  return {
    getAuthenticatedUser,
  }
});


