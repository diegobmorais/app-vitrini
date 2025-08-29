<!-- BlockReasonModal.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Bloquear Horário</h4>
            <p class="text-sm text-gray-600 mb-4">
                Informe o motivo do bloqueio:
            </p>
            <textarea v-model="reason" placeholder="Ex: Manutenção, feriado, ausência..."
                class="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"></textarea>
            <div class="flex justify-end gap-3 mt-6">
                <button @click="$emit('cancel')"
                    class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                    Cancelar
                </button>
                <button @click="confirm" :disabled="!reason.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    Bloquear
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const reason = ref('');
const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
    if (reason.value.trim()) {
        emit('confirm', reason.value.trim());
    }
};
</script>