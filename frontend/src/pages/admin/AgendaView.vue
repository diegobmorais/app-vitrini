<template>
    <div class="p-3">
        <div class="flex justify-center items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Sistema de Agenda Inteligente</h1>
        </div>

        <!-- Botão para abrir modal -->
        <div class="flex justify-end mb-4">
            <button @click="createAgendaModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Abrir Agenda
            </button>
        </div>

        <!-- Calendário -->
        <CalendarWrapper @openModal="openAgendaModal" />

        <!-- Modal -->
        <ServiceAgendaModal v-if="showAgendaModal" :show="showAgendaModal" :initial-data="selectedDateInfo"
            @close="closeAgendaModal" @saved="handleCreate" />
    </div>
</template>

<script setup>
import { ref } from "vue"
import CalendarWrapper from "@/components/calendar/CalendarWrapper.vue"
import ServiceAgendaModal from "@/components/modals/services/ServiceAgendaModal.vue"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)
const useAvailabilityStore = useServiceAvailabilityStore()

const createAgendaModal = () => {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}

const closeAgendaModal = () => {
    showAgendaModal.value = false
    selectedDateInfo.value = null
}

const handleCreate = async (data) => {
    try {
        const response = await useAvailabilityStore.createTimeSlots(data)
        if (response.status === 'warning') {
            toast.warning(response.message); 
        } else if (response.status === 'success') {
            toast.success(response.message);
            closeAgendaModal();
        } else {
            toast.error(response.message);
        }
    } catch (error) {
        console.error('Erro ao criar agenda', error)
    }
}
</script>
