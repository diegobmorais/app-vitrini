import api from "@/main"

const state = {
  brands: []
}

const getters = {
  allBrands: state => state.brands
}

const mutations = {
  setBrands(state, brands) {
    state.brands = brands
  }
}

const actions = {
  async fetchBrands({ commit }) {
    const response = await api.get('api/brands')
    commit('setBrands', response.data)
    return response.data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}