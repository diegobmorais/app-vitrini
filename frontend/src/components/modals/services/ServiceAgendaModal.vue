<template>
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white w-1/2 rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold mb-4">Configurar Agenda</h2>
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm">Tipo</label>
                        <select v-model="form.mode" class="w-full border rounded px-3 py-2">
                            <option value="extra">Período fixo</option>
                            <option value="custom">Personalizado</option>
                            <option value="block">Bloqueio</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Data</label>
                        <input type="date" v-model="form.date" class="w-full border rounded px-3 py-2" />
                    </div>

                    <div>
                        <label class="text-sm">Início</label>
                        <input type="time" v-model="form.start_time" class="w-full border rounded px-3 py-2" />
                    </div>

                    <div>
                        <label class="text-sm">Fim</label>
                        <input type="time" v-model="form.end_time" class="w-full border rounded px-3 py-2" />
                    </div>
                </div>

                <div class="flex justify-end mt-6 space-x-3">
                    <button @click="$emit('close')"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                    <button type="submit" :disabled="!isFormValid"
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    initialData: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['close', 'saved'])

const today = ref(new Date().toISOString().split('T')[0])

const form = ref({
    service_id: '',
    date: '',
    start_time: '',
    end_time: '',
    mode: 'single',
    interval_minutes: 30
})

const isFormValid = computed(() => {
    return form.value.mode &&
        form.value.date &&
        form.value.start_time &&
        form.value.end_time &&
        (form.value.mode !== 'block' || form.value.reason.trim())
})

watch(
    () => props.initialData,
    (newData) => {
        if (newData) {
            Object.assign(form.value, newData)
        } else {
            form.value = {
                mode: 'period',
                date: '',
                start_time: '',
                end_time: '',
                reason: ''
            }
        }
    },
    { immediate: true }
)

const handleSubmit = () => {
    if (!isFormValid.value) return    
    emit('saved', { ...form.value })
}
</script>