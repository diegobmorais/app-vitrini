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
            <input v-model="filters.search" type="text" placeholder="Buscar fornecedores..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <select v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="all">Todos</option>
              <option value="1">Ativos</option>
              <option value="0">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CNPJ</th>
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
            <tr v-for="supplier in getSuppliers" :key="supplier.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
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
                  :class="supplier.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ supplier.status ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/painel-administrador/fornecedor/${supplier.id}/edit`"
                  class="text-primary-600 hover:text-primary-900 mr-3">
                  Editar
                </router-link>
                <button @click="removeSupplier(supplier)" class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="getSuppliers.length === 0">
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
            Mostrando <span class="font-medium">{{ getSuppliers.length }}</span> de <span class="font-medium">{{
              getSuppliers.length }}</span> fornecedores
          </div>
          <div class="flex-1 flex justify-end">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button :disabled="pagination.currentPage === 1"
                @click="suppliersStore.changePage(pagination.currentPage - 1)" class="px-2 py-1 border rounded mx-1">
                Anterior
              </button>
              <button :disabled="pagination.currentPage === pagination.lastPage"
                @click="suppliersStore.changePage(pagination.currentPage + 1)" class="px-2 py-1 border rounded mx-1">
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>
      <!-- Modal de Confirmação de Exclusão -->
      <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Excluir Fornecedor
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Tem certeza que deseja excluir o fornecedor "{{ supplierToDelete?.name }}"? Esta ação não pode ser
                      desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="deleteSupplier(supplier)" type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Excluir
              </button>
              <button @click="cancelDelete()" type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupplierStore } from '@/store/modules/useSupplierStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const suppliersStore = useSupplierStore()

const { pagination, filters, getSuppliers } = storeToRefs(suppliersStore)

const showDeleteModal = ref(false)
const supplierToDelete = ref(null)

const deleteSupplier = async () => {
  if (!supplierToDelete.value) return
  try {
    await suppliersStore.deleteSupplier(supplierToDelete.value.id)
    toast.success(`Fornecedor "${supplierToDelete.value.company_name}" excluído com sucesso!`)
    suppliersStore.fetchSuppliers()
  } catch (error) {
    toast.error(`Erro ao excluir fornecedor: ${error.message}`)
  } finally {
    showDeleteModal.value = false
    supplierToDelete.value = null
  }
}
const removeSupplier = (supplier) => {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

const cancelDelete = () => {
  supplierToDelete.value = null
  showDeleteModal.value = false
}

onMounted(async () => {
  suppliersStore.fetchSuppliers()   

})

// Watch search e paginação
watch(filters, () => {
  suppliersStore.changePage(1)
  suppliersStore.fetchSuppliers()
}, { deep: true })

</script>
