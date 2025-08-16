import { defineStore } from 'pinia'
import api from '@/main'

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    async createAppointment(appointmentData) {
      try {
        const response = await api.post('/api/appointments', appointmentData)
  
        this.appointments.unshift(response.data)

        return response.data
      } catch (error) {
        console.error('Erro ao criar agendamento:', error)
        throw error
      }
    },

    async fetchAppointments(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/api/appointments', { params })
        this.appointments = response.data
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
        this.error = 'Erro ao carregar agendamentos'
      } finally {
        this.loading = false
      }
    },

    async updateAppointmentStatus(id, status) {
      try {
        const response = await api.patch(`/api/appointments/${id}/status`, { status })
   
        const index = this.appointments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.appointments[index] = response.data
        }

        return response.data
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
        throw error
      }
    }
  }
})