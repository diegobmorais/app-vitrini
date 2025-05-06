const state = {
    customers: [],
    loading: false,
    error: null,
  }
  
  const getters = {
    allCustomers: (state) => state.customers,
    activeCustomers: (state) => state.customers.filter((customer) => customer.active),
    customerById: (state) => (id) => state.customers.find((customer) => customer.id === id),
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  }
  
  const actions = {
    async fetchCustomers({ commit }) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: [
                {
                  id: 1,
                  name: "Ana Silva",
                  document: "123.456.789-00",
                  email: "ana.silva@email.com",
                  phone: "(11) 98765-4321",
                  orders_count: 5,
                  active: true,
                  avatar: null,
                },
                {
                  id: 2,
                  name: "Carlos Oliveira",
                  document: "987.654.321-00",
                  email: "carlos.oliveira@email.com",
                  phone: "(11) 91234-5678",
                  orders_count: 3,
                  active: true,
                  avatar: null,
                },
                {
                  id: 3,
                  name: "Mariana Santos",
                  document: "456.789.123-00",
                  email: "mariana.santos@email.com",
                  phone: "(11) 94567-8901",
                  orders_count: 0,
                  active: false,
                  avatar: null,
                },
              ],
            })
          }, 500)
        })
        commit("setCustomers", response.data)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async saveCustomer({ commit }, customer) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))
  
        if (customer.id) {
          // Atualizar cliente existente
          commit("updateCustomer", customer)
        } else {
          // Criar novo cliente
          const newId = Date.now()
          commit("addCustomer", { ...customer, id: newId })
        }
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  
    async deleteCustomer({ commit }, id) {
      try {
        commit("setLoading", true)
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))
        commit("removeCustomer", id)
      } catch (error) {
        commit("setError", error.message)
      } finally {
        commit("setLoading", false)
      }
    },
  }
  
  const mutations = {
    setCustomers(state, customers) {
      state.customers = customers
    },
    addCustomer(state, customer) {
      state.customers.push(customer)
    },
    updateCustomer(state, updatedCustomer) {
      const index = state.customers.findIndex((c) => c.id === updatedCustomer.id)
      if (index !== -1) {
        state.customers.splice(index, 1, updatedCustomer)
      }
    },
    removeCustomer(state, id) {
      state.customers = state.customers.filter((c) => c.id !== id)
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
  