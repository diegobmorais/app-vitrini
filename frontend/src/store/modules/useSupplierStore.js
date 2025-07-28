import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useSupplierStore = defineStore('suppliers', () => {
  // State
  const suppliers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const allSuppliers = computed(() => suppliers.value)
  const activeSuppliers = computed(() => suppliers.value.filter(supplier => supplier.active))
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Getter com parâmetro: buscar supplier por id
  function supplierById(id) {
    return suppliers.value.find(supplier => supplier.id === id)
  }

  // Actions
  async function fetchSuppliers() {
    loading.value = true
    try {
      const response = await api.get('api/suppliers')
      suppliers.value = response.data
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function saveSupplier(supplier) {
    loading.value = true
    try {
      // Simulação delay para API
      await new Promise(resolve => setTimeout(resolve, 500))

      if (supplier.id) {
        // Atualizar fornecedor existente
        const index = suppliers.value.findIndex(s => s.id === supplier.id)
        if (index !== -1) {
          suppliers.value.splice(index, 1, supplier)
        }
      } else {
        // Criar novo fornecedor
        const newId = Date.now()
        suppliers.value.push({ ...supplier, id: newId })
      }
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deleteSupplier(id) {
    loading.value = true
    try {
      // Simulação delay para API
      await new Promise(resolve => setTimeout(resolve, 500))

      suppliers.value = suppliers.value.filter(s => s.id !== id)
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    suppliers,
    loading,
    error,

    // getters
    allSuppliers,
    activeSuppliers,
    isLoading,
    hasError,
    supplierById,

    // actions
    fetchSuppliers,
    saveSupplier,
    deleteSupplier,
  }
})
