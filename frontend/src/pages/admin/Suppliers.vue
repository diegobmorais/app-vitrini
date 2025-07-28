<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Fornecedores</h1>
        <p class="text-gray-600">Gerencie os fornecedores do sistema</p>
      </div>
      <router-link to="/painel-administrador/fornecedor/create"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
        Novo Fornecedor
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input v-model="search" type="text" placeholder="Buscar fornecedores..."
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
                Nome</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produtos</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span v-if="!supplier.logo" class="text-gray-500 font-medium">{{ getInitials(supplier.name)
                      }}</span>
                    <img v-else :src="supplier.logo" alt="" class="h-10 w-10 rounded-full">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ supplier.name }}</div>
                    <div class="text-sm text-gray-500">{{ supplier.cnpj }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ supplier.contact_name }}</div>
                <div class="text-sm text-gray-500">{{ supplier.email }}</div>
                <div class="text-sm text-gray-500">{{ supplier.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ supplier.products_count }} produtos
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ supplier.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/painel-administrador/fornecedor/create/${supplier.id}/edit`"
                  class="text-primary-600 hover:text-primary-900 mr-3">
                  Editar
                </router-link>
                <button @click="deleteSupplier(supplier.id)" class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="filteredSuppliers.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhum fornecedor encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ filteredSuppliers.length }}</span> de <span class="font-medium">{{
              suppliers.length }}</span> fornecedores
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
import { useNotificationStore } from '@/store/modules/useNotificationStore'
import { ref, computed, onMounted } from 'vue'


const notificationsStore = useNotificationStore()

const suppliers = ref([])
const search = ref('')
const filter = ref('all')
const loading = ref(false)

// Filtra fornecedores conforme filtros e busca
const filteredSuppliers = computed(() => {
  let result = suppliers.value

  if (filter.value === 'active') {
    result = result.filter(supplier => supplier.active)
  } else if (filter.value === 'inactive') {
    result = result.filter(supplier => !supplier.active)
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(supplier =>
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.cnpj.toLowerCase().includes(searchLower) ||
      supplier.contact_name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower)
    )
  }

  return result
})

// Busca os fornecedores (simulação)
const fetchSuppliers = () => {
  loading.value = true
  setTimeout(() => {
    suppliers.value = [
      {
        id: 1,
        name: 'PetFood Distribuidora',
        cnpj: '12.345.678/0001-90',
        contact_name: 'João Silva',
        email: 'joao@petfood.com',
        phone: '(11) 98765-4321',
        products_count: 42,
        active: true,
        logo: null
      },
      {
        id: 2,
        name: 'Brinquedos Pet Ltda',
        cnpj: '98.765.432/0001-10',
        contact_name: 'Maria Souza',
        email: 'maria@brinquedospet.com',
        phone: '(11) 91234-5678',
        products_count: 28,
        active: true,
        logo: null
      },
      {
        id: 3,
        name: 'Acessórios PetShop',
        cnpj: '45.678.901/0001-23',
        contact_name: 'Carlos Oliveira',
        email: 'carlos@acessoriospet.com',
        phone: '(11) 94567-8901',
        products_count: 15,
        active: false,
        logo: null
      }
    ]
    loading.value = false
  }, 500)
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const deleteSupplier = (id) => {
  if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
    suppliers.value = suppliers.value.filter(s => s.id !== id)
    notificationsStore.add({
      type: 'success',
      message: 'Fornecedor excluído com sucesso!'
    })
  }
}

onMounted(() => {
  fetchSuppliers()
})
</script>