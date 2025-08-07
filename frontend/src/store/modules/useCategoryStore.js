// stores/categories.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useCategoryStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const category = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allCategories = computed(() => categories.value)

  const categoryById = (id) => {
    return categories.value.find((c) => c.id === id)
  }

  const currentCategory = computed(() => category.value)

  const isLoading = computed(() => loading.value)

  const getError = computed(() => error.value)

  const getCategoryName = (id) => {
    const cat = categories.value.find((c) => c.id === id)
    return cat ? cat.name : 'Categoria não encontrada'
  }

  const getMainCategories = computed(() =>
    categories.value.filter((c) => !c.parent_id)
  )

  const getSubcategories = (parentId) => {
    return categories.value.filter((c) => c.parent_id === parentId)
  }

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await api.get('api/category')
      categories.value = response.data
      error.value = null  
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao carregar categorias'
      console.error('Erro ao carregar categorias:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryById = async (categoryId) => {
    loading.value = true
    try {
      const response = await api.get(`api/category/${categoryId}`)
      category.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message || 'Erro ao carregar detalhes da categoria'
      console.error('Erro ao carregar categoria:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryProducts = async (categoryId, productStore) => {   
    productStore.updateFilters({ category: categoryId })
    await productStore.fetchProducts()

    await fetchCategoryById(categoryId)
  }

  const createCategory = async (data) => {
    try {
      const response = await api.post('api/category', data)      
      await fetchCategories()
      return response.data
    } catch (err) {
      console.error('Erro ao criar categoria:', err)
    }
  }

  const deleteCategoryById = async (categoryId) => {
    try {
      await api.delete(`api/category/${categoryId}`)
      await fetchCategories()
      
    } catch (err) {
      console.error('Erro ao excluir categoria:', err)
    }
  }

  const updateCategory = async (categoryId, data) => {    
    try {
      const response = await api.put(`api/category/${categoryId}`, data)
      await fetchCategories()
      return response.data
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err)
    }
  }

  return {
    // State
    categories,
    category,
    loading,
    error,

    // Getters
    allCategories,
    categoryById,
    currentCategory,
    isLoading,
    getError,
    getCategoryName,
    getMainCategories,
    getSubcategories,

    // Actions
    fetchCategories,
    fetchCategoryById,
    fetchCategoryProducts,
    deleteCategoryById,
    updateCategory,
    createCategory
  }
})
