<!-- CalendarServiceModal.vue -->
<template>
    <!-- Fundo escurecido -->
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <!-- Modal principal -->
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen flex flex-col overflow-hidden">
                <!-- Cabeçalho -->
                <div
                    class="flex justify-between items-center border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm rounded-t-xl">
                    <!-- Título e data -->
                    <h3 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <!-- Nome do serviço -->
                        <span class="text-blue-700 capitalize">{{ capitalize(service?.name) }}</span>

                        <!-- Separador e data -->
                        <span class="text-gray-500 text-lg font-medium"> - {{ formatDate(date) }}</span>
                    </h3>

                    <!-- Botão de fechar -->
                    <button @click="$emit('close')"
                        class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition rounded-full w-8 h-8 flex items-center justify-center text-2xl">
                        &times;
                    </button>
                </div>

                <!-- Conteúdo com scroll -->
                <div class="flex-1 overflow-y-auto p-6 space-y-8">
                    <!-- Seção: Horários Abertos -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <div v-for="slot in openSlots" :key="slot.slot_id" @click="openBlockPrompt(slot)"
                            class="relative bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <!-- Hora -->
                            <div class="font-bold text-blue-800 text-sm">
                                {{ formatTime(slot.extendedProps.slot.start_time) }}
                            </div>

                            <!-- Status -->
                            <div class="text-xs text-blue-600 mt-1">Livre</div>

                            <!-- Ícones de ação - fixados no canto inferior direito -->
                            <div class="absolute bottom-2 right-2 flex items-center gap-2">
                                <!-- Botão de agendar -->
                                <button @click.stop="handleBookSlot(slot)"
                                    class="p-1 rounded-full hover:bg-blue-100 transition" title="Agendar horário">
                                    <CalendarDaysIcon class="w-5 h-5 text-blue-600" />
                                </button>

                                <!-- Botão de bloqueio -->
                                <button @click.stop="handleBlockSlot(slot)"
                                    class="p-1 rounded-full hover:bg-red-100 transition" title="Bloquear horário">
                                    <LockClosedIcon class="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Seção: Horários Agendados -->
                    <div v-if="bookedSlots.length > 0" class="space-y-4">
                        <!-- Cabeçalho dos agendados -->
                        <div class="flex items-center gap-2">
                            <div
                                class="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full shadow-sm">
                                <CheckCircleIcon class="w-4 h-4" />
                            </div>
                            <h4 class="text-lg font-semibold text-green-700">
                                Agendados ({{ bookedSlots.length }})
                            </h4>
                        </div>

                        <div class="space-y-3">
                            <div v-for="slot in bookedSlots" :key="slot.slot_id"
                                class="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">

                                <!-- Horário -->
                                <div class="flex items-center gap-2 mb-2">
                                    <ClockIcon class="w-5 h-5 text-green-600" />
                                    <span class="font-medium text-green-800 text-sm">
                                        {{ formatTime(slot.extendedProps.slot.start_time) }}
                                    </span>
                                </div>

                                <!-- Pet -->
                                <div class="flex items-center gap-2 text-sm text-green-700 mb-1">
                                    <PawPrintIcon class="w-5 h-5 text-green-600" />
                                    <span>{{ slot.extendedProps.slot.appointment?.[0]?.pet_name  || 'Pet não informado' }}</span>
                                </div>

                                <!-- Agendado por -->
                                <div class="flex items-center gap-2 text-sm text-green-700 mb-2">
                                    <UserIcon class="w-5 h-5 text-green-600" />
                                    <span>
                                        por {{ slot.extendedProps.slot.appointment?.[0]?.user?.name || 'Admin' }}
                                    </span>
                                </div>

                                <!-- Notas -->
                                <div v-if="slot.notes"
                                    class="flex items-start gap-2 text-xs text-green-700 bg-green-100 bg-opacity-40 p-2 rounded-lg border border-green-200">
                                    <DocumentTextIcon class="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                                    <span>{{ slot.notes }}</span>
                                </div>

                                <!-- Botão de ação -->
                                <div class="mt-auto flex justify-end pt-3">
                                    <button @click="handleUnblockSlot(slot)"
                                        class="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition font-medium">
                                        <TrashIcon class="w-4 h-4" />
                                        Cancelar e Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Seção: Horários Bloqueados -->
                    <div v-if="blockedSlots.length > 0" class="space-y-4">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                            <h4 class="text-lg font-semibold text-red-700">
                                Bloqueados ({{ blockedSlots.length }})
                            </h4>
                        </div>
                        <div class="space-y-3">
                            <div v-for="slot in blockedSlots" :key="slot.slot_id"
                                class="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-start">
                                <div>
                                    <div class="font-medium text-red-800 text-sm">
                                        {{ formatTime(slot.extendedProps.slot.start_time) }}
                                    </div>
                                    <div class="text-xs text-red-600 mt-1">
                                        {{ slot.block_reason || 'Bloqueio sem motivo' }}
                                    </div>
                                </div>
                                <button @click="handleUnblockSlot(slot)"
                                    class="px-3 py-1.5 text-xs bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-100 transition">
                                    Desbloquear
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Vazio -->
                    <div v-if="allSlots.length === 0" class="text-center py-12 text-gray-500">
                        <CalendarDaysIcon class="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p class="text-lg">Nenhum horário disponível para este dia.</p>
                    </div>
                </div>

                <!-- Rodapé -->
                <div class="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <button @click="$emit('close')"
                        class="px-5 py-2.5 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium">
                        Fechar
                    </button>
                </div>
            </div>

            <!-- Modal de bloqueio com motivo -->
            <BlockReasonModal v-if="showBlockModal" :slot="selectedSlotToBlock" @confirm="confirmBlock"
                @cancel="showBlockModal = false" />
        </div>
    </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
    LockClosedIcon,
    CalendarDaysIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/solid';
import BlockReasonModal from './BlockReasonModal.vue';
import { formatDate, formatTime } from '../../../utils/date.js';
import { capitalize } from '@/utils/utils';
import { PawPrintIcon } from "lucide-vue-next";

// Props
const props = defineProps({
    show: { type: Boolean, required: true },
    service: { type: Object, required: true },
    date: { type: String, required: true },
    slots: { type: Array, required: true }
});

// Emits
const emit = defineEmits(['close', 'book', 'block', 'unblock']);

// Estado para o modal de bloqueio
const showBlockModal = ref(false);
const selectedSlotToBlock = ref(null);

// Computed
const openSlots = computed(() => props.slots.filter(s => s.status === 'open'));
const bookedSlots = computed(() => props.slots.filter(s => s.status === 'booked'));
const blockedSlots = computed(() => props.slots.filter(s => s.status === 'blocked'));
const allSlots = computed(() => [...openSlots.value, ...bookedSlots.value, ...blockedSlots.value]);

// Funções
const handleBookSlot = (slot) => {
    emit('book', slot);    
};

const handleUnblockSlot = (slot) => {
    emit('unblock', slot);  
};

const openBlockPrompt = (slot) => {
    selectedSlotToBlock.value = slot;
    showBlockModal.value = true;
};

const confirmBlock = (reason) => {
    const slot = selectedSlotToBlock.value;
    emit('block', { ...slot, block_reason: reason });
    showBlockModal.value = false;
    emit('close');
};

const handleBlockSlot = (slot) => {
    openBlockPrompt(slot);
};

</script>

<style scoped>
/* Evita scroll no body */
.fixed.inset-0 {
    overflow: hidden;
}
</style>