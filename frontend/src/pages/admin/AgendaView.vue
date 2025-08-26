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
        <CalendarWrapper  @slot-click="handleSlotClick" />

        <!-- Dropdown de Ações -->
        <SlotActionsDropdown v-if="showDropdown" :slot="selectedSlot" :x="dropdownPosition.x" :y="dropdownPosition.y"
            @book="openAdminBookModal" @block="blockSelectedSlot" @unblock="unblockSelectedSlot"
            @cancel="showDropdown = false" />

        <!-- Modal de geerenciamento -->
        <ServiceAgendaModal v-if="showAgendaModal" :show="showAgendaModal" :initial-data="selectedDateInfo"
            @close="closeAgendaModal" @saved="handleCreate" />
    </div>
</template>

<script setup>
import { ref } from "vue"
import CalendarWrapper from "@/components/calendar/CalendarWrapper.vue"
import ServiceAgendaModal from "@/components/modals/services/ServiceAgendaModal.vue"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import SlotActionsDropdown from "@/components/ui/SlotActionsDropdown.vue"
import { useToast } from "vue-toastification"

const toast = useToast()
const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)
const serviceAvailabilityStore = useServiceAvailabilityStore()
const selectedSlot = ref(null)
const showDropdown = ref(false)
const dropdownPosition = ref({ x: 0, y: 0 })

const createAgendaModal = () => {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}

const closeAgendaModal = () => {
    showAgendaModal.value = false
    selectedDateInfo.value = null
}

const handleSlotClick = (slot) => {
    selectedSlot.value = slot
    dropdownPosition.value = { x: 0, y: 0 }
    showDropdown.value = true
}

const blockSelectedSlot = async () => {
    try {
        await serviceAvailabilityStore.blockSlot(selectedSlot.value.id)
        toast.success("Horário bloqueado!")
        showDropdown.value = false
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao bloquear horário, verifique se já não está reservado")
    }
}

const unblockSelectedSlot = async () => {
    try {
        await serviceAvailabilityStore.unblockSlot(selectedSlot.value.id)
        toast.success("Horário liberado!")
        showDropdown.value = false
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao liberar horário")
    }
}

const handleCreate = async (data) => {
    try {
        const response = await serviceAvailabilityStore.createTimeSlots(data)
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
