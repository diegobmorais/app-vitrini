<template>
    <div class="p-3">
        <div class="flex justify-center items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Sistema de Agenda Inteligente</h1>
        </div>

        <!-- Botão para abrir modal -->
        <div class="flex justify-end mb-4">
            <button @click="openAgendaModal"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
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

const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)

const openAgendaModal = () => {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}

const closeAgendaModal = () => {
    showAgendaModal.value = false
    selectedDateInfo.value = null
}
</script>
