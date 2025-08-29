<template>
    <div class="flex h-full">
        <!-- Conteúdo principal -->
        <div class="flex-1 p-4">

            <!-- Toolbar -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <div class="flex gap-4 mb-4">
                        <div class="flex items-center gap-1">
                            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span class="text-sm">Disponível</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="w-3 h-3 rounded-full bg-red-400"></span>
                            <span class="text-sm">Bloqueado</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="w-3 h-3 rounded-full bg-green-500"></span>
                            <span class="text-sm">Agendado</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Calendário FullCalendar -->
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="border rounded shadow" />
        </div>
    </div>
</template>


<script setup>
import { ref, defineEmits } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useServiceAvailabilityStore } from "@/store/modules/useServiceAvailabilityStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const availabilityStore = useServiceAvailabilityStore()
const calendarRef = ref(null)

const emit = defineEmits(['slot-click'])

defineExpose({
    getApi: () => calendarRef.value?.getApi()
});

// Clique no evento
const handleEventClick = (info) => {
    const { slots, service, date } = info.event.extendedProps;

    emit('slot-click', {
        slots,
        service,
        date,
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY
    });
};

// Renderização customizada
const renderEventContent = (eventInfo) => {
    const { counts } = eventInfo.event.extendedProps;

    const circles = `
    <div style="
      display: flex;
      gap: 6px;
      margin-left: 4px;
      font-size: 9px;
      line-height: 1;
    ">   
      <div style="
        width: 14px;
        height: 14px;
        background: #3B82F6;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: ${counts.openCount > 0 ? 1 : 0.5};
      ">
        ${counts.openCount > 0 ? counts.openCount : ''}
      </div>   
      <div style="
        width: 14px;
        height: 14px;
        background: #3AAB42;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: ${counts.bookedCount > 0 ? 1 : 0.5};
      ">
        ${counts.bookedCount > 0 ? counts.bookedCount : ''}
      </div>
      <div style="
        width: 14px;
        height: 14px;
        background: #FC3232;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: ${counts.blockedCount > 0 ? 1 : 0.5};
      ">
        ${counts.blockedCount > 0 ? counts.blockedCount : ''}
      </div>
    </div>
  `;

    return {
        html: `
      <div style="
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        color: #1f2937;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        overflow: hidden;
        background: #F5AE8C; /* Cor neutra: cinza claro */
        border: 1px solid #e5e7eb;
        width: 100%;
        box-sizing: border-box;
      ">
        <div style="
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        ">
          ${eventInfo.event.title}
        </div>
        ${circles}
      </div>
    `,
    };
};

// Opções do calendário
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    contentHeight: 'auto',
    buttonText: {
        today: 'Mês atual',
        month: 'Mensal'      
    },
    headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: ''
    },
    allDaySlot: true,
    locale: 'pt-br',
    nowIndicator: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    selectable: true,
    editable: false,
    dayMaxEventRows: 2,
    moreLinkClick: 'popover',
    eventClick: handleEventClick,
    eventContent: renderEventContent,
    scrollTime: '08:00:00',
    events: async (fetchInfo, successCallback, failureCallback) => {
        try {
            const start_date = fetchInfo.startStr.split('T')[0];
            const end_date = fetchInfo.endStr.split('T')[0];

            const slots = await availabilityStore.fetchAvailableSlots({
                start_date,
                end_date,
                service_ids: availabilityStore.selectedServiceIds || []
            });

            const grouped = new Map();

            slots.forEach(slot => {
                const date = slot.extendedProps.slot.slot_date;
                const serviceId = slot.extendedProps.slot.service.id;
                const key = `${date}-${serviceId}`;

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        date,
                        service: slot.extendedProps.slot.service,
                        slots: []
                    });
                }

                grouped.get(key).slots.push(slot);
            });

            // Gera os eventos
            const events = Array.from(grouped.values()).map(group => {
                const { date, service, slots } = group;

                const openCount = slots.filter(s => s.status === 'open').length;
                const bookedCount = slots.filter(s => s.status === 'booked').length;
                const blockedCount = slots.filter(s => s.status === 'blocked').length;

                return {
                    id: `group-${date}-${service.id}`,
                    title: service.name,
                    start: date,
                    allDay: true,
                    extendedProps: {
                        service,
                        date,
                        slots,
                        counts: { openCount, bookedCount, blockedCount }
                    },
                    backgroundColor: '#E0D6D3',
                    borderColor: '#e5e7eb',
                    display: 'block'
                };
            });

            successCallback(events);
        } catch (err) {
            console.error('Erro ao carregar eventos:', err);
            toast.error('Falha ao carregar agenda');
            failureCallback(err);
        }
    }

}
</script>

<style scoped>
.fc-daygrid-event {
    padding: 1px 2px !important;
    font-size: 10px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.fc-daygrid-event-content {
    padding: 0 !important;
}
</style>
