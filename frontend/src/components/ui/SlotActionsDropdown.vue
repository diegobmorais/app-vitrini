<template>
    <div class="absolute z-50 bg-white border shadow-lg rounded-lg w-52">
        <div class="px-4 py-3 border-b">
            <p class="font-semibold">{{ slot.service.name }}</p>
            <p class="text-xs">{{ slot.start_time }} - {{ slot.end_time }}</p>
        </div>
        <div class="flex flex-col">
            <button v-if="slot.status !== 'booked'" @click="$emit('book')"
                class="px-4 py-2 text-left hover:bg-green-100 text-green-600">Agendar horário</button>
            <button v-if="slot.status !== 'blocked'" @click="$emit('block')"
                class="px-4 py-2 text-left hover:bg-yellow-100 text-yellow-600">Bloquear horário</button>
            <button v-if="slot.status === 'blocked' || slot.status === 'booked'" @click="$emit('unblock')"
                class="px-4 py-2 text-left hover:bg-blue-100 text-blue-600">Liberar horário</button>
            <button @click="$emit('cancel')"
                class="px-4 py-2 text-left hover:bg-gray-100 text-gray-600">Cancelar</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    slot: Object,
    x: Number,
    y: Number
})
</script>
