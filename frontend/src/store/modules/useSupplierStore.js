import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import api from '@/main'

export const useSupplierStore = defineStore('suppliers', () => {
  // State
  const suppliers = ref([])
  const supplier = ref()
  const loading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const getSupplier = computed(() => supplier.value)
  const getSuppliers = computed(() => suppliers.value)
  const activeSuppliers = computed(() => suppliers.value.filter(supplier => supplier.active))
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const getFilters = computed(() => filters)
  const filters = reactive({   
    search: "",  
    status: "all",
  })
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  })

  const filteredSuppliers = computed(() => {
    let result = suppliers.value

    if (status.value === 'active') {
      result = result.filter(supplier => supplier.active)
    } else if (status.value === 'inactive') {
      result = result.filter(supplier => !supplier.active)
    }

    if (filters.value) {
      const searchLower = filters.value.toLowerCase()
      result = result.filter(supplier =>
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.cnpj.toLowerCase().includes(searchLower) ||
        supplier.contact_name.toLowerCase().includes(searchLower) ||
        supplier.email.toLowerCase().includes(searchLower)
      )
    }

    return result
  })

  // Getter com parâmetro: buscar supplier por id
  function supplierById(id) {
    return supplier.value.find(supplier => supplier.id === id)
  }

  // Actions
  async function fetchSupplier(id) {
    try {
      const response = await api.get(`api/suppliers/${id}`)
      supplier.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error.response?.data)
    }
  }
  async function fetchSuppliers() {
    loading.value = true
    try {
      const response = await api.get('api/suppliers', {
        params: {
          ...filters,
          page: pagination.value.currentPage,
          per_page: pagination.value.perPage,         
        }
      })
      suppliers.value = response.data.data
      pagination.value.total = response.total
      pagination.value.lastPage = response.last_page
      pagination.value.currentPage = response.current_page
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createSupplier(payload) {
    try {
      const response = await api.post("api/suppliers", payload)
      return response.data
    } catch (error) {
      console.error('Erro ao cria fornecedor', error.response?.data)
    }
  }

  async function updateSupplier({ id, payload }) {
    try {
      const response = await api.put(`api/suppliers/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar fornecedor', error.response?.data)
    }
  }
  async function deleteSupplier(id) {
    loading.value = true
    const response = await api.delete(`api/suppliers/${id}`)

    return response
  }

  function changePage(page) {
    if (page >= 1 && page <= pagination.value.lastPage) {
      pagination.value.currentPage = page
      fetchSuppliers()
    }
  }


  return {
    // state
    suppliers,
    loading,
    error,
    pagination,
    filters,

    // getters
    getFilters,
    getSupplier,
    filteredSuppliers,
    getSuppliers,
    activeSuppliers,
    isLoading,
    hasError,

    // actions
    fetchSuppliers,
    fetchSupplier,
    createSupplier,
    deleteSupplier,
    updateSupplier,
    supplierById,
    changePage,
  }
})
