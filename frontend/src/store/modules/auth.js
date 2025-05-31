// src/store/modules/auth.js

export default {
  namespaced: true,
  state: () => ({
    user: null,
    session_id: null,
    initialized: false
  }),
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
    },
    logout(state) {
      state.user = null
      state.token = null
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        await this._vm.$axios.get('/sanctum/csrf-cookie')

        const response = await this._vm.$axios.post('/login', credentials)
       
        commit('SET_USER', response.data.user)
        commit('SET_SESSION', response.data.session_id)

        return response
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },

    async logout({ commit }) {
      await this._vm.$axios.post('/logout')
      commit('CLEAR_AUTH')
    },

    async checkAuth({ commit, state }) {
      try {     
        if (state.initialized && !state.session_id) return false

        const response = await this._vm.$axios.get('api/check-auth')
        commit('SET_USER', response.data)
        commit('SET_INITIALIZED')
        return true
      } catch (error) {
        commit('CLEAR_AUTH')
        commit('SET_INITIALIZED')
        return false
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
    getSessionId: (state) => state.session_id,
    isInitialized: (state) => state.initialized
  }
}
