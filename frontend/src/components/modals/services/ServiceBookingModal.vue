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
                                    <div>
                                        <div class="space-y-4">
                                            <!-- seleciona a data -->
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Datas
                                                    Disponíveis *</label>
                                                <div v-if="availabilityStore.slots === 0">


                                                    <select v-model="selectedDate"
                                                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option value="">Selecione uma data</option>
                                                        <option v-for="day in availabilityStore.slots" :key="day.date"
                                                            :value="day.date">
                                                            {{ formatDate(day.date) }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-else>
                                                    <p class="text-sm text-gray-500">Nenhuma data disponível.</p>
                                                </div>
                                            </div>

                                            <!-- horarios -->
                                            <div v-if="selectedDate">
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Horários
                                                    Disponíveis *</label>

                                                <div
                                                    class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-300 rounded-md shadow-sm">
                                                    <button type="button" v-for="(time, index) in availableTimes"
                                                        :key="index" @click="selectTime(time)" :class="[
                                                            'px-4 py-2 rounded-lg text-center font-medium transition-all duration-200',
                                                            selectedTime === time
                                                                ? 'bg-blue-600 text-white shadow-lg'
                                                                : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                                                        ]">
                                                        {{ time }}
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- exibe msg de seleção -->
                                            <div v-if="selectedTime" class="text-blue-500 font-semibold mt-3">
                                                Selecionado: {{ formatDate(selectedDate) }} - {{ selectedTime }}hs
                                            </div>
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
import { useAppointmentStore } from '@/store/modules/useAppointmentStore'
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useServiceAvailabilityStore } from '@/store/modules/useServiceAvailabilityStore'
import { ref, computed, onMounted, watch } from 'vue'
import { formatDate, formatTime } from '@/utils/date'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    selectedService: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'scheduled'])

const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const availabilityStore = useServiceAvailabilityStore()

// Estados
const selectedDate = ref("")
const selectedTime = ref("")
const isSubmitting = ref(false)

const form = ref({
    pet_name: '',
    transport_option: 'pickup',
    notes: ''
})

const availableTimes = computed(() => {
    const day = availabilityStore.slots.find(d => d.date === selectedDate.value)
    return day ? day.slots.map(slot => slot.start) : []
})

const selectTime = (time) => {
    selectedTime.value = time
}

const submitBooking = async () => {

    isSubmitting.value = true
    console.log('aqui 2');
    try {
        const payload = {
            service_id: props.selectedService.id,
            start_date: selectedDate.value,
            start_time: selectedTime.value,
            pet_name: form.value.pet_name,
            transport_option: form.value.transport_option,
            notes: form.value.notes
        }
        console.log('payload', payload);
        await appointmentStore.createAppointment(payload)
        emit('scheduled')
        emit('close')
    } catch (err) {
        alert('Erro ao agendar serviço')
    } finally {
        isSubmitting.value = false
    }
}

// Carrega slots ao abrir o modal
onMounted(async () => {
    if (props.selectedService.id) {
        await availabilityStore.fetchAvailableSlotsByService(
            {
                service_id: props.selectedService.id,
                start_date: new Date().toISOString().split('T')[0]
            }
        )
    }
})
</script>