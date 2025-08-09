import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useBrandStore = defineStore('brands', () => {
  // State
  const brands = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalBrands = ref(0)
  const lastPage = ref(1)

  // Getters (como computed)
  const brandCount = computed(() => brands.value.length)
  const getBrandById = (id) => brands.value.find(b => b.id === id)

  // Actions
  async function fetchBrands(page = 1, limit = 10, search = '') {
    loading.value = true
    error.value = null
    try {
      const response  = await api.get('/api/brands', {
        params: { page, limit, search }
      })
      brands.value = response.data.data
      totalBrands.value = response.data.total
      lastPage.value = response.data.last_page
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao buscar marcas'
      console.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBrand(payload) {
    try {
      const response = await api.post('/api/brands', payload)
      brands.value = response.data

      await fetchBrands()

      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao carregar categorias'
      console.error('Erro ao carregar categorias:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateBrand(id, payload) {
    const response = await api.put(`/api/brands/${id}`, payload)
    await fetchBrands()
    
    return response.data
  }

  async function deleteBrand(id) {
    await api.delete(`/api/brands/${id}`)
    brands.value = brands.value.filter(b => b.id !== id)
  }

  // Exponha tudo
  return {
    // state
    brands,
    loading,
    error,
    totalBrands,
    lastPage,

    // getters
    brandCount,
    getBrandById,

    // actions
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  }
})