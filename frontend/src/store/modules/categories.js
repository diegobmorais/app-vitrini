import axios from "axios"

const state = {
  categories: [],
  category: null,
  loading: false,
  error: null,
}

const getters = {
  allCategories: (state) => state.categories,
  categoryById: (state) => (id) => state.categories.find((category) => category.id === id),
  currentCategory: (state) => state.category,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
  getCategoryName: (state) => (id) => {
    const category = state.categories.find((cat) => cat.id === id)
    return category ? category.name : "Categoria não encontrada"
  },
  getMainCategories: (state) => state.categories.filter((category) => !category.parent_id),
  getSubcategories: (state) => (parentId) => state.categories.filter((category) => category.parent_id === parentId),
}

const actions = {
  async fetchCategories({ commit }) {
    commit("setLoading", true)
    try {
      const response = await axios.get("category")
      commit("setCategories", response.data)
      commit("setError", null)
    } catch (error) {
      commit("setError", error.message || "Erro ao carregar categorias")
      console.error("Error fetching categories:", error)
    } finally {
      commit("setLoading", false)
    }
  },

  async fetchCategoryById({ commit }, categoryId) {
    commit("setLoading", true)
    try {
      const response = await axios.get(`/category/${categoryId}`)
      commit("setCurrentCategory", response.data)
      commit("setError", null)
    } catch (error) {
      commit("setError", error.message || "Erro ao carregar detalhes da categoria")
      console.error("Error fetching category details:", error)
    } finally {
      commit("setLoading", false)
    }
  },

  async fetchCategoryProducts({ commit, dispatch }, categoryId) {
    // Update filters to show products from this category
    dispatch("products/updateFilters", { category: categoryId }, { root: true })
    // Then fetch products with the new filter
    dispatch("products/fetchProducts", null, { root: true })

    // Also fetch the category details
    dispatch("fetchCategoryById", categoryId)
  },
}

const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  },
  setCurrentCategory(state, category) {
    state.category = category
  },
  setLoading(state, status) {
    state.loading = status
  },
  setError(state, error) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
