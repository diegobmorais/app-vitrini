import axios from "axios"

export default {
  namespaced: true,

  state: {
    items: [],
    showModal: false,
    loading: false,
    error: null,
    summary: {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    },
  },

  getters: {
    cartItems: (state) => state.items,
    cartItemCount: (state) => state.items.reduce((count, item) => count + item.quantity, 0),
    isCartEmpty: (state) => state.items.length === 0,
    cartSummary: (state) => state.summary,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  mutations: {
    SET_CART_ITEMS(state, items) {
      state.items = items
    },
    ADD_TO_CART(state, { product, quantity }) {
      const existingItem = state.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          sale_price: product.sale_price,
          image: product.image,
          quantity,
        })
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.items = state.items.filter((item) => item.id !== productId)
    },
    UPDATE_QUANTITY(state, { productId, quantity }) {
      const item = state.items.find((item) => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    CLEAR_CART(state) {
      state.items = []
    },
    TOGGLE_CART_MODAL(state, show = null) {
      state.showModal = show !== null ? show : !state.showModal
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    UPDATE_CART_SUMMARY(state) {
      const subtotal = state.items.reduce((total, item) => {
        const price = item.sale_price || item.price
        return total + price * item.quantity
      }, 0)

      // Valores de exemplo - na implementação real, estes seriam calculados com base em regras de negócio
      const tax = subtotal * 0.1 // 10% de imposto
      const shipping = subtotal > 100 ? 0 : 15 // Frete grátis acima de R$ 100
      const discount = 0 // Sem desconto por padrão

      state.summary = {
        subtotal,
        tax,
        shipping,
        discount,
        total: subtotal + tax + shipping - discount,
      }
    },
  },

  actions: {
    addToCart({ commit, dispatch }, { product, quantity = 1 }) {
      commit("ADD_TO_CART", { product, quantity })
      commit("UPDATE_CART_SUMMARY")
      dispatch("saveCart")
      commit("TOGGLE_CART_MODAL", true)
    },

    removeFromCart({ commit, dispatch }, productId) {
      commit("REMOVE_FROM_CART", productId)
      commit("UPDATE_CART_SUMMARY")
      dispatch("saveCart")
    },

    updateQuantity({ commit, dispatch }, { productId, quantity }) {
      commit("UPDATE_QUANTITY", { productId, quantity })
      commit("UPDATE_CART_SUMMARY")
      dispatch("saveCart")
    },

    clearCart({ commit }) {
      commit("CLEAR_CART")
      commit("UPDATE_CART_SUMMARY")
      localStorage.removeItem("cart")
    },

    toggleCartModal({ commit }, show) {
      commit("TOGGLE_CART_MODAL", show)
    },

    saveCart({ state }) {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: state.items,
          summary: state.summary,
        }),
      )
    },

    loadCart({ commit }) {
      const savedCart = localStorage.getItem("cart")

      if (savedCart) {
        try {
          const { items } = JSON.parse(savedCart)
          commit("SET_CART_ITEMS", items)
          commit("UPDATE_CART_SUMMARY")
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    },

    async checkout({ commit, state, dispatch }, checkoutData) {
      try {
        commit("SET_LOADING", true)

        const payload = {
          items: state.items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.sale_price || item.price,
          })),
          shipping_address: checkoutData.shippingAddress,
          billing_address: checkoutData.billingAddress,
          payment_method: checkoutData.paymentMethod,
        }

        const response = await axios.post("/checkout", payload)

        // Limpar o carrinho após checkout bem-sucedido
        dispatch("clearCart")

        commit("SET_ERROR", null)
        return response.data
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Erro ao processar o checkout")
        console.error("Error during checkout:", error)
        throw error
      } finally {
        commit("SET_LOADING", false)
      }
    },
  },
}
