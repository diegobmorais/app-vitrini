<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Disponibilidade de Serviços</h1>
        </div>

        <!-- Criar slots - Formulário compacto -->
        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Criar Horários Disponíveis</h2>

            <div class="grid grid-cols-1 md:grid-cols-7 gap-3">
                <!-- Serviço -->
                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Serviço</label>
                    <select v-model="localCreateForm.service_id"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione</option>
                        <option v-for="service in serviceStore.services" :key="service.id" :value="service.id">
                            {{ service.name }}
                        </option>
                    </select>
                </div>

                <!-- Data -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Data</label>
                    <input v-model="localCreateForm.date" type="date" :min="today"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Hora Início -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Início</label>
                    <input v-model="localCreateForm.start_time" type="time"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Hora Fim -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Fim</label>
                    <input v-model="localCreateForm.end_time" type="time"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Modo</label>
                    <select v-model="localCreateForm.mode"
                        class="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="single">Horário Unico</option>
                        <option value="multiple">Múltiplos Horários</option>
                    </select>
                </div>
                <div v-if="localCreateForm.mode === 'multiple'">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Intervalo (min)</label>
                    <select v-model="localCreateForm.interval_minutes"
                        class="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>
                <div>
                    <button @click="handleCreateSlots" :disabled="!isLocalFormValid"
                        class="w-full px-2 py-2 mt-5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition">
                        Criar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Lista de slots -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading -->
        <div v-if="availabilityStore.loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Carregando slots...</p>
        </div>

        <!-- Erro -->
        <div v-else-if="availabilityStore.error" class="p-8 text-center">
            <div class="text-red-500">
                <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="mt-2 font-medium">{{ availabilityStore.error }}</p>
                <button @click="availabilityStore.fetchSlots()"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Tentar novamente
                </button>
            </div>
        </div>

        <!-- Tabela -->
        <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="slot in availabilityStore.slots" :key="slot.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ getServiceName(slot.service_id) }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {{ formatDate(slot.date) }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {{ slot.start_time }} - {{ slot.end_time }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span :class="[
                                'px-2 py-1 text-xs rounded-full font-medium',
                                slot.is_booked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            ]">
                                {{ slot.is_booked ? 'Reservado' : 'Disponível' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <button v-if="!slot.is_booked" @click="handleBookSlot(slot.id)"
                                class="text-blue-600 hover:text-blue-900 mr-3 transition">
                                Reservar
                            </button>
                            <button v-else @click="handleUnbookSlot(slot.id)"
                                class="text-green-600 hover:text-green-900 transition">
                                Liberar
                            </button>
                        </td>
                    </tr>
                    <tr v-if="availabilityStore.slots.length === 0">
                        <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">
                            Nenhum slot de disponibilidade encontrado
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginação -->
            <div v-if="availabilityStore.pagination.last_page > 1" class="bg-white px-4 py-3 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Mostrando
                        <span class="font-medium">{{ availabilityStore.slots.length }}</span> slots
                    </div>
                    <div class="flex space-x-2">
                        <button @click="availabilityStore.prevPage()"
                            :disabled="availabilityStore.pagination.current_page === 1"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                            Anterior
                        </button>
                        <span class="px-3 py-1 text-sm">
                            Página {{ availabilityStore.pagination.current_page }} de {{
                                availabilityStore.pagination.last_page }}
                        </span>
                        <button @click="availabilityStore.nextPage()"
                            :disabled="availabilityStore.pagination.current_page === availabilityStore.pagination.last_page"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useServiceAvailabilityStore } from '@/store/modules/useServiceAvailabilityStore'
import { useServiceStore } from '@/store/modules/useServiceStore'
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const serviceStore = useServiceStore()
const availabilityStore = useServiceAvailabilityStore()

const today = ref(new Date().toISOString().split('T')[0])
const localCreateForm = ref({
    service_id: '',
    date: '',
    start_time: '',
    end_time: '',
    interval_minutes: 30
})

const isLocalFormValid = computed(() => {
    return localCreateForm.value.service_id &&
        localCreateForm.value.date &&
        localCreateForm.value.start_time &&
        localCreateForm.value.end_time
})

const getServiceName = (serviceId) => {
    const service = serviceStore.services.find(s => s.id === serviceId)
    return service ? service.name : 'Serviço não encontrado'
}

const formatDate = (dateString) => {
    if (!dateString) return '–'
    return new Date(dateString).toLocaleDateString('pt-BR')
}

const handleCreateSlots = async () => {
    if (!isLocalFormValid.value) return

    try {
        await availabilityStore.createSlots(localCreateForm.value)
        localCreateForm.value = {
            service_id: '',
            date: '',
            start_time: '',
            end_time: '',
            interval_minutes: 30
        }

        toast.success('Slots criados com sucesso!')
    } catch (err) {
        toast.error('Erro ao criar slots')
    }
}

const handleBookSlot = async (slotId) => {
    if (confirm('Tem certeza que deseja reservar este slot?')) {
        try {
            await availabilityStore.bookSlot(slotId)
            alert('Slot reservado com sucesso!')
        } catch (err) {
            alert('Erro ao reservar slot')
        }
    }
}

const handleUnbookSlot = async (slotId) => {
    if (confirm('Tem certeza que deseja liberar este slot?')) {
        try {
            await availabilityStore.unbookSlot(slotId)
            alert('Slot liberado com sucesso!')
        } catch (err) {
            alert('Erro ao liberar slot')
        }
    }
}

onMounted(async () => {
    await Promise.all([
        serviceStore.fetchServices(),
        availabilityStore.fetchSlots()
    ])
})
</script>