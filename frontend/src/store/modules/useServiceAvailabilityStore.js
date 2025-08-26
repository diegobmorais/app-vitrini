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
            const response = await api.get('api/calendar/slots', {
                params: { start_date, end_date, service_ids }
            })
            this.slots = response.data         
                     
            return response.data
        },

        async bookSlotByAdmin(slot_id, pet_name, notes, transport_option) {
            try {              
                const response = await api.post('api/calendar/book-by-admin', {
                    slot_id: slot_id,
                    pet_name: pet_name,
                    notes: notes,
                    transport_option: transport_option
                })

                return response
            } catch (error) {
                console.error('Erro na requisição:', error)
                throw error
            }
        },

        async blockSlot(slot_id) {
            await api.post('api/calendar/block',
                { slot_id: slot_id },
            )
            const slot = this.slots.find(s => s.slot_id === slot_id)
            if (slot) slot.status = 'blocked'
        },

        async unblockSlot(slot_id) {
            await api.post('api/calendar/unblock', { slot_id })
            const slot = this.slots.find(s => s.slot_id === slot_id)
            if (slot) slot.status = 'open'
        },

        async fetchAvailableSlotsByService({ service_id, start_date }) {
            const { data } = await api.get('/api/availability', {
                params: { service_id, start_date }
            })
            this.slots = data.days || []
            return data.days
        },

        async createTimeSlots(payload) {
            try {
                this.loading = true
                const response = await api.post('/api/generate-slots', payload)
                this.loading = false
                return response.data
            } catch (error) {
                this.error = error
                this.loading = false
                throw error
            }
        },
    }
})
