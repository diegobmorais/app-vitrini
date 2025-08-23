import { defineStore } from 'pinia'
import api from '@/main'

export const useServiceAvailabilityStore = defineStore('serviceAvailability', {
    state: () => ({
        slots: [],
        appointments: [],
        selectedServiceIds: [],
        loading: false,
        error: null,
        rules: [],
        exceptions: [],
    }),

    actions: {
        async fetchAvailableSlots({ start_date, end_date, service_ids }) {
            const { data } = await api.get('api/calendar/slots', {
                params: { start_date, end_date, service_ids }
            })
            this.slots = data
            return data
        },

        async bookSlot(dateTime, user_id, service_id, pet_name) {
            const slot = this.slots.find(s => s.start === dateTime)
            if (!slot) throw new Error('Slot não encontrado')
            await api.post('api/calendar/book', { slot_id: slot.slot_id, user_id, pet_name })
            slot.is_booked = true
        },

        async blockSlot(slot_id) {
            await api.post('api/calendar/block', { slot_id })
            const slot = this.slots.find(s => s.slot_id === slot_id)
            if (slot) slot.status = 'blocked'
        },

        async fetchAvailableSlotsByService({ service_id, start_date }) {
            const { data } = await api.get('/api/availability', {
                params: { service_id, start_date }
            })
            this.slots = data.days || []
            return data.days
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
    }
})
