<template>
    <div class="p-6 bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Agenda de Serviços</h2>
        </div>
        <!-- Calendário -->
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const availabilityStore = useServiceAvailabilityStore()
const calendarRef = ref(null)

const emit = defineEmits(['slot-click'])

// Clique no evento
const handleEventClick = (info) => {
    const slot = info.event.extendedProps.slot
    emit('slot-click', slot)
}

// Renderização customizada
const renderEventContent = (eventInfo) => {
    const slot = eventInfo.event.extendedProps.slot
    const statusColor = slot.status === 'booked' ? '#EF4444' :
        slot.status === 'blocked' ? '#CA8A04' : '#10B981'

    return {
        html: `
      <div style="
        background-color: ${statusColor};
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 12px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: system-ui;
      ">
        <strong>${slot.service?.name || 'Serviço'}</strong>
        <span>${slot.start_time?.slice(0, 5)} - ${slot.end_time?.slice(0, 5)}</span>
      </div>
    `
    }
}

// Opções do calendário
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    headerToolbar: {
        left: "prev,next,today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    buttonText: {
        today: "Hoje",
        month: "Mensal",
        week: "Semana",
        day: "Dia"
    },
    locale: "pt-br",
    height: "auto",
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    editable: false,
    selectable: true,
    eventClick: handleEventClick,
    eventContent: renderEventContent,
    events: async (fetchInfo, successCallback, failureCallback) => {
        try {
            const start_date = fetchInfo.startStr.split('T')[0]
            const end_date = fetchInfo.endStr.split('T')[0]
      
            const events = await availabilityStore.fetchAvailableSlots({
                start_date,
                end_date,
                service_ids: availabilityStore.selectedServiceIds || []
            })

            console.log('[events] Eventos recebidos (prontos):', events)
  
            successCallback(events)

        } catch (err) {
            console.error('Erro ao carregar eventos:', err)
            toast.error('Falha ao carregar agenda')
            failureCallback(err)
        }
    }
}
</script>
