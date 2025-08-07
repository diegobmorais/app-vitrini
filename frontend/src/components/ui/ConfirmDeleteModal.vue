<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- Fundo escuro -->
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('cancel')"></div>

            <!-- Caixa de confirmação -->
            <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmar exclusão</h3>
                <p class="text-gray-700 mb-6">
                    {{ message }}
                </p>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="$emit('cancel')"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button type="button" @click="$emit('confirm')"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    message: {
        type: String,
        default: 'Tem certeza que deseja continuar?'
    }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>