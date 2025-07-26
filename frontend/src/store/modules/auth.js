// src/store/modules/auth.js

import axios from "axios"

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
    setSession(state, sessionId) {
      state.session_id = sessionId
    },
    setInitialized(state) {
      state.initialized = true
    },
    logout(state) {
      state.user = null
      state.token = null
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        await axios.get('sanctum/csrf-cookie')

        const response = await axios.post(data.url, data.credentials)

        commit('setUser', response.data.user);

        axios.defaults.headers.common['X-Session-ID'] = response.data.session_id;

        return response;
      } catch (error) {
        commit('logout')
        throw error
      }
    },

    async logout({ commit }) {
      await axios.post('api/logout')
      commit('logout')
    },

    async checkAuth({ commit, state }) {
      try {
        if (state.initialized) {
          return !!state.user;
        }

        const response = await axios.get('/api/check-auth');

        commit('setUser', response.data);
        commit('setInitialized');

        return true;
      } catch (error) {
        commit('logout');
        commit('setInitialized');
        return false;
      }
    }

  },
  getters: {
    isAuthenticated: (state) => { return !!state.user; },
    getUser: state => ({ ...state.user }),
    getSessionId: (state) => state.session_id,
    isInitialized: (state) => state.initialized
  }
}
