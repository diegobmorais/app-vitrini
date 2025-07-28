import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchServices() {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/service')
      services.value = response.data
    } catch (err) {
      error.value = err
      console.error('Erro ao buscar serviços:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    services,
    loading,
    error,
    fetchServices
  }
})
