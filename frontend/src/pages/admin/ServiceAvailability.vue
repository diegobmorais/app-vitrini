<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Disponibilidade de Serviços</h1>
        </div>

        <!-- Formulário de criação de regras / exceções -->
        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Criar Configuração de Disponibilidade</h2>

            <div class="grid grid-cols-1 md:grid-cols-7 gap-3">
                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Serviço</label>
                    <select v-model="localForm.service_id"
                        class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione</option>
                        <option v-for="service in serviceStore.services" :key="service.id" :value="service.id">{{
                            service.name }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" v-model="localForm.date" :min="today"
                        class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Início</label>
                    <input type="time" v-model="localForm.start_time"
                        class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Fim</label>
                    <input type="time" v-model="localForm.end_time"
                        class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Modo</label>
                    <select v-model="localForm.mode"
                        class="w-full border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="single">Exceção única</option>
                        <option value="recurring">Regra recorrente</option>
                    </select>
                </div>

                <div v-if="localForm.mode === 'recurring'">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Intervalo (min)</label>
                    <select v-model="localForm.interval_minutes"
                        class="w-full border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>

                <div>
                    <button @click="handleCreate" :disabled="!isFormValid"
                        class="w-full px-2 py-2 mt-5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition">
                        Criar
                    </button>
                </div>
            </div>
        </div>

        <!-- Calendário FullCalendar -->
        <div class="bg-white rounded-lg shadow p-4">
            <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
    </div>
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

const toast = useToast()
const serviceStore = useServiceStore()
const availabilityStore = useServiceAvailabilityStore()

const today = ref(new Date().toISOString().split('T')[0])

const localForm = ref({
    service_id: '',
    date: '',
    start_time: '',
    end_time: '',
    mode: 'single',
    interval_minutes: 30
})

const isFormValid = computed(() => {
    return localForm.value.service_id &&
        localForm.value.date &&
        localForm.value.start_time &&
        localForm.value.end_time
})

// FullCalendar setup
const calendarRef = ref(null)

// Transform slots em eventos para FullCalendar
const calendarEvents = ref([])

// Reservar horário
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
    await availabilityStore.fetchAvailableSlots('', start, end)
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
    events: calendarEvents.value,
    eventClick: handleEventClick,
    datesSet: handleDatesSet,
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
const handleCreate = async () => {
    if (!isFormValid.value) return

    try {
        if (localForm.value.mode === 'single') {
            await availabilityStore.createException({
                service_id: localForm.value.service_id,
                date: localForm.value.date,
                start_time: localForm.value.start_time,
                end_time: localForm.value.end_time,
                type: 'extra'
            })
        } else {
            await availabilityStore.createRule({
                service_id: localForm.value.service_id,
                day_of_week: new Date(localForm.value.date).getDay(),
                start_time: localForm.value.start_time,
                end_time: localForm.value.end_time,
                slot_duration: localForm.value.interval_minutes,
                valid_from: localForm.value.date
            })
        }

        toast.success('Configuração criada com sucesso!')

        if (localForm.value.service_id) {
            await availabilityStore.fetchAvailableSlots(localForm.value.service_id, today.value, today.value)
        }
        localForm.value = { service_id: '', date: '', start_time: '', end_time: '', mode: 'single', interval_minutes: 30 }
    } catch (err) {
        toast.error('Erro ao criar configuração')
    }
}

// Carregar serviços e slots iniciais
onMounted(async () => {
    await serviceStore.fetchServices()
    await availabilityStore.fetchAvailableSlots('', today.value, today.value)
})
</script>
