<template>
    <div class="flex h-full">

        <!-- Sidebar: mini calendário -->
        <div class="w-64 border-r border-gray-200 p-4">
            <h3 class="font-bold mb-2">Calendário</h3>
            <FullCalendar ref="miniCalendarRef" :options="miniCalendarOptions" class="w-full mini-calendar" />
        </div>

        <!-- Conteúdo principal -->
        <div class="flex-1 p-4">

            <!-- Toolbar -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                </div>
                <div>
                    <select v-model="currentView" @change="changeView" class="p-1 px-10 border rounded">
                        <option value="dayGridMonth">Mensal</option>
                        <option value="timeGridWeek">Semana</option>
                        <option value="timeGridDay">Dia</option>
                    </select>
                </div>
            </div>

            <!-- Calendário FullCalendar -->
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="border rounded shadow" />
        </div>
    </div>
</template>


<script setup>
import { ref, defineEmits, watch, nextTick } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const availabilityStore = useServiceAvailabilityStore()
const calendarRef = ref(null)
const currentView = ref('timeGridWeek')
const miniCalendarRef = ref(null)
const selectedDate = ref('')

const emit = defineEmits(['slot-click'])

//navegação para calendario
const changeView = () => {
    if (calendarRef.value) {
        calendarRef.value.getApi().changeView(currentView.value)
    }
}

// Clique no evento
const handleEventClick = (info) => {
    const slot = info.event.extendedProps.slot
    emit('slot-click', slot)
}

// Renderização customizada
const renderEventContent = (eventInfo) => {
    const slot = eventInfo.event.extendedProps.slot || {}
    const statusColor = slot.status === 'booked' ? '#EF4444'
        : slot.status === 'blocked' ? '#CA8A04'
            : '#10B981'

    return {
        html: `
      <div style="
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        color: white;
        font-family: system-ui, sans-serif;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
        <div style="font-weight:600; white-space: nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${slot.service?.name || 'Serviço'}
        </div>
        <div style="font-size:11px; opacity:0.9;">
          ${slot.start_time || ''} – ${slot.end_time || ''}
        </div>
        ${slot.client_name ? `<div style="font-size:11px; opacity:0.8;">${slot.client_name}</div>` : ''}
      </div>
    `,
        backgroundColor: statusColor
    }
}


// Opções do calendário
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: currentView.value,
    buttonText: {
        today: 'Hoje',
        month: 'Mensal',
        week: 'Semana',
        day: 'Dia'
    },
    headerToolbar: false,
    locale: 'pt-br',
    nowIndicator: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    selectable: true,
    editable: false,
    eventContent: renderEventContent,
    dayMaxEventRows: 3,
    moreLinkClick: 'popover',
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

            successCallback(events)

        } catch (err) {
            console.error('Erro ao carregar eventos:', err)
            toast.error('Falha ao carregar agenda')
            failureCallback(err)
        }
    }

}

const miniCalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    buttonText: {
        today: 'Hoje',
        month: 'Mensal',
        week: 'Semana',
        day: 'Dia'
    },
    locale: 'pt-br',
    headerToolbar: { left: '', center: 'title', right: 'prev,next' },
    selectable: true,
    dateClick: (info) => {
        selectedDate.value = info.dateStr
        calendarRef.value.getApi().gotoDate(info.dateStr)
        nextTick(() => {
            miniCalendarRef.value.getApi().render()
        })
    },
    dayCellClassNames: (arg) => {
        return arg.dateStr === selectedDate.value ? ['selected-day', 'fc-day-selected'] : []
    },
    dayHeaderContent: (arg) => {
        const map = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
        return { html: map[arg.date.getDay()] }
    },
    dayMaxEventRows: 1,
    showNonCurrentDates: false,
    fixedWeekCount: false
}

watch(selectedDate, () => {
    if (miniCalendarRef.value) {
        miniCalendarRef.value.getApi().render()
    }
})
</script>

<style scoped>
/* Mini calendário compacto */
.mini-calendar ::v-deep(.fc-header-toolbar) {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    font-size: 0.75rem !important;
    margin-bottom: 0.25rem !important;
    padding: 0 0.25rem !important;

}

/* Título do mês capitalizado e centralizado */
.mini-calendar ::v-deep(.fc-toolbar-title) {
    text-transform: capitalize !important;
    font-size: 1rem !important;
    flex: 1;
    text-align: center !important;
    margin-right: 1.15rem !important;
}

/* Botões de navegação à direita do título */
.mini-calendar ::v-deep(.fc-header-toolbar > .fc-toolbar-chunk:first-child) {
    order: 2 !important;
}

.mini-calendar ::v-deep(.fc-toolbar-chunk) {
    display: flex !important;
    align-items: center !important;
    gap: 0.25rem !important;
}

.mini-calendar ::v-deep(.fc-col-header-cell) {
    font-size: 0.60rem !important;
    font-weight: 500 !important;
}

/* Botões da toolbar (setas) */
.mini-calendar ::v-deep(.fc-button) {
    font-size: 0.65rem !important;
    padding: 0.15rem 0.4rem !important;
    min-width: auto !important;
}

/* Remove bordas da tabela, células e cabeçalho */
.mini-calendar ::v-deep(.fc-scrollgrid),
.mini-calendar ::v-deep(.fc-scrollgrid table),
.mini-calendar ::v-deep(.fc-daygrid-day),
.mini-calendar ::v-deep(.fc-col-header-cell),
.mini-calendar ::v-deep(.fc-daygrid-day-frame),
.mini-calendar ::v-deep(.fc-daygrid-day-top) {
    border: none !important;
    padding: 2px !important;
    background-color: transparent !important;
}

/* Diminuir altura das células do calendário */
.mini-calendar ::v-deep(.fc-daygrid-day-frame) {
    height: 1.8rem !important;
}

/* Dias da semana - números menores */
.mini-calendar ::v-deep(.fc-daygrid-day-top) {
    font-size: 0.7rem !important;
}

/* Dia atual (hoje) - azul claro */
.mini-calendar ::v-deep(.fc-day-today) {
    background-color: #5aa2f4 !important;
    color: black !important;
    border-radius: 50% !important;
}

/* Dia selecionado - azul escuro */
.mini-calendar ::v-deep(.selected-day .fc-daygrid-day-number),
.mini-calendar ::v-deep(.fc-day-selected .fc-daygrid-day-number) {
    background-color: #05388a !important;
    color: white !important;
    border-radius: 50% !important;
    padding: 2px 6px !important;
    font-weight: bold !important;
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-width: 1.2rem !important;
    height: 1.2rem !important;
}


</style>
