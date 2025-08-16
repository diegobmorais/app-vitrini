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
        async fetchAvailableSlots(serviceId, startDate, endDate) {
            this.loading = true
            this.error = null
            try {
                const { data } = await api.get('/api/appointments', {
                    params: { service_id: serviceId, start_date: startDate, end_date: endDate }
                })
                this.slots = data.map(dt => ({
                    date: dt.split(' ')[0],
                    start_time: dt.split(' ')[1],
                    end_time: dt.split(' ')[1],
                    is_booked: false, 
                }))
            } catch (err) {
                this.error = 'Erro ao buscar horários disponíveis'
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

        async fetchRules(serviceId) {
            const { data } = await api.get('/api/availability-rules', { params: { service_id: serviceId } })
            this.rules = data
        },

        async fetchExceptions(serviceId) {
            const { data } = await api.get('/api/availability-exceptions', { params: { service_id: serviceId } })
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
