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
        <CalendarWrapper ref="calendarRef" @slot-click="handleSlotClick" />

        <!-- Dropdown de Ações -->
        <SlotActionsDropdown v-if="showDropdown" :slot="selectedSlot" :x="dropdownPosition.x" :y="dropdownPosition.y"
            @book="openBookingModal" @block="blockSelectedSlot" @unblock="unblockSelectedSlot"
            @cancel="showDropdown = false" />

        <!-- Modal de geerenciamento -->
        <ServiceAgendaModal v-if="showAgendaModal" :show="showAgendaModal" @close="showAgendaModal = false"
            @saved="handleCreate" :calendar-ref="calendarRef" />

        <!-- Modal para agendar horario pelo admin -->
        <AdminBookSlotModal v-if="showBookingModal" :show="showBookingModal" :slot-data="selectedSlot"
            @close="showBookingModal = false" @saved="handleBookingCreate" />
    </div>
</template>

<script setup>
import { ref } from "vue"
import CalendarWrapper from "@/components/calendar/CalendarWrapper.vue"
import ServiceAgendaModal from "@/components/modals/services/ServiceAgendaModal.vue"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import SlotActionsDropdown from "@/components/ui/SlotActionsDropdown.vue"
import { useToast } from "vue-toastification"
import AdminBookSlotModal from "@/components/modals/settings-modals/AdminBookSlotModal.vue"



const toast = useToast()
const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)
const serviceAvailabilityStore = useServiceAvailabilityStore()
const selectedSlot = ref(null)
const showDropdown = ref(false)
const dropdownPosition = ref({ x: 0, y: 0 })
const calendarRef = ref(null);
const showBookingModal = ref(false)


const openBookingModal = () => {
    showBookingModal.value = true
    showDropdown.value = false
}

const createAgendaModal = () => {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}

const handleSlotClick = ({ slot, x, y }) => {
    selectedSlot.value = slot
    dropdownPosition.value = { x, y }
    showDropdown.value = true
}

const handleBookingCreate = () => {
    selectedDateInfo.value = {
        service_id: selectedSlot.value.service.id,
        pet_name: '',
        notes: '',
        transport_option: 'none',
    }
    showBookingModal.value = true
    showDropdown.value = false
}

const blockSelectedSlot = async () => {
    try {
        await serviceAvailabilityStore.blockSlot(selectedSlot.value.id)
        toast.success("Horário bloqueado!")
        showDropdown.value = false
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao bloquear horário, verifique se já não está reservado")
        console.log('err', err);

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
