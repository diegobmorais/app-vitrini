<template>
    <div v-if="show" class="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4">Agendar Horário</h2>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Nome do Pet</label>
                <input v-model="form.pet_name" type="text" placeholder="Nome do pet"
                    class="w-full border rounded p-2" />
            </div>

            <div class="mb-3">
                <p>Serviço: <strong>{{ slotData.extendedProps.slot.service.name }}</strong></p>
                <p>Horário: <strong>{{ slotData.extendedProps.slot.slot_date }} - {{ slotData.extendedProps.slot.start_time }}</strong>
                </p>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Informações do Dono</label>
                <textarea v-model="form.notes" type="text" placeholder="Nome - telefone - email"
                    class="w-full border rounded p-2"></textarea>

            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Transporte</label>
                <select v-model="form.transport_option" class="w-full border rounded p-2">
                    <option value="" disabled>Selecione uma opção</option>
                    <option value="pickup">Cliente irá trazer o pet</option>
                    <option value="delivery">Loja buscara o pet</option>
                </select>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <button @click="closeModal"
                    class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
                <button @click="submit"
                    class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Agendar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useServiceAvailabilityStore } from '@/store/modules/useServiceAvailabilityStore'
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { defineProps, defineEmits } from 'vue'

const useServiceStore = useServiceAvailabilityStore()

const props = defineProps({
    show: Boolean,
    slotData: Object
})
const emit = defineEmits(['update:show', 'saved'])
const closeModal = () => {
  emit('update:show', false)
}
const toast = useToast()
const form = reactive({
    pet_name: '',
    notes: '',
    transport_option: ''
})

// Dispara o agendamento
const submit = async () => {      
    if (!props.slotData.extendedProps.slot.id) {
        toast.error("Dados do slot não encontrados")
        return
    }

    if (!form.pet_name) {
        toast.error("Informe o nome do pet")
        return
    }

    try {
        await useServiceStore.bookSlotByAdmin(props.slotData.extendedProps.slot.id, form.pet_name, form.notes, form.transport_option)

        emit('saved')       
        closeModal() 
    } catch (err) {
        toast.error("Erro ao agendar horário")
    }
}
</script>
