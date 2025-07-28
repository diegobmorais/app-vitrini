import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const session_id = ref(null)
  const initialized = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => !!user.value)
  const getUser = computed(() => ({ ...user.value }))
  const getSessionId = computed(() => session_id.value)
  const isInitialized = computed(() => initialized.value)

  // Actions
  async function login(data) {
    try {
      await axios.get('sanctum/csrf-cookie')
      const response = await axios.post(data.url, data.credentials)

      user.value = response.data.user
      session_id.value = response.data.session_id
      token.value = response.data.token ?? null

      axios.defaults.headers.common['X-Session-ID'] = response.data.session_id

      return response
    } catch (error) {
      logout()
      throw error
    }
  }

  async function logout() {
    try {
      await axios.post('/api/logout')
    } catch (error) {
      console.warn('Erro ao chamar /api/logout:', error)
    }
    clearSession()
  }

  function clearSession() {
    user.value = null
    token.value = null
    session_id.value = null
  }

  async function checkAuth() {
    try {
      if (initialized.value) {
        return !!user.value
      }

      const response = await axios.get('/api/check-auth')
      user.value = response.data
      initialized.value = true

      return true
    } catch (error) {
      if (error.response?.status === 401) {
        initialized.value = true
        return false
      }
      console.error('Erro inesperado no checkAuth:', error)
      initialized.value = true
      return false
    }
  }

  return {
    // state
    user,
    token,
    session_id,
    initialized,

    // getters
    isAuthenticated,
    getUser,
    getSessionId,
    isInitialized,

    // actions
    login,
    logout,
    checkAuth,
  }
})
