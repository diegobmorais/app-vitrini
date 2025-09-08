import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/main'

export const useShippingMethod = defineStore('shipping', () => {
    const shippingMethods = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchShippingMethods = async () => {
        loading.value = true
        error.value = null
        try {
            const { data } = await api.get('api/shipping-methods')
            shippingMethods.value = data
        } catch (err) {
            error.value = 'Erro ao carregar métodos de envio'
        } finally {
            loading.value = false
        }
    }

    return {
        shippingMethods,
        loading,
        error,
        fetchShippingMethods
    }
})
