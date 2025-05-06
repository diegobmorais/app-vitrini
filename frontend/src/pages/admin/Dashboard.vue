<template>
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Card - Total de Vendas -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-gray-500 text-sm font-medium">Total de Vendas</h3>
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{ salesGrowth }}%</span>
          </div>
          <div class="flex items-baseline mt-4">
            <span class="text-3xl font-bold">R$ {{ formatNumber(totalSales) }}</span>
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
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{ ordersGrowth }}%</span>
          </div>
          <div class="flex items-baseline mt-4">
            <span class="text-3xl font-bold">{{ totalOrders }}</span>
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
            <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">+{{ customersGrowth }}%</span>
          </div>
          <div class="flex items-baseline mt-4">
            <span class="text-3xl font-bold">{{ totalCustomers }}</span>
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
            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ lowStockCount }} com baixo estoque</span>
          </div>
          <div class="flex items-baseline mt-4">
            <span class="text-3xl font-bold">{{ totalProducts }}</span>
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
              <button 
                v-for="period in ['7D', '30D', '3M', '1A']" 
                :key="period"
                @click="changePeriod(period)"
                class="px-3 py-1 text-sm rounded-md"
                :class="selectedPeriod === period ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-64">
            <!-- Aqui entraria o componente de gráfico -->
            <div class="h-full flex items-center justify-center text-gray-400">
              Gráfico de vendas por período
            </div>
          </div>
        </div>
        
        <!-- Produtos Mais Vendidos -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
          <div class="space-y-4">
            <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center">
              <span class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">{{ index + 1 }}</span>
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
            <router-link to="/admin/products" class="text-sm font-medium text-blue-600 hover:text-blue-800">
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
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {{ order.customer.name.charAt(0) }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.customer.name }}</div>
                      <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
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
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': order.status === 'completed',
                      'bg-yellow-100 text-yellow-800': order.status === 'processing',
                      'bg-blue-100 text-blue-800': order.status === 'shipped',
                      'bg-red-100 text-red-800': order.status === 'cancelled'
                    }"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </td>               
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/admin/orders/${order.id}`" class="text-blue-600 hover:text-blue-900 mr-3">
                    Ver
                  </router-link>
                  <button class="text-gray-600 hover:text-gray-900">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 border-t">
          <router-link to="/admin/orders" class="text-sm font-medium text-blue-600 hover:text-blue-800">
            Ver todos os pedidos →
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard',
    data() {
      return {
        selectedPeriod: '30D',
        totalSales: 15750.85,
        salesGrowth: 12.5,
        salesProgress: 75,
        totalOrders: 124,
        ordersGrowth: 8.3,
        ordersProgress: 65,
        totalCustomers: 1458,
        customersGrowth: 5.2,
        customersProgress: 80,
        totalProducts: 342,
        lowStockCount: 15,
        productsProgress: 90,
        topProducts: [
          { id: 1, name: 'Ração Premium para Cães', category: 'Alimentação', revenue: 3250.50, sales: 45, image: '/placeholder.svg?height=40&width=40' },
          { id: 2, name: 'Coleira Antipulgas', category: 'Acessórios', revenue: 2180.75, sales: 38, image: '/placeholder.svg?height=40&width=40' },
          { id: 3, name: 'Brinquedo Interativo', category: 'Brinquedos', revenue: 1950.25, sales: 32, image: '/placeholder.svg?height=40&width=40' },
          { id: 4, name: 'Cama para Gatos', category: 'Conforto', revenue: 1680.00, sales: 24, image: '/placeholder.svg?height=40&width=40' },
          { id: 5, name: 'Shampoo Hipoalergênico', category: 'Higiene', revenue: 1450.30, sales: 29, image: '/placeholder.svg?height=40&width=40' }
        ],
        recentOrders: [
          { 
            id: '10458', 
            customer: { name: 'João Silva', email: 'joao@example.com' }, 
            date: new Date(2023, 5, 15), 
            total: 350.75, 
            status: 'completed' 
          },
          { 
            id: '10457', 
            customer: { name: 'Maria Oliveira', email: 'maria@example.com' }, 
            date: new Date(2023, 5, 14), 
            total: 125.50, 
            status: 'processing' 
          },
          { 
            id: '10456', 
            customer: { name: 'Pedro Santos', email: 'pedro@example.com' }, 
            date: new Date(2023, 5, 14), 
            total: 780.25, 
            status: 'shipped' 
          },
          { 
            id: '10455', 
            customer: { name: 'Ana Costa', email: 'ana@example.com' }, 
            date: new Date(2023, 5, 13), 
            total: 95.80, 
            status: 'completed' 
          },
          { 
            id: '10454', 
            customer: { name: 'Carlos Ferreira', email: 'carlos@example.com' }, 
            date: new Date(2023, 5, 12), 
            total: 210.45, 
            status: 'cancelled' 
          }
        ]
      };
    },
    methods: {
      formatNumber(value) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      },
      formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(date);
      },
      getStatusText(status) {
        const statusMap = {
          'completed': 'Concluído',
          'processing': 'Em processamento',
          'shipped': 'Enviado',
          'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
      },
      changePeriod(period) {
        this.selectedPeriod = period;
        // Aqui você faria uma chamada para atualizar os dados com base no período selecionado
      }
    },
    mounted() {
      // Aqui você faria chamadas para buscar os dados do dashboard
      this.$store.dispatch('dashboard/fetchSummary');
    }
  };
  </script>  

  