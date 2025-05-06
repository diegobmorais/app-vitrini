const state = {
    products: [],
    stockHistory: [],
    loading: false,
    error: null,
  }
  
  const getters = {
    allProducts: (state) => state.products,
    productById: (state) => (id) => state.products.find((product) => product.id === id),
    inStockProducts: (state) => state.products.filter((product) => product.stock > 0),
    lowStockProducts: (state) =>
      state.products.filter((product) => product.stock > 0 && product.stock <= product.min_stock),
    outOfStockProducts: (state) => state.products.filter((product) => product.stock === 0),
    stockHistoryByProduct: (state) => (productId) =>
      state.stockHistory.filter((history) => history.product_id === productId),
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  }
  
  const actions = {
    async fetchProducts({ commit }) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: [
                {
                  id: 1,
                  name: "Ração Premium para Cães",
                  sku: "RAC-001",
                  category_id: "1",
                  brand: "PetFood",
                  stock: 45,
                  min_stock: 10,
                  last_updated: "2023-06-15T10:30:00",
                  image: null,
                },
                {
                  id: 2,
                  name: "Ração Premium para Gatos",
                  sku: "RAC-002",
                  category_id: "1",
                  brand: "PetFood",
                  stock: 8,
                  min_stock: 10,
                  last_updated: "2023-06-14T14:20:00",
                  image: null,
                },
                {
                  id: 3,
                  name: "Brinquedo Interativo para Cães",
                  sku: "BRI-001",
                  category_id: "2",
                  brand: "PetToys",
                  stock: 0,
                  min_stock: 5,
                  last_updated: "2023-06-10T09:15:00",
                  image: null,
                },
                {
                  id: 4,
                  name: "Coleira Ajustável",
                  sku: "ACE-001",
                  category_id: "3",
                  brand: "PetCare",
                  stock: 25,
                  min_stock: 8,
                  last_updated: "2023-06-12T16:45:00",
                  image: null,
                },
              ],
            })
          }, 500)
        })
        commit("setProducts", response.data)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async fetchStockHistory({ commit }, productId) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: [
                {
                  id: 1,
                  product_id: productId,
                  type: "add",
                  quantity: 10,
                  reason: "purchase",
                  notes: "",
                  previous_stock: 35,
                  new_stock: 45,
                  created_at: "2023-06-15T10:30:00",
                  user: "Admin",
                },
                {
                  id: 2,
                  product_id: productId,
                  type: "remove",
                  quantity: 5,
                  reason: "sale",
                  notes: "",
                  previous_stock: 40,
                  new_stock: 35,
                  created_at: "2023-06-14T14:20:00",
                  user: "Admin",
                },
              ],
            })
          }, 500)
        })
        commit("setStockHistory", response.data)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async adjustStock({ commit }, adjustment) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))
  
        const product = state.products.find((p) => p.id === adjustment.product_id)
        if (!product) throw new Error("Produto não encontrado")
  
        const previousStock = product.stock
        let newStock = previousStock
  
        if (adjustment.type === "add") {
          newStock = previousStock + adjustment.quantity
        } else if (adjustment.type === "remove") {
          newStock = Math.max(0, previousStock - adjustment.quantity)
        } else if (adjustment.type === "set") {
          newStock = adjustment.quantity
        }
  
        // Atualizar o estoque do produto
        commit("updateProductStock", {
          productId: adjustment.product_id,
          newStock,
          lastUpdated: new Date().toISOString(),
        })
  
        // Adicionar ao histórico
        const historyEntry = {
          id: Date.now(),
          product_id: adjustment.product_id,
          type: adjustment.type,
          quantity: adjustment.quantity,
          reason: adjustment.reason,
          notes: adjustment.notes,
          previous_stock: previousStock,
          new_stock: newStock,
          created_at: new Date().toISOString(),
          user: "Admin",
        }
  
        commit("addStockHistory", historyEntry)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  }
  
  const mutations = {
    setProducts(state, products) {
      state.products = products
    },
    updateProductStock(state, { productId, newStock, lastUpdated }) {
      const product = state.products.find((p) => p.id === productId)
      if (product) {
        product.stock = newStock
        product.last_updated = lastUpdated
      }
    },
    setStockHistory(state, history) {
      state.stockHistory = history
    },
    addStockHistory(state, historyEntry) {
      state.stockHistory.unshift(historyEntry)
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
  