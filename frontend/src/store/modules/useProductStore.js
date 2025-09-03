// src/stores/productStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const product = ref(null)
  const related_products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const uploadSessionId = ref(null)
  const uploadedImages = ref([])
  const filters = ref({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    stock: '',
    sort: 'featured'
  })
  const pagination = ref({
    currentPage: 1,
    perPage: 9,
    totalPages: 1,
    totalItems: 0,
    from: 0,
    to: 0
  })


  const getProducts = computed(() => products.value)
  const getProduct = computed(() => product.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  const totalPages = computed(() => pagination.value.totalPages || 1)

  // Buscar todos os produtos
  const fetchProducts = async (page = {}) => {      
    loading.value = true
    error.value = null

    try {
      const filtersToUse = {
        ...filters.value,      
      }

      const params = {
        page: page.page,
        per_page: pagination.value.perPage,
        category_id: filtersToUse.category || undefined,
        search: filtersToUse.search || undefined,
        min_price: filtersToUse.minPrice || undefined,
        max_price: filtersToUse.maxPrice || undefined,
        sort: filtersToUse.sort,
        stock: filtersToUse.stock || undefined
      }

      const response = await api.get('/api/product', { params })

      products.value = response.data.data
      pagination.value.currentPage = response.data.current_page
      pagination.value.totalPages = response.data.last_page
      pagination.value.totalItems = response.data.total
      pagination.value.perPage = response.data.per_page
      pagination.value.from = response.data.from
      pagination.value.to = response.data.to
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produtos'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  // Buscar um único produto
  const fetchProduct = async (slug) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/api/product-detail/${slug}`)
      product.value = response.data.product
      related_products.value = response.data.related_products
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produto'
      console.error('Error fetching product:', err)
    } finally {
      loading.value = false
    }
  }

  // Criar produto
  const createProduct = async (payload) => {
    try {
      const response = await api.post('/api/product', payload)
      return response.data
    } catch (err) {
      console.error('Erro ao criar produto:', err.response?.data)
      throw err
    }
  }

  // Atualizar produto
  const updateProduct = async ({ id, data }) => {
    try {
      const response = await api.put(`/api/product/${id}`, data)
      return response.data.data
    } catch (err) {
      console.error('Erro ao atualizar produto:', err.response?.data)
      throw err
    }
  }

  // Deletar produto
  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(`/api/product/${id}`)
      products.value = products.value.filter(p => p.id !== id)
      return response.data
    } catch (err) {
      console.error('Erro ao excluir produto:', err.response?.data)
      throw err
    }
  }

  // Atualizar filtros e resetar página
  const updateFilters = (newFilters) => {
    Object.assign(filters.value, newFilters)
    pagination.value.currentPage = 1
    fetchProducts()
  }

  // Mudar página
  const changePage = (page) => {
    pagination.value.currentPage = page
    fetchProducts()
  }

  // Resetar filtros
  const resetFilters = () => {
    filters.value = {
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'featured',
      stock: ''
    }
    pagination.value.currentPage = 1
    fetchProducts()
  }

  // Upload de imagens temporárias
  const uploadTempImages = async (files) => {
    if (!uploadSessionId.value) {
      uploadSessionId.value = crypto.randomUUID()
    }

    const formData = new FormData()
    formData.append('upload_session_id', uploadSessionId.value)

    files.forEach(file => {
      formData.append('images[]', file)
    })

    try {
      const response = await api.post('/api/uploads/temp-images', formData)
      uploadedImages.value.push(...response.data.images)
    } catch (err) {
      console.error('Erro ao enviar imagens:', err)
    }
  }

  // Resetar sessão de upload
  const resetUploadSession = () => {
    uploadSessionId.value = null
    uploadedImages.value = []
  }

  return {
    // state
    products,
    product,
    related_products,
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
    resetUploadSession
  }
})
