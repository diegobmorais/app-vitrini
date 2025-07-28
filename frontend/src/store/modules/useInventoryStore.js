import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const products = ref([])
  const stockHistory = ref([])
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
  const stockHistoryByProduct = (productId) =>
    stockHistory.value.filter(history => history.product_id === productId)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchProducts() {
    loading.value = true
    try {
      // Simulação API - substitua por chamada real
      const response = await new Promise(resolve => {
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

      products.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchStockHistory(productId) {
    loading.value = true
    try {
      // Simulação API - substitua por chamada real
      const response = await new Promise(resolve => {
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

      stockHistory.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function adjustStock(adjustment) {
    loading.value = true
    try {
      // Simulação API - substitua por chamada real
      await new Promise(resolve => setTimeout(resolve, 500))

      const product = products.value.find(p => p.id === adjustment.product_id)
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

      // Atualizar estoque
      product.stock = newStock
      product.last_updated = new Date().toISOString()

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

      stockHistory.value.unshift(historyEntry)
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    stockHistory,
    loading,
    error,

    allProducts,
    productById,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
    stockHistoryByProduct,
    isLoading,
    hasError,

    fetchProducts,
    fetchStockHistory,
    adjustStock,
  }
})
