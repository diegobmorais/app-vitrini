/* eslint-disable no-useless-catch */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/main'


export const useServiceStore = defineStore('service', () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  function getImageUrl(path) {
    return path ? `${baseURL}/storage/${path}` : null
  }

  async function fetchServices() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/service')
      services.value = response.data
    } catch (err) {
      error.value = err
      console.error('Erro ao buscar serviços:', err)
    } finally {
      loading.value = false
    }
  }

  async function createService(payload) {
    try {
      const response = await api.post('/api/service', payload)
      services.value.push(response.data)
      await fetchServices()
      
      return response.data
    } catch (err) {
      error.value = err
    }
  }

  async function updateService(serviceId, payload) {
    try {
      if (payload instanceof FormData) {
        payload.append('_method', 'PUT')
        const response = await api.post(`/api/service/${serviceId}`, payload)

        const index = services.value.findIndex(service => service.id === serviceId)
        if (index !== -1) {
          services.value[index] = response.data
        }
        await fetchServices()
        return response.data
      } else {
        const response = await api.put(`/api/service/${serviceId}`, payload)
        const index = services.value.findIndex(service => service.id === serviceId)
        if (index !== -1) {
          services.value[index] = response.data
        }
        await fetchServices()
        return response.data
      }
    } catch (error) {
      error.value = error
      throw error
    }
  }


  async function deleteService(serviceId) {
    try {
      await api.delete(`/api/service/${serviceId}`)
      await fetchServices()
    } catch (error) {
      error.value = error
    }
  }

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    fetchServices,
    getImageUrl
  }
})
