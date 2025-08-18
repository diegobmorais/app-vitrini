<!-- components/modals/ServiceBookingModal.vue -->
<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Overlay -->
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75" @click="$emit('close')"></div>
            </div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form @submit.prevent="submitBooking">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900">
                                    Agendar Serviço
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    {{ selectedService?.name }}
                                </p>

                                <div class="mt-4 space-y-4">
                                    <!-- Dados do cliente (já logado) -->
                                    <div class="bg-gray-50 p-3 rounded-md">
                                        <p class="text-sm font-medium old text-gray-700">
                                            Cliente: {{ authStore.getUser.name }}
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            {{ authStore.getUser.email }}
                                        </p>
                                    </div>

                                    <!-- Pet -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Nome do seu Pet
                                            *</label>
                                        <input type="text" v-model="form.pet_name" required
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        </input>
                                    </div>

                                    <!-- Data e Hora -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                                            <select v-model="form.date" required
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                <option value="" disabled>Selecione uma data</option>
                                                <option v-for="date in availableTimes" :key="date" :value="date.date">
                                                    {{ date.date }}
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Horário
                                                *</label>
                                            <select v-model="form.slot_id" required
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                <option value="" disabled>Horários Disponíveis</option>
                                                <option v-for="slot in availableTimes" :key="slot.id" :value="slot.id">
                                                    {{ slot.start_time }} - {{ slot.end_time }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Transporte -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Transporte</label>
                                        <div class="mt-5 space-x-3">
                                            <label class="inline-flex items-center">
                                                <input v-model="form.transport" type="radio" value="pickup"
                                                    class="text-blue-600" />
                                                <span class="ml-2">Eu mesmo levarei</span>
                                            </label>
                                            <label class="inline-flex items-center">
                                                <input v-model="form.transport" type="radio" value="delivery"
                                                    class="text-blue-600" />
                                                <span class="ml-2">Quero que busquem</span>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Observações -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                        <textarea v-model="form.notes" rows="3"
                                            placeholder="Alguma informação adicional sobre o serviço?"
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" :disabled="isSubmitting"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ isSubmitting ? 'Agendando...' : 'Confirmar Agendamento' }}
                        </button>
                        <button type="button" @click="$emit('close')"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useAppointmentStore } from '@/store/modules/useAppointmentStore'
import { useServiceAvailabilityStore } from '@/store/modules/useServiceAvailabilityStore'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    selectedService: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'scheduled'])

const toast = useToast()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const availableTimesStore = useServiceAvailabilityStore()

const form = ref({
    slot_id: '',
    pet_name: '',
    date: '',
    time: '',
    transport: 'pickup',
    notes: ''
})

const isSubmitting = ref(false)
const slots = ref([])
const availableTimes = ref([])

const submitBooking = async () => {
    if (!props.selectedService) return

    isSubmitting.value = true

    try {
        const selectedSlot = availableTimes.value.find(s => s.id === form.value.slot_id)

        const payload = {
            slot_id: form.value.slot_id,
            service_id: props.selectedService.id,
            pet_name: form.value.pet_name,
            scheduled_at: selectedSlot
                ? `${selectedSlot.date} ${selectedSlot.start_time}`
                : null,
            transport_option: form.value.transport,
            notes: form.value.notes
        }
        await appointmentStore.createAppointment(payload)

        emit('scheduled')

        emit('close')

    } catch (error) {
        toast.error('Ocorreu um erro ao agendar o serviço. Por favor, tente novamente.', error)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(async () => {
    if (!props.selectedService) return

    const startDate = dayjs().format('YYYY-MM-DD')
    const endDate = dayjs().add(7, 'day').format('YYYY-MM-DD')

    slots.value = await availableTimesStore.fetchFreeSlots(
        props.selectedService.id,
        startDate,
        endDate
    )

    availableTimes.value = (Array.isArray(slots.value) ? slots.value : [])
        .map((s, index) => ({          
            date: dayjs(s).format('YYYY-MM-DD'),
            start_time: dayjs(s).format('HH:mm'),
            end_time: dayjs(s).add(30, 'minute').format('HH:mm')
        }))
})
</script>