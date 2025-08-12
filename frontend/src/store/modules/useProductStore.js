import { defineStore } from 'pinia'
import api from '@/main'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    product: null,
    related_products: [],
    loading: false,
    error: null,
    uploadSessionId: null,
    uploadedImages: [],
    filters: {
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      stock: '',
      sort: 'featured'
    },
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
      from: 0,
      to: 0
    }
  }),

  getters: {
    getProducts: (state) => state.products,
    getProduct: (state) => state.product,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getFilters: (state) => state.filters,
    getPagination: (state) => state.pagination,
    totalPages: (state) => state.pagination.totalPages || 1
  },

  actions: {
    async fetchProducts(externalFilters = {}) {
      this.loading = true
      this.error = null
      try {
        const filtersToUse = {
          ...this.filters,
          ...externalFilters
        }
        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.perPage,
          category_id: filtersToUse.category || undefined,
          search: filtersToUse.search || undefined,
          min_price: filtersToUse.minPrice || undefined,
          max_price: filtersToUse.maxPrice || undefined,
          sort: filtersToUse.sort,
          stock: filtersToUse.stock || undefined
        }

        const response = await api.get('/api/product', { params })

        this.products = response.data.data
        this.pagination.currentPage = response.data.current_page
        this.pagination.totalPages = response.data.last_page
        this.pagination.totalItems = response.data.total
        this.pagination.perPage = response.data.per_page
        this.pagination.from = response.data.from
        this.pagination.to = response.data.to
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar produtos'
        console.error('Error fetching products:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(slug) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/api/product-detail/${slug}`)
        this.product = response.data.product
        this.related_products = response.data.related_products
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar produto'
        console.error('Error fetching product:', err)
      } finally {
        this.loading = false
      }
    },

    async createProduct(payload) {
      try {
        const response = await api.post('/api/product', payload)
        return response.data
      } catch (err) {
        console.error('Erro ao criar produto:', err.response?.data)
        throw err
      }
    },

    async updateProduct({ id, data }) {
      try {
        const response = await api.put(`/api/product/${id}`, data)
        return response.data.data
      } catch (err) {
        console.error('Erro ao atualizar produto:', err.response?.data)
        throw err
      }
    },

    async deleteProduct(id) {
      try {
        const response = await api.delete(`/api/product/${id}`)

        this.products = this.products.filter(p => p.id !== id)
        return response.data
      } catch (err) {
        console.error('Erro ao excluir produto:', err.response?.data)
        throw err
      }
    },

    updateFilters(newFilters) {
      Object.assign(this.filters, newFilters)
      this.pagination.currentPage = 1
      this.fetchProducts()
    },

    changePage(page) {
      this.pagination.currentPage = page
      this.fetchProducts()
    },

    resetFilters() {
      this.filters.category = ''
      this.filters.search = ''
      this.filters.minPrice = ''
      this.filters.maxPrice = ''
      this.filters.sort = 'featured'
      this.filters.stock = ''
      this.pagination.currentPage = 1
      this.fetchProducts()
    },

    async uploadTempImages(files) {
      if (!this.uploadSessionId) {
        this.uploadSessionId = crypto.randomUUID()
      }

      const formData = new FormData()
      formData.append('upload_session_id', this.uploadSessionId)

      files.forEach(file => {
        formData.append('images[]', file)
      })

      try {
        const response = await api.post('/api/uploads/temp-images', formData)
        this.uploadedImages.push(...response.data.images)
      } catch (err) {
        console.error('Erro ao enviar imagens:', err)
      }
    },

    resetUploadSession() {
      this.uploadSessionId = null
      this.uploadedImages = []
    },
  }

})