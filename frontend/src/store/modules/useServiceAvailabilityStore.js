
import { defineStore } from 'pinia'
import api from '@/main'

export const useServiceAvailabilityStore = defineStore('serviceAvailability', {
    state: () => ({
        slots: [],
        loading: false,
        error: null,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        },
        filters: {
            service_id: '',
            date: '',
            status: ''
        }
    }),

    getters: {
        filteredSlots: (state) => state.slots,

        availableSlotsCount: (state) =>
            state.slots.filter(slot => !slot.is_booked).length,

        bookedSlotsCount: (state) =>
            state.slots.filter(slot => slot.is_booked).length
    },

    actions: {

        async fetchSlots(params = {}) {
            this.loading = true
            this.error = null

            try {
                const queryParams = {
                    page: this.pagination.current_page,
                    service_id: this.filters.service_id || params.service_id,
                    date: this.filters.date || params.date,
                    status: this.filters.status || params.status
                }

                const response = await api.get('/api/availability-slots', {
                    params: queryParams
                })

                this.slots = response.data.data || response.data
                this.pagination = {
                    current_page: response.data.current_page || 1,
                    last_page: response.data.last_page || 1,
                    per_page: response.data.per_page || 10,
                    total: response.data.total || response.data.length || 0
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao carregar slots'
                console.error('Erro em fetchSlots:', err)
            } finally {
                this.loading = false
            }
        },

        async createSlots(slotData) {
            try {
                const response = await api.post('/api/availability-slots', slotData)

                // Atualiza a lista
                await this.fetchSlots()

                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao criar slots'
                console.error('Erro em createSlots:', err)
                throw err
            }
        },
        async getFreeSlots($id) {
            try {
                const response = await api.get(`/api/availability-slots/${$id}/free-time`)
                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao buscar slots'
                console.error('Erro em getFreeSlots:', err)
                throw err
            }
        },

        async bookSlot(slotId) {
            try {
                const response = await api.post(`/api/availability-slots/${slotId}/book`)

                const index = this.slots.findIndex(s => s.id === slotId)
                if (index !== -1) {
                    this.slots[index] = response.data
                }

                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao reservar slot'
                console.error('Erro em bookSlot:', err)
                throw err
            }
        },

        async unbookSlot(slotId) {
            try {
                const response = await api.post(`/api/availability-slots/${slotId}/unbook`)

                const index = this.slots.findIndex(s => s.id === slotId)
                if (index !== -1) {
                    this.slots[index] = response.data
                }

                return response.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Erro ao liberar slot'
                console.error('Erro em unbookSlot:', err)
                throw err
            }
        },

        setFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters }
            this.pagination.current_page = 1
            this.fetchSlots()
        },

        clearFilters() {
            this.filters = {
                service_id: '',
                date: '',
                status: ''
            }
            this.pagination.current_page = 1
            this.fetchSlots()
        },


        async goToPage(page) {
            if (page >= 1 && page <= this.pagination.last_page) {
                this.pagination.current_page = page
                await this.fetchSlots()
            }
        },

        async nextPage() {
            if (this.pagination.current_page < this.pagination.last_page) {
                await this.goToPage(this.pagination.current_page + 1)
            }
        },

        async prevPage() {
            if (this.pagination.current_page > 1) {
                await this.goToPage(this.pagination.current_page - 1)
            }
        }
    }
})