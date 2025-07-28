<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p class="text-gray-600">Gerencie os pedidos do sistema</p>
      </div>
      <router-link to="/admin/orders/create"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
        Novo Pedido
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div class="flex-1 mb-4 md:mb-0">
            <input v-model="search" type="text" placeholder="Buscar pedidos..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div class="flex space-x-4">
            <select v-model="statusFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Em processamento</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <select v-model="dateFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="all">Todas as datas</option>
              <option value="today">Hoje</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.number }}</div>
                <div class="text-sm text-gray-500">{{ order.items_count }} itens</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span v-if="!order.customer.avatar" class="text-gray-500 font-medium text-xs">{{
                      getInitials(order.customer.name) }}</span>
                    <img v-else :src="order.customer.avatar" alt="" class="h-8 w-8 rounded-full">
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.customer.name }}</div>
                    <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/admin/orders/${order.id}`" class="text-primary-600 hover:text-primary-900 mr-3">
                  Ver
                </router-link>
                <button v-if="order.status === 'pending'" @click="updateOrderStatus(order.id, 'processing')"
                  class="text-green-600 hover:text-green-900 mr-3">
                  Processar
                </button>
                <button v-if="order.status === 'processing'" @click="updateOrderStatus(order.id, 'shipped')"
                  class="text-blue-600 hover:text-blue-900 mr-3">
                  Enviar
                </button>
                <button v-if="['pending', 'processing'].includes(order.status)"
                  @click="updateOrderStatus(order.id, 'cancelled')" class="text-red-600 hover:text-red-900">
                  Cancelar
                </button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhum pedido encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ filteredOrders.length }}</span> de <span class="font-medium">{{
              orders.length }}</span> pedidos
          </div>
          <div class="flex-1 flex justify-end">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- Paginação aqui se necessário -->
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumo de Pedidos -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <svg class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total de Pedidos
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ orders.length }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Pedidos Pendentes
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ pendingOrdersCount }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Pedidos Concluídos
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ completedOrdersCount }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Receita Total
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ formatCurrency(totalRevenue) }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCustomerStore } from '@/store/modules/useCustomerStore'
import { ref, computed, onMounted } from 'vue'

const store = useCustomerStore()

const orders = ref([])
const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('all')
const loading = ref(false)

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
      order.number.toString().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower)
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

const totalRevenue = computed(() =>
  orders.value
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)
)

function fetchOrders() {
  loading.value = true
  setTimeout(() => {
    orders.value = [
      {
        id: 1,
        number: '1001',
        customer: {
          name: 'Ana Silva',
          email: 'ana.silva@email.com',
          avatar: null
        },
        created_at: '2023-06-15T10:30:00',
        total: 125.90,
        status: 'delivered',
        items_count: 3
      }
    ]
    loading.value = false
  }, 500)
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function getStatusClass(status) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'processing':
      return 'Em processamento'
    case 'shipped':
      return 'Enviado'
    case 'delivered':
      return 'Entregue'
    case 'cancelled':
      return 'Cancelado'
    default:
      return status
  }
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = newStatus
    store.dispatch('notifications/add', {
      type: 'success',
      message: `Status do pedido #${order.number} atualizado para ${getStatusLabel(newStatus)}`
    })
  }
}

onMounted(() => {
  fetchOrders()
})
</script>