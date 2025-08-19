import { defineStore } from 'pinia'
import api from '@/main'

export const useServiceAvailabilityStore = defineStore('serviceAvailability', {
    state: () => ({
        slots: [],
        loading: false,
        error: null,
        rules: [],
        exceptions: [],
    }),

    actions: {
        async fetchAvailableSlots(serviceId, startDate) {
            this.loading = true
            this.error = null

            try {
                const params = {
                    service_id: serviceId,
                    start: startDate
                }
                const response = await api.get('/api/availability', { params })
                this.slots = response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao carregar slots'
            } finally {
                this.loading = false
            }
        },

        async createRule(ruleData) {
            await api.post('/api/availability-rules', ruleData)
            this.fetchRules(ruleData.service_id)
        },

        async createException(exceptionData) {
            await api.post('/api/availability-exceptions', exceptionData)
            this.fetchExceptions(exceptionData.service_id)
        },
        async fetchRules(service_id) {
            const { data } = await api.get(`/api/availability-rules?service_id=${service_id}`)
            this.rules = data
        },

        async fetchExceptions(service_id) {
            const { data } = await api.get(`/api/availability-exceptions?service_id=${service_id}`)
            this.exceptions = data
        },

        async bookSlot(dateTime, userId, serviceId, petName) {
            await api.post('/api/appointments', {
                scheduled_at: dateTime,
                user_id: userId,
                service_id: serviceId,
                pet_name: petName,
            })
            this.slots = this.slots.map(s => s.start_time === dateTime ? { ...s, is_booked: true } : s)
        }
    }
})
