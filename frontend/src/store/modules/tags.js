import api from "@/main"


const state = {
  tags: []
}

const getters = {
  allTags: state => state.tags
}

const actions = {
  async fetchTags({ commit }) {
    const response = await api.get('api/tags')
    commit('setTags', response.data)

    return response.data
  }
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}