import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

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
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0))
  const isCartEmpty = computed(() => items.value.length === 0)
  const cartSummary = computed(() => summary.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // Mutations (as functions)
  function setCartItems(newItems) {
    items.value = newItems
  }
  function toggleCartModal(show = null) {
    if (show !== null) {
      showModal.value = show
    } else {
      showModal.value = !showModal.value
    }
  }
  async function fetchItems() {
    loading.value = true
    try {
      const response = await api.get('/api/cart')
      items.value = response.data.cart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        sku: item.product.sku,
        slug: item.product.slug,
        stock_quantity: item.product.stock,
        image: item.product.image || '/images/placeholder.jpg',

      }))
    } catch (err) {
      error.value = 'Erro ao carregar carrinho'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addItemToCart(productId, quantity) {
    try {
      const response = await api.post('/api/cart/items', {
        product_id: productId,
        quantity
      })
      items.value = response.data.cart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        sku: item.product.sku,
        slug: item.product.slug,
        stock_quantity: item.product.stock,
        image: item.product.image || '/images/placeholder.jpg',
      })) || []
    } catch (err) {
      throw err
    }
  }

  async function updateQuantity(itemId, quantity) {
    const itemIndex = items.value.findIndex(i => i.id === itemId)
    if (itemIndex === -1) return

    const originalItem = { ...items.value[itemIndex] }

    try {
      items.value[itemIndex] = {
        ...items.value[itemIndex],
        quantity: quantity
      }

      const response = await api.patch(`/api/cart/items/${itemId}`, {
        quantity: quantity
      })

      const currentIndex = items.value.findIndex(i => i.id === itemId)
      if (currentIndex !== -1) {
        const updatedItemsFromResponse = response.data.cart.items;
        const itemFromResponse = updatedItemsFromResponse.find(i => i.id === itemId);

        if (itemFromResponse) {
          items.value[currentIndex] = {
            ...items.value[currentIndex],
          };
        }
      }

    } catch (err) {
      const currentIndex = items.value.findIndex(i => i.id === itemId)
      if (currentIndex !== -1) {
        items.value[currentIndex] = originalItem
      }
      console.error('Erro ao enviar atualização de quantidade:', err)
      throw err
    }
  }

  async function removeItem(itemId) {
    try {
      const response = await api.delete(`/api/cart/items/${itemId}`)
      items.value = response.data.cart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        sku: item.product.sku,
        slug: item.product.slug,
        stock_quantity: item.product.stock,
        image: item.product.image || '/images/placeholder.jpg',
      })) || []
    } catch (err) {
      throw err
    }
  }

  async function clearCart() {
    try {
      await api.delete('/api/cart')
      items.value = []
    } catch (err) {
      throw err
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

    const tax = subtotal * 0.1
    const shipping = subtotal > 100 ? 0 : 15
    const discount = 0

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

      const response = await api.post('api/checkout', payload)

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
    totalItems,
    subtotal,

    // mutations
    setCartItems,
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
    fetchItems,
    addItemToCart,
    removeItem,
  }
})
