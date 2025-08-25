<template>
    <div class="p-6 bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Agenda de Serviços</h2>
        </div>
        <!-- Calendário -->
        <FullCalendar ref="calendarRef" :options="calendarOptions" />

        <!-- Modal de Agendamento -->
        <AdminBookSlotModal :show="showAdminModal" :slotData="selectedSlot" @close="closeAdminModal"
            @saved="refreshCalendar" />
      
        <!-- Dropdown de Ações -->
        <div v-if="showDropdown" :style="{
            position: 'absolute',
            top: `${dropdownPosition.y}px`,
            left: `${dropdownPosition.x}px`,
            zIndex: 11111
        }" class="bg-white border border-gray-200 shadow-lg rounded-lg w-52">
            <div class="px-4 py-3 border-b border-gray-200">
                <p class="font-semibold text-gray-800 text-sm">
                    {{ selectedSlot?.service?.name || 'Serviço' }}
                </p>
                <p class="text-xs text-gray-500">
                    {{ selectedSlot?.start_time }} - {{ selectedSlot?.end_time }}
                </p>
            </div>

            <!-- Ações -->
            <div class="flex flex-col">
                <!-- Agendar -->
                <button v-if="selectedSlot && selectedSlot.status !== 'booked'" @click.stop="openAdminBookModal"
                    class="px-4 py-2 text-left hover:bg-green-100 text-green-600">
                    Agendar horário
                </button>

                <!-- Bloquear -->
                <button v-if="selectedSlot && selectedSlot.status !== 'blocked'" @click="blockSelectedSlot"
                    class="px-4 py-2 text-left hover:bg-yellow-100 text-yellow-600">
                    Bloquear horário
                </button>

                <!-- Liberar -->
                <button v-if="selectedSlot && (selectedSlot.status === 'blocked' || selectedSlot.status === 'booked')"
                    @click="unblockSelectedSlot" class="px-4 py-2 text-left hover:bg-blue-100 text-blue-600">
                    Liberar horário
                </button>

                <!-- Cancelar -->
                <button @click="showDropdown = false" class="px-4 py-2 text-left hover:bg-gray-100 text-gray-600">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"
import AdminBookSlotModal from "@/components/modals/settings-modals/AdminBookSlotModal.vue"

const toast = useToast()
const availabilityStore = useServiceAvailabilityStore()
const calendarRef = ref(null)
const selectedSlot = ref(null)
const showAdminModal = ref(false)
const showDropdown = ref(false)
const dropdownPosition = ref({ x: 0, y: 0 })

// Função para clicar no evento
const handleEventClick = async (info) => {
    const slotWrapper = info.event.extendedProps.slot
    const slot = slotWrapper.extendedProps?.slot || slotWrapper

    // if (slot.status === 'booked') return toast.warning("Horário já reservado")
    // if (slot.status === 'blocked') return toast.warning("Você precisa primeiro liberar este horário")

    selectedSlot.value = slot
    console.log(slot);
    
    dropdownPosition.value = {
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY
    }
    showDropdown.value = true
}

// Abrir modal de agendamento
const openAdminBookModal = () => {
    if (!selectedSlot.value) return
    showDropdown.value = false
    showAdminModal.value = true
}

// Fechar modal
const closeAdminModal = () => {
    showAdminModal.value = false
    selectedSlot.value = null
}

// Refrescar calendário
const refreshCalendar = () => {
    if (calendarRef.value) calendarRef.value.getApi().refetchEvents()
}

// Função para renderizar evento com HTML customizado
const renderEventContent = (eventInfo) => {
    const slotWrapper = eventInfo.event.extendedProps.slot
    const slot = slotWrapper.extendedProps?.slot || slotWrapper
    const status = slot.status;

    let color, icon

    switch (status) {
        case "booked":
            color = "#EF4444";
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6-2v2m12-2v2m-9-9h6v6H9V8z" />
                </svg>
            `;
            break;
        case "blocked":
            color = "#CA8A04";
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728" />
                </svg>
            `;
            break;
        default:
            color = "#10B981";
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            `;
    }
    const time = `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`

    return {
        html: `
      <div style="
        background-color:${color};
        padding:4px 6px;
        border-radius:6px;
        font-size:12px;
        color:white;
        display:flex;
        align-items:center;
        gap:4px;
        cursor:pointer;
        width:100%;
      ">
        <div style="display:flex;align-items:center;gap:4px;">
                    ${icon} <strong>${slot.service.name}</strong>
                </div>
                <div style="font-size:11px;opacity:0.85;">${time}</div>
      </div>
    `
    }
}

// Opções do calendário
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    headerToolbar: {
        left: "prev,next,today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    locale: "pt-br",
    height: "auto",
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    editable: false,
    selectable: true,
    eventClick: handleEventClick,
    eventContent: renderEventContent,
    events: async (fetchInfo, success, failure) => {
        try {
            await availabilityStore.fetchAvailableSlots({
                start_date: fetchInfo.startStr.split("T")[0],
                end_date: fetchInfo.endStr.split("T")[0],
                service_ids: availabilityStore.selectedServiceIds || []
            })
            success(
                availabilityStore.slots.map((slot) => {
                    let backgroundColor = "#10B981";
                    let borderColor = "#10B981";

                    if (slot.status === "booked") {
                        backgroundColor = "#EF4444";
                        borderColor = "#EF4444";
                    } else if (slot.status === "blocked") {
                        backgroundColor = "#CA8A04";
                        borderColor = "#CA8A04";
                    }

                    return {
                        ...slot,
                        title: slot.status === "booked" ? "Reservado" : slot.status === "blocked" ? "Bloqueado" : "Disponível",
                        backgroundColor,
                        borderColor,
                        extendedProps: { slot }
                    };
                })
            );
        } catch (err) {
            failure(err)
        }
    },
}

const blockSelectedSlot = async () => {
    try {
        await availabilityStore.blockSlot(selectedSlot.value.id)
        toast.success("Horário bloqueado!")
        showDropdown.value = false
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao bloquear horário, verifique se já não está reservado")
    }
}

const unblockSelectedSlot = async () => {
    try {
        await availabilityStore.unblockSlot(selectedSlot.value.id)
        toast.success("Horário liberado!")
        showDropdown.value = false
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao liberar horário")
    }
}
</script>
