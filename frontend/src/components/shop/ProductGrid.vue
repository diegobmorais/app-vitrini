<template>
  <div>
    <!-- Filtros e ordenação -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Filtros -->
        <div class="flex flex-wrap gap-2">
          <div class="relative">
            <select v-model="selectedCategory"
              class="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-primary-500"
              @change="applyFilters">
              <option :value="null">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div class="relative">
            <select v-model="selectedSort"
              class="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-primary-500"
              @change="applyFilters">
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
              <option value="newest">Mais recentes</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Busca -->
        <div class="relative flex-grow max-w-md">
          <input v-model="searchQuery" type="text" placeholder="Buscar produtos..."
            class="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pl-10 rounded leading-tight focus:outline-none focus:bg-white focus:border-primary-500"
            @keyup.enter="applyFilters">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary-500"
            @click="applyFilters">
            <span class="sr-only">Buscar</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filtros ativos e reset -->
      <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-sm text-gray-600">Filtros ativos:</span>

        <div v-if="selectedCategory"
          class="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded px-2 py-1">
          <span>{{ getCategoryName(selectedCategory) }}</span>
          <button @click="clearCategoryFilter" class="ml-1 text-gray-500 hover:text-gray-700">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="searchQuery" class="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded px-2 py-1">
          <span>Busca: {{ searchQuery }}</span>
          <button @click="clearSearchFilter" class="ml-1 text-gray-500 hover:text-gray-700">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <button @click="resetFilters" class="text-xs text-primary-600 hover:text-primary-800 hover:underline ml-2">
          Limpar todos os filtros
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Erro!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
      <p class="text-gray-600 mb-4">Tente ajustar seus filtros ou buscar por outro termo.</p>
      <button @click="resetFilters"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
          </path>
        </svg>
        Limpar filtros
      </button>
    </div>

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <product-card v-for="product in products" :key="product.id" :product="product" @add-to-cart="addToCart" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <!-- Previous page -->
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="sr-only">Anterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Page numbers -->
        <template v-for="page in paginationRange" :key="page">
          <button v-if="page !== '...'" @click="changePage(page)" :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
            currentPage === page
              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>
          <span v-else
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            ...
          </span>
        </template>

        <!-- Next page -->
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="sr-only">Próxima</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'

import { useProductsStore } from '@/store/useProductsStore'
import { useCartStore } from '@/store/useCartStore'
import { useCategoriesStore } from '@/store/useCategoriesStore'

const props = defineProps({
  categorySlug: {
    type: String,
    default: null
  }
})

const productsStore = useProductsStore()
const cartStore = useCartStore()
const categoriesStore = useCategoriesStore()

const route = useRoute()
const router = useRouter()

// Local state
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedSort = ref('featured')

// Computed properties from Pinia stores
const products = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const categories = computed(() => categoriesStore.categories)
const pagination = computed(() => productsStore.pagination)

const currentPage = computed(() => pagination.value.currentPage)
const totalPages = computed(() => pagination.value.totalPages)

const hasActiveFilters = computed(() => {
  return selectedCategory.value || searchQuery.value || selectedSort.value !== 'featured'
})

// Generate pagination range with ellipsis
const paginationRange = computed(() => {
  const range = []
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1 // Number of pages to show before and after current page

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // Always show first page
      i === total || // Always show last page
      (i >= current - delta && i <= current + delta) // Show pages around current page
    ) {
      range.push(i)
    } else if (i === 2 && current > 3) {
      range.push('...')
    } else if (i === total - 1 && current < total - 2) {
      range.push('...')
    }
  }

  return range
})

// Methods
function getCategoryName(categoryId) {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : ''
}

function applyFilters() {
  productsStore.updateFilters({
    category: selectedCategory.value,
    search: searchQuery.value,
    sort: selectedSort.value
  })

  // Update URL query params
  router.push({
    query: {
      ...route.query,
      category: selectedCategory.value || undefined,
      search: searchQuery.value || undefined,
      sort: selectedSort.value !== 'featured' ? selectedSort.value : undefined,
      page: undefined // Reset to page 1
    }
  })
}

function clearCategoryFilter() {
  selectedCategory.value = null
  applyFilters()
}

function clearSearchFilter() {
  searchQuery.value = ''
  applyFilters()
}

function resetFilters() {
  selectedCategory.value = null
  searchQuery.value = ''
  selectedSort.value = 'featured'
  productsStore.resetFilters()

  // Clear URL query params
  router.push({ query: {} })
}

function changePage(page) {
  productsStore.changePage(page)

  // Update URL query param
  router.push({
    query: {
      ...route.query,
      page: page > 1 ? page : undefined
    }
  })

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function addToCart(product, quantity) {
  cartStore.addToCart({ product, quantity })
}

// Initialize from URL params or props
onMounted(() => {
  // Set category from prop if provided
  if (props.categorySlug) {
    const category = categories.value.find(cat => cat.slug === props.categorySlug)
    if (category) {
      selectedCategory.value = category.id
    }
  }

  // Set filters from URL query params
  if (route.query.category) {
    selectedCategory.value = Number(route.query.category)
  }

  if (route.query.search) {
    searchQuery.value = route.query.search
  }

  if (route.query.sort) {
    selectedSort.value = route.query.sort
  }

  if (route.query.page) {
    productsStore.setPagination({ currentPage: Number(route.query.page) })
  }

  // Fetch products with current filters
  productsStore.fetchProducts()
})

// Watch for category prop changes
watch(() => props.categorySlug, (newSlug) => {
  if (newSlug) {
    const category = categories.value.find(cat => cat.slug === newSlug)
    if (category) {
      selectedCategory.value = category.id
      applyFilters()
    }
  }
})
</script>