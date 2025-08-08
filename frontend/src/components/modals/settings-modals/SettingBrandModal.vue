<template>
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveBrandSubmit">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="mb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                            {{ editingBrand.id ? 'Editar Marca' : 'Nova Marca' }}
                        </h3>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label for="brandName" class="block text-sm font-medium text-gray-700">Nome</label>
                            <input id="brandName" v-model="editingBrand.name" type="text" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label for="brandDescription"
                                class="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="brandDescription" v-model="editingBrand.description" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
                        </div>                      
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Salvar
                    </button>
                    <button type="button" @click="$emit('close')"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    brand: {
        type: Object,
        required: false,
        default: () => ({})
    }
})
const emit = defineEmits(['close', 'save'])

const editingBrand = ref({
    name: '',
    description: '',   
})

watch(
    () => props.brand,
    (newVal) => {
        if (newVal) {
            Object.assign(editingBrand.value, { 
                id: newVal.id,            
                name: newVal.name,
                description: newVal.description,               
            })

        } else {
            Object.assign(editingBrand.value, {         
                name: '',
                description: '',              
            })
        }
    },
    { immediate: true }
)

const saveBrandSubmit = () => {
    const payload = {
        ...editingBrand.value,
        id: editingBrand.value.id ? Number(editingBrand.value.id) : null
    }

    emit('save', payload)
    emit('close')
}
</script>