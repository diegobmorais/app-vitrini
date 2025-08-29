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

        <!-- Modal de geerenciamento -->
        <ServiceAgendaModal v-if="showAgendaModal" :show="showAgendaModal" @close="showAgendaModal = false"
            @saved="handleCreate" :calendar-ref="calendarRef" />

        <!-- Modal para agendar horario pelo admin -->
        <AdminBookSlotModal v-model:show="showBookingModal" :slot-data="selectedSlot" @saved="handleBookingCreate" />

        <!-- Modal para ver detalhes do slot -->
        <CalendarServiceModal v-if="showCalendarServiceModal" :show="showCalendarServiceModal"
            :service="agendaModalData.service" :date="agendaModalData.date" :slots="agendaModalData.slots"
            @close="showCalendarServiceModal = false" @book="openBookingModal" @block="blockSelectedSlot"
            @unblock="unblockSelectedSlot" />
    </div>
</template>

<script setup>
import { ref } from "vue"
import CalendarWrapper from "@/components/calendar/CalendarWrapper.vue"
import ServiceAgendaModal from "@/components/modals/services/ServiceAgendaModal.vue"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"
import AdminBookSlotModal from "@/components/modals/settings-modals/AdminBookSlotModal.vue"
import CalendarServiceModal from "@/components/modals/calendar/CalendarServiceModal.vue"


const toast = useToast()
const showAgendaModal = ref(false)
const selectedDateInfo = ref(null)
const serviceAvailabilityStore = useServiceAvailabilityStore()
const selectedSlot = ref(null)
const calendarRef = ref(null);
const showBookingModal = ref(false)
const showCalendarServiceModal = ref(false)
const agendaModalData = ref({
    service: null,
    date: null,
    slots: []
})

const openBookingModal = (slot) => {
    selectedSlot.value = slot;
    showBookingModal.value = true
}

const createAgendaModal = () => {
    showAgendaModal.value = true
    selectedDateInfo.value = null
}

const handleSlotClick = (data) => {
    selectedSlot.value = data.slots[0];
    showCalendarServiceModal.value = true;

    agendaModalData.value = {
        service: data.service,
        date: data.date,
        slots: data.slots
    };
};

const handleBookingCreate = () => {
    calendarRef.value.getApi().refetchEvents()
    toast.success("Horário agendado com sucesso!")
    showCalendarServiceModal.value = false
}

const blockSelectedSlot = async (slot) => {
    try {
        await serviceAvailabilityStore.blockSlot(slot.slot_id)
        toast.success("Horário bloqueado!")

        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao bloquear horário, verifique se já não está reservado")

    }
}
const loadSlots = async () => {
    const slots = await serviceAvailabilityStore.fetchAvailableSlots(selectedDate.value)
    slotsData.value = slots
}

const unblockSelectedSlot = async (slot) => {
    console.log('slot', slot);
    
    try {
        await serviceAvailabilityStore.unblockSlot(slot.slot_id)
        toast.success("Horário liberado!")

        calendarRef.value.getApi().refetchEvents()

        await loadSlots()
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
        } else {
            toast.error(response.message);
        }
    } catch (error) {
        console.error('Erro ao criar agenda', error)
    }
}
</script>
