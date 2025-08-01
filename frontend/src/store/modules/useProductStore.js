// stores/useProductStore.js
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import api from '@/main'

export const useProductStore = defineStore('products', () => {
  // States
  const products = ref([])
  const product = ref(null)
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const uploadSessionId = ref(null)
  const uploadedImages = ref([])

  // Getters (como computed)
  const getProducts = computed(() => products.value)
  const getProduct = computed(() => product.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters)
  const getPagination = computed(() => pagination)

  const filters = reactive({
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    stock: "",
    sort: "featured",
  })

  const pagination = reactive({
    currentPage: 1,
    perPage: 10,
  })

  const totalPages = computed(() => pagination.totalPages || 1)

  // Actions
  async function fetchProducts() {
    try {
      loading.value = true

      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        category_id: filters.category,
        search: filters.search,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        sort: filters.sort,
        stock: filters.stock,
      }

      const response = await api.get('api/product', { params })

      products.value = response.data.data

      pagination.currentPage = response.data.current_page
      pagination.totalPages = response.data.last_page
      pagination.totalItems = response.data.total
      pagination.perPage = response.data.per_page
      pagination.from = response.data.from
      pagination.to = response.data.to

      error.value = null

      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produtos'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug) {
    try {
      loading.value = true
      const response = await api.get(`api/product-detail/${slug}`)
      product.value = response.data
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produto'
      console.error('Error fetching product:', err)
    } finally {
      loading.value = false
    }
  }

  async function createProduct(payload) {
    try {
      const response = await api.post('/api/product', payload)
      return response.data
    } catch (err) {
      console.error('Erro ao criar produto: ', err.response?.data)
      throw err
    }
  }

  async function updateProduct({ id, data }) {
    try {
      const response = await api.put(`/api/product/${id}`, data)
      return response.data.data
    } catch (err) {
      console.error('Erro ao atualizar produto:', err.response?.data)
      throw err
    }
  }

  async function deleteProduct(id) {
    const response = await api.delete(`/api/product/${id}`)
    return response
  }

  function updateFilters(newFilters) {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    fetchProducts()
  }

  function changePage(page) {
    pagination.currentPage = page
    fetchProducts()
  }

  function resetFilters() {
    filters.category = null
    filters.search = ""
    filters.minPrice = null
    filters.maxPrice = null
    filters.sort = "featured"
    filters.stock = ""
    pagination.currentPage = 1
    fetchProducts()
  }

  async function uploadTempImages(files) {
    if (!uploadSessionId.value) {
      uploadSessionId.value = crypto.randomUUID()
    }

    const formData = new FormData()
    formData.append('upload_session_id', uploadSessionId.value)

    for (const file of files) {
      formData.append('images[]', file)
    }

    try {
      const response = await api.post('/api/uploads/temp-images', formData)
      uploadedImages.value.push(...response.data.images)
    } catch (err) {
      console.error('Erro ao enviar imagens:', err)
    }
  }

  function resetUploadSession() {
    uploadSessionId.value = null
    uploadedImages.value = []
  }

  return {
    // state
    products,
    product,
    items,
    loading,
    error,
    filters,
    pagination,
    uploadSessionId,
    uploadedImages,

    // getters
    getProducts,
    getProduct,
    isLoading,
    getError,
    getFilters,
    getPagination,
    totalPages,

    // actions
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage,
    resetFilters,
    uploadTempImages,
    resetUploadSession,
  }
})
