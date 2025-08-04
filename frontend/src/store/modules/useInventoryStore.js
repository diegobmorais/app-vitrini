import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main';

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const products = ref([])
  const metrics = ref({
    total: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0
  })
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allProducts = computed(() => products.value)
  const productById = (id) => products.value.find(product => product.id === id)
  const inStockProducts = computed(() => products.value.filter(p => p.stock > 0))
  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock > 0 && p.stock <= p.min_stock)
  )
  const outOfStockProducts = computed(() => products.value.filter(p => p.stock === 0))
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchProducts() {
    loading.value = true

  }

  const fetchStock = async () => {
    try {
      loading.value = true
      const response = await api.get('/api/stock')
      products.value = response.data.products
      metrics.value = response.data.metrics
    } catch (err) {
      console.error('error', err)
    } finally {
      loading.value = false
    }
  }

  const addMovement = async (movement) => {
    await api.post('/api/stock', movement)
    await fetchStock()
  }

  return {
    products,
    metrics,
    loading,
    error,

    allProducts,
    productById,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
    isLoading,
    hasError,

    fetchProducts,
    fetchStock,
    addMovement,
  }
})
