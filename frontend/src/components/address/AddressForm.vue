<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 class="text-xl font-semibold mb-4">
                {{ props.isEdit ? 'Editar Endereço' : 'Novo Endereço' }}
            </h2>

            <form @submit.prevent="submit">
                <div class="grid grid-cols-2 gap-4">
                    <input v-model="form.name" placeholder="Nome (Casa, Trabalho)" class="input" />
                    <input v-model="form.street" placeholder="Rua" class="input" />
                    <input v-model="form.number" placeholder="Número" class="input" />
                    <input v-model="form.complement" placeholder="Complemento" class="input" />
                    <input v-model="form.neighborhood" placeholder="Bairro" class="input" />
                    <input v-model="form.city" placeholder="Cidade" class="input" />
                    <input v-model="form.state" placeholder="Estado" class="input" />
                    <input v-model="form.zipcode" placeholder="CEP" class="input" />
                </div>

                <div class="mt-4 flex justify-end gap-2">
                    <button type="button" class="btn-secondary" @click="close">Cancelar</button>
                    <button type="submit" class="btn-primary">{{ isEdit ? 'Atualizar' : 'Salvar' }}</button>
                </div>
                <div class="mt-4">
                    <label class="inline-flex items-center">
                        <input type="checkbox" v-model="form.for_delivery" class="form-checkbox text-primary">
                        <span class="ml-2 text-sm text-gray-700">Usar como endereço de entrega</span>
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, watch } from 'vue'

const props = defineProps({
    address: Object,
    isEdit: Boolean
})
console.log('Props no setup:', props)
const emit = defineEmits(['close', 'saved'])

const form = reactive({
    id: props.address?.id ?? null,
    name: props.address?.name || '',
    street: props.address?.street || '',
    number: props.address?.number || '',
    complement: props.address?.complement || '',
    zipcode: props.address?.zipcode || '',
    city: props.address?.city || '',
    state: props.address?.state || '',
    neighborhood: props.address?.neighborhood || '',
    for_delivery: props.address?.for_delivery ?? false,
});

watch(
    () => [props.address, props.isEdit],
    ([newAddress, isEdit]) => {
        if (isEdit && newAddress) {
            form.id = newAddress.id ?? null;
            form.name = newAddress.name ?? '';
            form.street = newAddress.street ?? '';
            form.number = newAddress.number ?? '';
            form.complement = newAddress.complement ?? '';
            form.zipcode = newAddress.zipcode ?? '';
            form.city = newAddress.city ?? '';
            form.state = newAddress.state ?? '';
            form.neighborhood = newAddress.neighborhood ?? '';
            form.for_delivery = newAddress.for_delivery ?? false;
            console.log('is edit editar endereço', isEdit);
        } else {
            form.id = null;
            form.name = '';
            form.street = '';
            form.number = '';
            form.complement = '';
            form.zipcode = '';
            form.city = '';
            form.state = '';
            form.neighborhood = '';
            form.for_delivery = false;
            console.log('is edit novo endereço', isEdit);
        }
    },
    { immediate: true }
);

const close = () => emit('close')

const submit = async () => {
    try {
        if (props.isEdit) {
            console.log('editar');

            await axios.put(`api/address/${form.id}`, form);
        } else {
            console.log('post');

            await axios.post('api/address', form);
        }

        emit('saved');
        emit('close');
    } catch (error) {
        console.error('Erro ao salvar endereço:', error);
    }
}
</script>

<style scoped>
.input {
    @apply border border-gray-300 rounded px-3 py-2;
}

.btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded;
}

.btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded;
}
</style>