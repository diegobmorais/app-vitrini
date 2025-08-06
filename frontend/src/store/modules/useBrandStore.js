import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useBrandStore = defineStore('brands', () => {
  // State
  const brands = ref([])

  // Getters
  const allBrands = computed(() => brands.value)

  // Actions
  async function fetchBrands() {
    const response = await api.get('api/brands')
    brands.value = response.data
    return response.data
  }

  return {
    brands,
    allBrands,
    fetchBrands,
  }
})
