import api from "@/main"

export default {
  namespaced: true,

  state: {
    products: [],
    product: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      search: "",
      minPrice: null,
      maxPrice: null,
      sort: "featured",
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 12,
    },
  },

  getters: {
    getProducts: (state) => state.products,
    getProduct: (state) => state.product,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getFilters: (state) => state.filters,
    getPagination: (state) => state.pagination,
  },

  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_PRODUCT(state, product) {
      state.product = product
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    },
    RESET_FILTERS(state) {
      state.filters = {
        category: null,
        search: "",
        minPrice: null,
        maxPrice: null,
        sort: "featured",
      }
    },
  },

  actions: {
    async fetchProducts({ commit, state }) {
      try {
        commit("SET_LOADING", true)

        const params = {
          page: state.pagination.currentPage,
          per_page: state.pagination.perPage,
          category_id: state.filters.category,
          search: state.filters.search,
          min_price: state.filters.minPrice,
          max_price: state.filters.maxPrice,
          sort: state.filters.sort,
        }

        const response = await api.get("api/product", { params })

        commit("SET_PRODUCTS", response.data.data)
        commit("SET_PAGINATION", {
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          perPage: response.data.per_page,
        })
        commit("SET_ERROR", null)
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Erro ao carregar produtos")
        console.error("Error fetching products:", error)
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async fetchProduct({ commit }, slug) {
      try {
        commit("SET_LOADING", true)

        const response = await api.get(`api/product-detail/${slug}`)

        commit("SET_PRODUCT", response.data)
        commit("SET_ERROR", null)
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Erro ao carregar produto")
        console.error("Error fetching product:", error)
      } finally {
        commit("SET_LOADING", false)
      }
    },

    updateFilters({ commit, dispatch }, filters) {
      commit("SET_FILTERS", filters)
      commit("SET_PAGINATION", { currentPage: 1 })
      dispatch("fetchProducts")
    },

    changePage({ commit, dispatch }, page) {
      commit("SET_PAGINATION", { currentPage: page })
      dispatch("fetchProducts")
    },

    resetFilters({ commit, dispatch }) {
      commit("RESET_FILTERS")
      commit("SET_PAGINATION", { currentPage: 1 })
      dispatch("fetchProducts")
    },
  },
}
