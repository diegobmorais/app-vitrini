<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Card - Total de Vendas -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-500 text-sm font-medium">Total de Vendas</h3>
          <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{
            dashboardStore.salesGrowth
            }}%</span>
        </div>
        <div class="flex items-baseline mt-4">
          <span class="text-3xl font-bold">R$ {{ formatNumber(dashboardStore.totalSales) }}</span>
          <span class="ml-2 text-sm text-gray-500">este mês</span>
        </div>
        <div class="mt-4">
          <div class="h-2 bg-gray-200 rounded-full">
            <div class="h-2 bg-green-500 rounded-full" :style="{ width: `${salesProgress}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Card - Pedidos -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-500 text-sm font-medium">Pedidos</h3>
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{
            dashboardStore.ordersGrowth
            }}%</span>
        </div>
        <div class="flex items-baseline mt-4">
          <span class="text-3xl font-bold">{{ dashboardStore.totalOrders }}</span>
          <span class="ml-2 text-sm text-gray-500">este mês</span>
        </div>
        <div class="mt-4">
          <div class="h-2 bg-gray-200 rounded-full">
            <div class="h-2 bg-blue-500 rounded-full" :style="{ width: `${ordersProgress}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Card - Clientes -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-500 text-sm font-medium">Clientes</h3>
          <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{
            dashboardStore.customersGrowth
            }}%</span>
        </div>
        <div class="flex items-baseline mt-4">
          <span class="text-3xl font-bold">{{ dashboardStore.totalCustomers }}</span>
          <span class="ml-2 text-sm text-gray-500">total</span>
        </div>
        <div class="mt-4">
          <div class="h-2 bg-gray-200 rounded-full">
            <div class="h-2 bg-purple-500 rounded-full" :style="{ width: `${customersProgress}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Card - Produtos -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-500 text-sm font-medium">Produtos</h3>
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{
            dashboardStore.lowStockCount }}
            com baixo estoque</span>
        </div>
        <div class="flex items-baseline mt-4">
          <span class="text-3xl font-bold">{{ dashboardStore.totalProducts }}</span>
          <span class="ml-2 text-sm text-gray-500">total</span>
        </div>
        <div class="mt-4">
          <div class="h-2 bg-gray-200 rounded-full">
            <div class="h-2 bg-yellow-500 rounded-full" :style="{ width: `${productsProgress}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Gráfico de Vendas -->
      <div class="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">Vendas Recentes</h3>
          <div class="flex space-x-2">
            <button v-for="period in ['7D', '30D', '3M', '1A']" :key="period" @click="changePeriod(period)"
              class="px-3 py-1 text-sm rounded-md"
              :class="selectedPeriod === period ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <!-- Agráfico -->
          <div class="h-full flex items-center justify-center text-gray-400">
            <apexchart        
            type="line"
            height="100%"
            :options="dashboardStore.chartOptions"
            :series="dashboardStore.series" />
          </div>
        </div>
      </div>

      <!-- Produtos Mais Vendidos -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
        <div class="space-y-4">
          <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center">
            <span
              class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">{{
                index + 1 }}</span>
            <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded object-cover mx-3">
            <div class="flex-1">
              <h4 class="text-sm font-medium">{{ product.name }}</h4>
              <p class="text-xs text-gray-500">{{ product.category }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">R$ {{ formatNumber(product.revenue) }}</p>
              <p class="text-xs text-gray-500">{{ product.sales }} vendas</p>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t">
          <router-link to="/painel-administrador/produtos"
            class="text-sm font-medium text-blue-600 hover:text-blue-800">
            Ver todos os produtos →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Pedidos Recentes -->
    <div class="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium">Pedidos Recentes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in ordersStore.orders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.order_number }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {{ order.user.name.charAt(0) }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.user.name }}</div>
                    <div class="text-sm text-gray-500">{{ order.user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(order.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">R$ {{ formatNumber(order.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-yellow-100 text-yellow-800': order.status === 'processing',
                  'bg-blue-100 text-blue-800': order.status === 'shipped',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="`/admin/orders/${order.id}`" class="text-blue-600 hover:text-blue-900 mr-3">
                  Ver
                </router-link>
                <!-- <button class="text-gray-600 hover:text-gray-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t">
        <router-link to="/painel-administrador/pedidos" class="text-sm font-medium text-blue-600 hover:text-blue-800">
          Ver todos os pedidos →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrderStore } from '@/store/modules/useOrderStore'
import { useDashboardStore } from '@/store/modules/useDashboardStore'
import { ref, onMounted } from 'vue'

const ordersStore = useOrderStore()
const dashboardStore = useDashboardStore()

const selectedPeriod = ref('30D')
const salesProgress = ref(100)
const ordersProgress = ref(100)
const customersProgress = ref(100)
const productsProgress = ref(100)

const topProducts = ref([
  { id: 1, name: 'Ração Premium para Cães', category: 'Alimentação', revenue: 3250.50, sales: 45, image: '/placeholder.svg?height=40&width=40' },
  { id: 2, name: 'Coleira Antipulgas', category: 'Acessórios', revenue: 2180.75, sales: 38, image: '/placeholder.svg?height=40&width=40' },
  { id: 3, name: 'Brinquedo Interativo', category: 'Brinquedos', revenue: 1950.25, sales: 32, image: '/placeholder.svg?height=40&width=40' },
  { id: 4, name: 'Cama para Gatos', category: 'Conforto', revenue: 1680.00, sales: 24, image: '/placeholder.svg?height=40&width=40' },
  { id: 5, name: 'Shampoo Hipoalergênico', category: 'Higiene', revenue: 1450.30, sales: 29, image: '/placeholder.svg?height=40&width=40' }
])


function formatNumber(value) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function getStatusText(status) {
  const statusMap = {
    'completed': 'Concluído',
    'processing': 'Em processamento',
    'shipped': 'Enviado',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

function changePeriod(period) {
  selectedPeriod.value = period
  // Aqui você faria uma chamada para atualizar os dados com base no período selecionado
}

onMounted(() => {
  ordersStore.fetchOrders()
  dashboardStore.fetchStats()
  dashboardStore.fetchSalesData()
})
</script>