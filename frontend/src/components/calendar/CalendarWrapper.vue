<template>
    <div class="p-6 bg-white rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Agenda de Serviços</h2>
        </div>

        <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const availabilityStore = useServiceAvailabilityStore()
const calendarRef = ref(null)

// Função para clicar no evento
const handleEventClick = async (info) => {
    const slot = info.event.extendedProps.slot
    if (slot.is_booked) return

    if (!confirm(`Deseja reservar ${slot.date} ${slot.start_time}?`)) return

    try {
        await availabilityStore.bookSlot(slot.id)
        toast.success("Horário reservado com sucesso!")
        calendarRef.value.getApi().refetchEvents()
    } catch (err) {
        toast.error("Erro ao reservar horário")
    }
}

// Função para renderizar evento com HTML customizado
const renderEventContent = (eventInfo) => {
    const is_booked = eventInfo.event.extendedProps.slot.is_booked
    const slotWrapper = eventInfo.event.extendedProps.slot
    const slot = slotWrapper.extendedProps?.slot || slotWrapper

    const color = is_booked ? "#EF4444" : "#10B981"
    const icon = is_booked ? "🔒" : "✅"
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
                    ${icon} <strong>${slot.service.name} | </strong>
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
                availabilityStore.slots.map((slot) => ({
                    ...slot,
                    title: slot.is_booked ? "Reservado" : "Disponível",
                    backgroundColor: slot.is_booked ? "#EF4444" : "#10B981",
                    borderColor: slot.is_booked ? "#EF4444" : "#10B981",
                    extendedProps: { slot }
                }))
            )
        } catch (err) {
            failure(err)
        }
    }
}
</script>
