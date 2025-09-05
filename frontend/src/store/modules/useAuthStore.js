import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    session_id: null,
    initialized: false,
    authenticated: false,  
  }),

  getters: {
    isAuthenticated: (state) => !!state.authenticated,
    getUser: (state) => state.user,
    getSessionId: (state) => state.session_id,
    isInitialized: (state) => state.initialized,
    userRole: (state) => state.user?.role_id || null,
    isAdmin: (state) => state.user?.role_id === 1,
    defaultAddress: (state) => {
      return state.user.addresses?.find(addr => addr.for_delivery === true) || null
    }
  },

  actions: {
    /**
     * Realiza login do usuário
     * @param {{url: string, credentials: object}} data
     */
    async login(data) {
      try {
        await axios.get('sanctum/csrf-cookie')

        const response = await axios.post(data.url, data.credentials)

        this.user = response.data.user
        this.session_id = response.data.session_id
        this.token = response.data.token ?? null
        this.initialized = true
        this.authenticated = true

        localStorage.setItem('token', this.token)
        localStorage.setItem('session_id', this.session_id)

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        axios.defaults.headers.common['X-Session-ID'] = response.data.session_id

        return response.data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    /**
     * Realiza logout do usuário
     */
    async logout() {
      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.warn('Erro ao chamar /api/logout:', error)
      } finally {
        this.clearSession()
      }
    },

    /**
     * Limpa os dados da sessão
     */
    clearSession() {
      this.user = null
      this.token = null
      this.session_id = null
      this.authenticated = false
      this.initialized = false

      localStorage.removeItem('token')
      localStorage.removeItem('session_id')

      delete axios.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common['X-Session-ID']
    },

    /**
     * Verifica se o usuário já está autenticado
     */
    async checkAuth() {
      if (this.initialized) return this.authenticated

      const token = localStorage.getItem('token')
      const session_id = localStorage.getItem('session_id')

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      if (session_id) {
        axios.defaults.headers.common['X-Session-ID'] = session_id
      }

      try {
        const { data } = await axios.get('/api/check-auth')
        this.user = data.user
        this.authenticated = true
        this.token = token
        this.session_id = session_id
      } catch (error) {
        this.clearSession()
      } finally {
        this.initialized = true
      }

      return this.authenticated
    },

    async fetchUser() {
      try {
        const { data } = await axios.get('/api/me')
        this.user = data.user        
        console.log('User data fetched:', data);
        
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      }
    }
  }
})