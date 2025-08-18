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
                this.slots = data.map(appt => {
                    const [date, time] = appt.scheduled_at.split(' ')
                    return {
                        date,
                        start_time: time,
                        end_time: time,
                        is_booked: true,
                    }
                })
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

        async fetchFreeSlots(serviceId, startDate, endDate) {
            const { data } = await api.get('/api/availability-slots', {
                params: {
                    service_id: serviceId,
                    start_date: startDate,
                    end_date: endDate
                }
            })
            this.exceptions = data
            return data
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
