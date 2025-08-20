import { defineStore } from 'pinia'
import api from '@/main'

export const useServiceAvailabilityStore = defineStore('serviceAvailability', {
    state: () => ({
        slots: [],
        selectedServiceIds: [], 
        loading: false,
        error: null,
        rules: [],
        exceptions: [],
    }),

    actions: {
        async fetchAvailableSlots({ start_date, end_date, service_ids = [] }) {
            const { data } = await api.get('/api/availability/slots', {
                params: { start_date, end_date, service_ids }
            })
            this.slots = data
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
