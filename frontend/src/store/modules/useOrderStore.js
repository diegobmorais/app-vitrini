import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useOrderStore = defineStore('orders', () => {
  // State
  const orders = ref([])
  const ordersUser = ref([])
  const loading = ref(false)
  const error = ref(null)
  const search = ref('')
  const statusFilter = ref('')
  const dateFilter = ref('all')

  // Getters
  const allOrders = computed(() => orders.value) 

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

  const filteredOrders = computed(() => {
    let result = orders.value

    if (statusFilter.value) {
      result = result.filter(order => order.status === statusFilter.value)
    }

    if (dateFilter.value !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      result = result.filter(order => {
        const orderDate = new Date(order.created_at)

        if (dateFilter.value === 'today') {
          return orderDate >= today
        } else if (dateFilter.value === 'week') {
          return orderDate >= startOfWeek
        } else if (dateFilter.value === 'month') {
          return orderDate >= startOfMonth
        }
        return true
      })
    }

    if (search.value) {
      const searchLower = search.value.toLowerCase()
      result = result.filter(order =>
        order.order_number.toString().includes(searchLower) ||
        order.user.name.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower)
      )
    }

    return result
  })

  const pendingOrdersCount = computed(() =>
    orders.value.filter(order => ['pending', 'processing'].includes(order.status)).length
  )

  const completedOrdersCount = computed(() =>
    orders.value.filter(order => order.status === 'delivered').length
  )

  // Actions
  async function fetchOrders() {
    try {
      loading.value = true

      const response = await api.get('api/orders')
      orders.value = response.data.orders
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  } 

  async function userOrders(id) {
    try {
      loading.value = true

      const response = await api.get(`api/orders/user/${id}`)

      ordersUser.value = response.data.orders
      return response.data.order
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus({ orderId, status }) {
    try {
      loading.value = true

      await new api.put(`/orders/${orderId}`, { status })

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
    search,
    statusFilter,
    dateFilter,
    ordersUser,

    allOrders,   
    pendingOrders,
    completedOrders,
    totalRevenue,
    isLoading,
    hasError,
    filteredOrders,
    pendingOrdersCount,
    completedOrdersCount,

    fetchOrders,
    updateOrderStatus,
    userOrders,
  }
})
