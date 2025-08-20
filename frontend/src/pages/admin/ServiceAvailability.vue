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
        <div class="bg-white rounded-lg shadow p-4">
            <FullCalendar ref="calendarRef" :options="calendarOptions" />
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

const today = ref(new Date().toISOString().split('T')[0])

const calendarRef = ref(null)
const calendarEvents = ref([])

const handleEventClick = async (info) => {
    const slot = info.event.extendedProps.slot
    if (slot.is_booked) return
    if (!confirm(`Deseja reservar ${slot.date} ${slot.start_time}?`)) return

    try {
        await availabilityStore.bookSlot(`${slot.date} ${slot.start_time}`, 1, slot.service_id, 'Pet')
        toast.success('Horário reservado com sucesso!')
    } catch (err) {
        toast.error('Erro ao reservar horário')
    }
}

const handleDatesSet = async (arg) => {
    const start = arg.startStr.split('T')[0]
    const end = arg.endStr.split('T')[0]
    await availabilityStore.fetchAvailableSlots({
        start_date: start,
        end_date: end,
        service_ids: availabilityStore.selectedServiceIds
    })
}

const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    events: () => availabilityStore.slots,
    eventClick: handleEventClick,
    datesSet: handleDatesSet,
    eventClassNames: (info) => [`svc-${info.event.extendedProps.service_id}`],
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

watch(() => availabilityStore.slots, (newEvents) => {
    if (calendarRef.value) {
        const calendarApi = calendarRef.value.getApi()
        calendarApi.removeAllEvents()
        calendarApi.addEventSource(newEvents)
    }
})

// Criar regra ou exceção
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

        const api = calendarRef.value.getApi()
        const range = api.view.activeStart.toISOString().slice(0, 10)
        const rangeEnd = api.view.activeEnd.toISOString().slice(0, 10)

        await availabilityStore.fetchAvailableSlots({
            start_date: range,
            end_date: rangeEnd,
            service_ids: availabilityStore.selectedServiceIds
        })
        formData.value = { service_id: '', date: '', start_time: '', end_time: '', mode: 'single', interval_minutes: 30 }
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
    await availabilityStore.fetchAvailableSlots('', today.value, today.value)
})
</script>
