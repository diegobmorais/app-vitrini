import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  // State
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allOrders = computed(() => orders.value)
  const orderById = (id) => orders.value.find(order => order.id === id)
  const pendingOrders = computed(() =>
    orders.value.filter(order => ['pending', 'processing'].includes(order.status))
  )
  const completedOrders = computed(() =>
    orders.value.filter(order => order.status === 'delivered')
  )
  const totalRevenue = computed(() =>
    orders.value
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)
  )
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchOrders() {
    try {
      loading.value = true
      // Simulação de chamada à API
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                number: "1001",
                customer: {
                  name: "Ana Silva",
                  email: "ana.silva@email.com",
                  avatar: null,
                },
                created_at: "2023-06-15T10:30:00",
                total: 125.9,
                status: "delivered",
                items_count: 3,
              },
              {
                id: 2,
                number: "1002",
                customer: {
                  name: "Carlos Oliveira",
                  email: "carlos.oliveira@email.com",
                  avatar: null,
                },
                created_at: "2023-06-16T14:20:00",
                total: 89.5,
                status: "processing",
                items_count: 2,
              },
              {
                id: 3,
                number: "1003",
                customer: {
                  name: "Mariana Santos",
                  email: "mariana.santos@email.com",
                  avatar: null,
                },
                created_at: "2023-06-16T16:45:00",
                total: 210.75,
                status: "pending",
                items_count: 4,
              },
              {
                id: 4,
                number: "1004",
                customer: {
                  name: "Pedro Almeida",
                  email: "pedro.almeida@email.com",
                  avatar: null,
                },
                created_at: "2023-06-14T09:15:00",
                total: 45.0,
                status: "shipped",
                items_count: 1,
              },
              {
                id: 5,
                number: "1005",
                customer: {
                  name: "Juliana Costa",
                  email: "juliana.costa@email.com",
                  avatar: null,
                },
                created_at: "2023-06-13T11:30:00",
                total: 175.25,
                status: "cancelled",
                items_count: 3,
              },
            ],
          })
        }, 500)
      })
      orders.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus({ orderId, status }) {
    try {
      loading.value = true
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = orders.value.findIndex(order => order.id === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], status }
      }
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,

    allOrders,
    orderById,
    pendingOrders,
    completedOrders,
    totalRevenue,
    isLoading,
    hasError,

    fetchOrders,
    updateOrderStatus,
  }
})
