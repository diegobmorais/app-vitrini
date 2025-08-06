<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p class="text-gray-600 mb-4">
                Tem certeza que deseja excluir o cliente <strong>{{ customerName }}</strong>?
            </p>
            <p class="text-sm text-red-600 mb-4">
                Esta ação é irreversível e removerá todos os dados associados.
            </p>
            <div class="flex justify-end space-x-3">
                <button @click="$emit('cancel')"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancelar
                </button>
                <button @click="$emit('confirm')"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                    Excluir
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    customerName: String
})
</script>