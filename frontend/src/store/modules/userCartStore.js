import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCartStore = defineStore('cart', () => {
  // States
  const items = ref([])
  const showModal = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const summary = ref({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  })

  // Getters
  const cartItems = computed(() => items.value)
  const cartItemCount = computed(() =>
    items.value.reduce((count, item) => count + item.quantity, 0)
  )
  const isCartEmpty = computed(() => items.value.length === 0)
  const cartSummary = computed(() => summary.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // Mutations (as functions)
  function setCartItems(newItems) {
    items.value = newItems
  }

  function addToCart({ product, quantity }) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        sale_price: product.sale_price,
        image: product.image,
        quantity,
      })
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  function updateQuantity({ productId, quantity }) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  function toggleCartModal(show = null) {
    if (show !== null) {
      showModal.value = show
    } else {
      showModal.value = !showModal.value
    }
  }

  function setLoading(value) {
    loading.value = value
  }

  function setError(value) {
    error.value = value
  }

  function updateCartSummary() {
    const subtotal = items.value.reduce((total, item) => {
      const price = item.sale_price || item.price
      return total + price * item.quantity
    }, 0)

    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 15 // free shipping over 100
    const discount = 0 // default no discount

    summary.value = {
      subtotal,
      tax,
      shipping,
      discount,
      total: subtotal + tax + shipping - discount,
    }
  }

  // Actions
  function saveCart() {
    localStorage.setItem(
      'cart',
      JSON.stringify({
        items: items.value,
        summary: summary.value,
      })
    )
  }

  function loadCart() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const { items: savedItems } = JSON.parse(savedCart)
        setCartItems(savedItems)
        updateCartSummary()
      } catch (err) {
        console.error('Error loading cart from localStorage:', err)
      }
    }
  }

  async function checkout(checkoutData) {
    try {
      setLoading(true)

      const payload = {
        items: items.value.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.sale_price || item.price,
        })),
        shipping_address: checkoutData.shippingAddress,
        billing_address: checkoutData.billingAddress,
        payment_method: checkoutData.paymentMethod,
      }

      const response = await axios.post('api/checkout', payload)

      clearCart()
      updateCartSummary()
      setError(null)

      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar o checkout')
      console.error('Error during checkout:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Retorno da store
  return {
    // states
    items,
    showModal,
    loading,
    error,
    summary,

    // getters
    cartItems,
    cartItemCount,
    isCartEmpty,
    cartSummary,
    isLoading,
    getError,

    // mutations
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCartModal,
    setLoading,
    setError,
    updateCartSummary,

    // actions
    saveCart,
    loadCart,
    checkout,
  }
})
