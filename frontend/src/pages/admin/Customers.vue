<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        <p class="text-gray-600">Gerencie os clientes do sistema</p>
      </div>
      <!-- <router-link to="/painel-administrador/cliente/create"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
        Novo Cliente
      </router-link> -->
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input v-model="search" type="text" placeholder="Buscar clientes..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <select v-model="filter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedidos</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <!-- <span v-if="!customer.avatar" class="text-gray-500 font-medium">{{ getInitials(customer.name)
                      }}</span>
                    <img v-else :src="customer.avatar" alt="" class="h-10 w-10 rounded-full"> -->
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                    <!-- <div class="text-sm text-gray-500">{{ customer.document }}</div> -->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ customer.email }}</div>
                <div class="text-sm text-gray-500">{{ customer.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <!-- {{ customer.orders_count }} pedidos --> ORD1520
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="customer.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ customer.status ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/painel-administrador/clientes/${customer.id}/detalhes`"
                  class="text-primary-600 hover:text-primary-900 mr-3">
                  Detalhes
                </router-link>              
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhum cliente encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ filteredCustomers.length }}</span> de <span class="font-medium">{{
              customers.length }}</span> clientes
          </div>
          <div class="flex-1 flex justify-end">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- Paginação aqui se necessário -->
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCustomerStore } from '@/store/modules/useCustomerStore'
import { ref, computed, onMounted } from 'vue'

const search = ref('')
const filter = ref('all')
const customerStore = useCustomerStore();

const customers = computed(() => customerStore.customers)

const filteredCustomers = computed(() => {
  let result = customers.value

  // Filtrar por status
  if (filter.value === 'active') {
    result = result.filter(customer => customer.status)
  } else if (filter.value === 'inactive') {
    result = result.filter(customer => !customer.status)
  }

  // Filtrar por termo de busca
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(customer =>
      customer.name.toLowerCase().includes(searchLower)     
    )
  }

  return result
})

// const getInitials = (name) => {
//   return name
//     .split('')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .substring(0, 2)
// }

onMounted(() => {  
  customerStore.fetchCustomers()
})
</script>
