<template>
    <div class="p-3">
        <div class="flex justify-center items-center mb-2">
            <h1 class="text-2xl font-bold text-gray-900">Sistema de Agenda Inteligente</h1>
        </div>
        <!-- Formulário de criação de regras / exceções -->
        <div class="bg-white p-6 rounded-lg shadow mb-2">
            <div>
                <div class="flex justify-end mb-4">
                    <button @click="openAgendaModal"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        Abrir Agenda
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div>
        <!-- Calendário FullCalendar -->
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Agenda de Serviços</h1>
            </div>

            <!-- Calendário FullCalendar -->
            <div class="bg-white rounded-lg shadow p-4">
                <FullCalendar ref="calendarRef" :options="calendarOptions" />
            </div>
        </div>
    </div>
    <ServiceAgendaModal v-if="showAgendaModal" :show="showAgendaModal" :initial-data="selectedDateInfo"
        @close="closeAgendaModal" @saved="handleCreate" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useServiceStore } from '@/store/modules/useServiceStore'
import { useServiceAvailabilityStore } from '@/store/modules/useServiceAvailabilityStore'
import { useToast } from 'vue-toastification'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ServiceAgendaModal from '@/components/modals/services/ServiceAgendaModal.vue'

const toast = useToast()
const serviceStore = useServiceStore()
const availabilityStore = useServiceAvailabilityStore()
const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)
const calendarRef = ref(null)

//função para atualizar eventos quando os serviços selecionados mudam
const handleEventClick = async (info) => {
    const slot = info.event.extendedProps.slot
    if (slot.is_booked) return
    if (!confirm(`Deseja reservar ${slot.date} ${slot.start_time}?`)) return

    try {
        await availabilityStore.bookSlot(slot.id)
        toast.success('Horário reservado com sucesso!')
    } catch (err) {
        toast.error('Erro ao reservar horário')
    }
}
// Funções de renderização personalizada
const renderMonthEvent = (eventInfo) => {
    const slot = eventInfo.event.extendedProps.slot    
    console.log('Rendering month event for slot:', slot);  
    return {
        html: `
      <div class="fc-event-month" style="
        background-color: ${slot.status === 'open' ? '#EF4444' : '#10B981'};
        color: white;
        border-radius: 4px;
        padding: 2px 4px;
        font-size: 11px;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      ">
        ${slot.status === 'open' ? '🔒' : '🔓'} 
        ${slot.service?.name || 'Serviço'}
      </div>
    `
    }
}
// Configurações do FullCalendar
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    views: {
        dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
            dayHeaderFormat: { weekday: 'short' },
            displayEventTime: false,
            eventContent: renderMonthEvent,
        }      
    },
    events: (fetchInfo, successCallback, failureCallback) => {
        const start = fetchInfo.startStr.split('T')[0]
        const end = fetchInfo.endStr.split('T')[0]

        availabilityStore.fetchAvailableSlots({
            start_date: start,
            end_date: end,
            service_ids: availabilityStore.selectedServiceIds || []
        })
            .then(() => {
                const formattedEvents = availabilityStore.slots.map(slot => ({
                    ...slot,
                    backgroundColor: slot.is_booked ? '#EF4444' : '#10B981',
                    borderColor: slot.is_booked ? '#EF4444' : '#10B981',
                    textColor: '#FFFFFF',
                    title: slot.is_booked  ? 'Reservado' : 'Disponível'
                }))
                console.log('formattedEvents', formattedEvents);
                successCallback(formattedEvents)
            })
            .catch((err) => {
                failureCallback(err)
            })
    },
    eventClick: handleEventClick,
    eventClassNames: (info) => {
        const slot = info.event.extendedProps.slot
        return [
            'rounded-lg',
            'shadow-sm',
            'border',
            slot.is_booked ? 'bg-red-500 text-white border-red-500' : 'bg-green-500 text-white border-green-500'
        ]
    },
    height: 'auto',
    editable: false,
    selectable: true,
    locale: 'pt-br',
    buttonText: {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista',

    }
}

//criação de regras e exceções
const handleCreate = async (formData) => {
    try {
        if (formData.value.mode === 'extra') {
            await availabilityStore.createException({
                ...formData.value,
                type: 'extra'
            })
        } else if (formData.value.mode === 'block') {
            await availabilityStore.createException({
                ...formData.value,
                type: 'block'
            })
        } else {
            await availabilityStore.createRule({
                service_id: formData.value.service_id,
                day_of_week: new Date(formData.value.date).getDay(),
                start_time: formData.value.start_time,
                end_time: formData.value.end_time,
                slot_duration: formData.value.interval_minutes,
                valid_from: formData.value.date
            })
        }
        toast.success('Configuração criada com sucesso!')

        if (calendarRef.value) {
            const calendarApi = calendarRef.value.getApi()
            calendarApi.refetchEvents()
        }

        formData.value = {
            service_id: '',
            date: '',
            start_time: '',
            end_time: '',
            mode: 'single',
            interval_minutes: 30
        }

    } catch (err) {
        toast.error('Erro ao criar configuração')
    }
}
function openAgendaModal() {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}
function closeAgendaModal() {
    showAgendaModal.value = false
    selectedDateInfo.value = null
}

// Carregar serviços e slots iniciais
onMounted(async () => {
    await serviceStore.fetchServices()

    const todayStr = new Date().toISOString().split('T')[0]
    try {
        await availabilityStore.fetchAvailableSlots({
            start_date: todayStr,
            end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // +7 dias
            service_ids: availabilityStore.selectedServiceIds || []
        })

        if (calendarRef.value) {
            const calendarApi = calendarRef.value.getApi()
            calendarApi.refetchEvents()
        }
    } catch (err) {
        toast.error('Erro ao carregar slots iniciais')
    }
})

</script>
<style scoped>
/* Estilos personalizados para o calendário */
.fc-event-month,
.fc-event-month:hover,

/* Melhora a aparência dos dias do mês */
.fc-daygrid-day-frame {
    min-height: 80px;
}

.fc-daygrid-day-events {
    margin-top: 2px;
}

.fc-daygrid-event {
    margin-bottom: 1px;
}

/* Melhora a aparência dos cabeçalhos */
.fc-col-header-cell {
    background-color: #f9fafb;
    padding: 8px 4px;
}

.fc-daygrid-day-number {
    font-size: 14px;
    font-weight: 600;
}

/* Melhora a aparência do toolbar */
.fc-toolbar-chunk {
    display: flex;
    align-items: center;
    gap: 8px;
}

.fc-button {
    padding: 6px 12px;
    font-size: 14px;
}

/* Responsividade */
@media (max-width: 768px) {
    .fc-toolbar.fc-header-toolbar {
        flex-direction: column;
        gap: 8px;
    }

    .fc-toolbar-chunk {
        justify-content: center;
    }
}
</style>
