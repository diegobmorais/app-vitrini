<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Controle de Estoque</h1>
        <p class="text-gray-600">Gerencie o estoque de produtos</p>
      </div>
      <button @click="openAdjustmentModal()"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
        Ajustar Estoque
      </button>
    </div>
    <!-- Resumo do Estoque -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <svg class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total de Produtos
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ inventoryStore.metrics.total }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Produtos em Estoque
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ inStockCount }}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Estoque Baixo
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ lowStockCount }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 truncate">
                Sem Estoque
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ outOfStockCount}}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div class="flex-1 mb-4 md:mb-0">
            <input v-model="search" @input="handleSearch($event.target.value)" placeholder="Buscar Produtos..." class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
            focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div class="flex space-x-4">
            <select v-model="categoryFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <select v-model="stockFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option value="all">Todos</option>
              <option value="low">Estoque Baixo</option>
              <option value="out">Sem Estoque</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque Atual</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque Mínimo</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atualização</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <div class="flex-shrink-0 h-10 w-10">
                    <img v-if="product.image" :src="product.image" alt="" class="h-10 w-10 rounded-md object-cover">
                    <div v-else class="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div> -->
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.brand }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getCategoryName(product.category_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStockStatusClass(product)">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.low_stock_threshold }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(product.stock_movements.at(-1)?.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openAdjustmentModal(product)" class="text-primary-600 hover:text-primary-900">
                  Ajustar
                </button>
                <button @click="viewHistory(product.id)" class="ml-3 text-gray-600 hover:text-gray-900">
                  Histórico
                </button>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhum produto encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ filteredProducts.length }}</span> de <span class="font-medium">{{
              inventoryStore.products.length }}</span> produtos
          </div>
          <div class="flex-1 flex justify-end">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="inventoryStore.prevPage" :disabled="inventoryStore.pagination.current_page === 1"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Anterior
                    </button>
                    <button @click="inventoryStore.nextPage"
                      :disabled="inventoryStore.pagination.current_page === inventoryStore.pagination.last_page"
                      class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Próximo
                    </button>
                  </div>
                  <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="inventoryStore.prevPage"
                          :disabled="inventoryStore.pagination.current_page === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                          <span class="sr-only">Anterior</span>
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          v-for="page in Array.from({ length: inventoryStore.pagination.last_page }, (_, i) => i + 1)"
                          :key="page" @click="inventoryStore.goToPage(page)" :class="[
                            inventoryStore.pagination.current_page === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                          ]">
                          {{ page }}
                        </button>
                        <button @click="inventoryStore.nextPage"
                          :disabled="inventoryStore.pagination.current_page === inventoryStore.pagination.last_page"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                          <span class="sr-only">Próximo</span>
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de ajuste -->
    <AjustmentStockModal v-if="showAdjustmentModal" :show-adjustment-modal="showAdjustmentModal"
      :selected-product="selectedProduct" @close="closeAdjustmentModal" @saved="onAdjustmentSaved" />
  </div>
</template>

<script setup>
import AjustmentStockModal from '@/components/modals/AjustmentStockModal.vue'
import { useCategoryStore } from '@/store/modules/useCategoryStore'
import { useInventoryStore } from '@/store/modules/useInventoryStore'
import { computed, ref, onMounted } from 'vue'

const inventoryStore = useInventoryStore()
const categoryStore = useCategoryStore()

// Modal de ajuste de estoque
const showAdjustmentModal = ref(false)
const selectedProduct = ref(null)

const inStockCount = computed(() => inventoryStore.metrics.in_stock)
const lowStockCount = computed(() => inventoryStore.metrics.low_stock)
const outOfStockCount = computed(() => inventoryStore.metrics.out_of_stock)

// Filtros
const categoryFilter = computed({
  get: () => inventoryStore.categoryFilter,
  set: (value) => inventoryStore.setCategoryFilter(value)
})

const stockFilter = computed({
  get: () => inventoryStore.stockFilter,
  set: (value) => inventoryStore.setStockFilter(value)
})

const search = computed({
  get: () => inventoryStore.search,
  set: (value) => inventoryStore.setSearch(value)
})

// Busca com debounce
let debounceTimer = null
const handleSearch = (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    inventoryStore.setSearch(value)
    inventoryStore.goToPage(1)
  }, 500)
}

const categories = computed(() => categoryStore.categories)
const filteredProducts = computed(() => {
  return inventoryStore.products
})

const openAdjustmentModal = (product) => {
  selectedProduct.value = product
  showAdjustmentModal.value = true
}

const closeAdjustmentModal = () => {
  showAdjustmentModal.value = false
  selectedProduct.value = null
}

const onAdjustmentSaved = () => {
  inventoryStore.fetchStock()
  closeAdjustmentModal()
}

const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId)
  return category ? category.name : 'Sem categoria'
}

const getStockStatusClass = (product) => {
  if (product.stock === 0) {
    return 'bg-red-100 text-red-800'
  } else if (product.stock <= product.low_stock_threshold) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-green-100 text-green-800'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '–'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await inventoryStore.fetchStock() 
})
</script>