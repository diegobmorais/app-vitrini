import api from "@/main"

const state = {
    suppliers: [],
    loading: false,
    error: null,
  }
  
  const getters = {
    allSuppliers: (state) => state.suppliers,
    activeSuppliers: (state) => state.suppliers.filter((supplier) => supplier.active),
    supplierById: (state) => (id) => state.suppliers.find((supplier) => supplier.id === id),
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  }
  
  const actions = {
    async fetchSuppliers({ commit }) {
      try {
        commit("setLoading", true)    
        const response = await api.get('api/suppliers')          
        commit("setSuppliers", response.data)
        
        return response.data
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async saveSupplier({ commit }, supplier) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))
  
        if (supplier.id) {
          // Atualizar fornecedor existente
          commit("updateSupplier", supplier)
        } else {
          // Criar novo fornecedor
          const newId = Date.now()
          commit("addSupplier", { ...supplier, id: newId })
        }
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async deleteSupplier({ commit }, id) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))
        commit("removeSupplier", id)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  }
  
  const mutations = {
    setSuppliers(state, suppliers) {
      state.suppliers = suppliers
    },
    addSupplier(state, supplier) {
      state.suppliers.push(supplier)
    },
    updateSupplier(state, updatedSupplier) {
      const index = state.suppliers.findIndex((s) => s.id === updatedSupplier.id)
      if (index !== -1) {
        state.suppliers.splice(index, 1, updatedSupplier)
      }
    },
    removeSupplier(state, id) {
      state.suppliers = state.suppliers.filter((s) => s.id !== id)
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
  