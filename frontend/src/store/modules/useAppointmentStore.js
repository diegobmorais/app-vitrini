import { defineStore } from 'pinia'
import api from '@/main' 

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      status: '',
      date: '',
      service_id: ''
    },
    loading: false,
    error: null,
    metrics: {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }
  }),

  getters: {

  },

  actions: {  
    async fetchAppointments() {
      this.loading = true
      this.error = null
      
      try {
        const params = {
          page: this.pagination.current_page,
          status: this.filters.status || undefined,
          date: this.filters.date || undefined,
          service_id: this.filters.service_id || undefined
        }

        const response = await api.get('/api/appointments', { params })

        this.appointments = response.data.data || []
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        }        
 
        if (response.data.metrics) {
          this.metrics = response.data.metrics
        }

      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar agendamentos'
        console.error('Erro em fetchAppointments:', err)
      } finally {
        this.loading = false
      }
    },

    async createAppointment(appointmentData) {
      try {
        const response = await api.post('/api/appointments', appointmentData)
        
         await this.fetchAppointments()
        
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao criar agendamento'
        console.error('Erro em createAppointment:', err)
        throw err 
      }
    },

    async updateStatus(appointmentId, status, statusNotes = null) {
      try {
        const response = await api.patch(`/api/appointments/${appointmentId}/status`, {
          status,
          status_notes: statusNotes
        })

        const index = this.appointments.findIndex(a => a.id === appointmentId)
        if (index !== -1) {
          this.appointments[index] = response.data
        }

           if (response.data.metrics) {
          this.metrics = response.data.metrics
        }

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar status'
        console.error('Erro em updateStatus:', err)
        throw err
      }
    },

    async goToPage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page
        await this.fetchAppointments()
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
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      this.pagination.current_page = 1
      this.fetchAppointments()
    },

    clearFilters() {
      this.filters = {
        status: '',
        date: '',
        service_id: ''
      }
      this.pagination.current_page = 1
      this.fetchAppointments()
    }
  }
})