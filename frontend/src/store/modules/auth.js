// src/store/modules/auth.js

export default {
    namespaced: true,
    state: () => ({
      user: null,
      token: null
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
      login({ commit }, { user, token }) {
        commit('setUser', user)
        commit('setToken', token)
      },
      logout({ commit }) {
        commit('logout')
      }
    },
    getters: {
      isAuthenticated: state => !!state.token,
      getUser: state => state.user
    }
  }
  