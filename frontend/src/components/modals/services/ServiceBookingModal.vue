<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
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
                                    <!-- Calendário -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                                        <input v-model="form.date" type="date" :min="today" @change="loadAvailableSlots"
                                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>

                                    <!-- Slots disponíveis -->
                                    <div v-if="availableSlots.length > 0">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                                        <div class="grid grid-cols-3 gap-2">
                                            <button v-for="slot in availableSlots" :key="slot.id" type="button"
                                                @click="selectSlot(slot)" :class="[
                                                    'px-3 py-2 text-sm rounded-md border',
                                                    form.slot_id === slot.id
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                ]">
                                                {{ formatTime(slot.start_time) }}
                                            </button>
                                        </div>
                                    </div>

                                    <div v-else-if="form.date && !loadingSlots" class="text-sm text-gray-500">
                                        Nenhum horário disponível para esta data.
                                    </div>

                                    <!-- Transporte -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Transporte *</label>
                                        <div class="flex space-x-4">
                                            <label class="inline-flex items-center">
                                                <input v-model="form.transport_option" type="radio" value="pickup"
                                                    class="text-blue-600" />
                                                <span class="ml-2">Vou buscar o pet</span>
                                            </label>
                                            <label class="inline-flex items-center">
                                                <input v-model="form.transport_option" type="radio" value="bring"
                                                    class="text-blue-600" />
                                                <span class="ml-2">Levar o pet até vocês</span>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Dados do cliente -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Nome completo
                                                *</label>
                                            <input v-model="form.client_name" type="text" required
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Telefone *</label>
                                            <input v-model="form.client_phone" type="tel" required
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                    </div>

                                    <!-- Dados do pet -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Nome do Pet *</label>
                                            <input v-model="form.pet_name" type="text" required
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Raça</label>
                                            <input v-model="form.pet_breed" type="text"
                                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                    </div>

                                    <!-- Observações -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Observações</label>
                                        <textarea v-model="form.notes" rows="3"
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" :disabled="loading || !isFormValid"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ loading ? 'Agendando...' : 'Confirmar Agendamento' }}
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
import { ref, computed, watch } from 'vue'
import { useAppointmentStore } from '@/stores/appointments'

const props = defineProps({
    show: { type: Boolean, required: true },
    selectedService: { type: Object, default: null }
})

const emit = defineEmits(['close', 'scheduled'])

const appointmentStore = useAppointmentStore()
const loading = ref(false)
const loadingSlots = ref(false)
const availableSlots = ref([])
const today = ref(new Date().toISOString().split('T')[0])

const form = ref({
    service_id: '',
    slot_id: '',
    date: '',
    transport_option: 'pickup',
    client_name: '',
    client_phone: '',
    client_email: '',
    pet_name: '',
    pet_breed: '',
    notes: ''
})

watch(() => props.selectedService, (newService) => {
    if (newService) {
        form.value.service_id = newService.id
    }
})

const isFormValid = computed(() => {
    return form.value.service_id &&
        form.value.slot_id &&
        form.value.date &&
        form.value.client_name &&
        form.value.client_phone &&
        form.value.pet_name
})

const loadAvailableSlots = async () => {
    if (!form.value.date || !props.selectedService) return

    loadingSlots.value = true
    try {
        const response = await fetch(`/api/services/${props.selectedService.id}/available-slots?date=${form.value.date}`)
        const slots = await response.json()
        availableSlots.value = slots
        form.value.slot_id = ''
    } catch (err) {
        console.error('Erro ao carregar slots:', err)
    } finally {
        loadingSlots.value = false
    }
}

const selectSlot = (slot) => {
    form.value.slot_id = slot.id
}

const formatTime = (timeString) => {
    return timeString.substring(0, 5)
}

const submitBooking = async () => {
    loading.value = true
    try {
        await appointmentStore.createAppointment(form.value)
        emit('scheduled')
        emit('close')
    } catch (err) {
        alert('Erro ao agendar serviço')
    } finally {
        loading.value = false
    }
}
</script>