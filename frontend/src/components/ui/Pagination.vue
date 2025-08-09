<template>
    <div v-if="totalPages > 1 || total > 0" class="mt-4 border-t pt-4">
        <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
                Mostrando {{ start }}-{{ end }} de {{ total }} itens
            </div>

            <div class="flex space-x-1">
                <button :disabled="currentPage === 1" @click="$emit('page-changed', currentPage - 1)"
                    class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>

                <template v-for="page in visiblePages" :key="page">
                    <button v-if="page !== null" @click="$emit('page-changed', page)" :class="[
                        'px-3 py-1 border text-sm font-medium rounded',
                        currentPage === page
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]">
                        {{ page }}
                    </button>
                    <span v-else key="ellipsis" class="px-3 py-1 text-sm text-gray-500">...</span>
                </template>

                <button :disabled="currentPage === totalPages" @click="$emit('page-changed', currentPage + 1)"
                    class="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próxima
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    total: { type: Number, default: 0 }
})

const emit = defineEmits(['page-changed'])

const visiblePages = computed(() => {
    const pages = []
    const { currentPage, totalPages } = props

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, null, totalPages)
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages)
        }
    }
    return pages
})

const start = computed(() => {
    const val = (props.currentPage - 1) * 10 + 1
    return props.total === 0 ? 0 : val
})

const end = computed(() => {
    return Math.min(props.currentPage * 10, props.total)
})
</script>