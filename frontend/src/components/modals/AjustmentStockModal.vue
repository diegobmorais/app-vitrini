<template>
    <div v-if="showAdjustmentModal" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form @submit.prevent="saveStockAdjustment">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="mb-4">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">
                                Ajuste de Estoque
                            </h3>
                            <p v-if="selectedProduct" class="mt-1 text-sm text-gray-500">
                                {{ selectedProduct.name }} (SKU: {{ selectedProduct.sku }})
                            </p>
                        </div>
                        <div class="space-y-4">
                            <div v-if="!selectedProduct">
                                <label for="product" class="block text-sm font-medium text-gray-700">Produto</label>
                                <select id="product" v-model="adjustmentForm.product_id" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                    <option value="">Selecione um produto</option>
                                    <option v-for="product in products" :key="product.id" :value="product.id">
                                        {{ product.name }} ({{ product.sku }})
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="current_stock" class="block text-sm font-medium text-gray-700">Estoque
                                    Atual</label>
                                <input id="current_stock" :value="currentStock" type="number" disabled
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
                            </div>

                            <div>
                                <label for="adjustment_type" class="block text-sm font-medium text-gray-700">Tipo de
                                    Ajuste</label>
                                <select id="adjustment_type" v-model="adjustmentForm.type" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                    <option value="" disabled selected>Selecione o tipo de ajuste</option>
                                    <option value="add">Adicionar</option>
                                    <option value="remove">Remover</option>
                                    <option value="set">Ajustar Valor</option>
                                </select>
                            </div>

                            <div>
                                <label for="quantity" class="block text-sm font-medium text-gray-700">Quantidade</label>
                                <input id="quantity" v-model.number="adjustmentForm.quantity" type="number" min="1"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                            </div>

                            <div>
                                <label for="reason" class="block text-sm font-medium text-gray-700">Motivo</label>
                                <select id="reason" v-model="adjustmentForm.reason" required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                    <option value="">Selecione um motivo</option>
                                    <option value="purchase">Compra</option>
                                    <option value="sale">Venda</option>
                                    <option value="return">Devolução</option>
                                    <option value="loss">Perda/Dano</option>
                                    <option value="correction">Correção de Inventário</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div v-if="adjustmentForm.reason === 'other'">
                                <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
                                <textarea id="notes" v-model="adjustmentForm.notes" rows="2"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
                            </div>

                            <div>
                                <label for="new_stock" class="block text-sm font-medium text-gray-700">Novo
                                    Estoque</label>
                                <input id="new_stock" :value="newStockPreview" type="number" disabled
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Salvar
                        </button>
                        <button type="button" @click="emit('close')"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '@/store/modules/useInventoryStore'
import { useProductStore } from '@/store/modules/useProductStore'

// --- Props ---
const props = defineProps({
    showAdjustmentModal: {
        type: Boolean,
        required: true
    },
    selectedProduct: {
        type: Object,
        default: null
    }
})

// --- Emit ---
const emit = defineEmits(['close', 'saved'])

// --- Stores ---
const stockStore = useInventoryStore()
const productStore = useProductStore()

// --- Dados do formulário ---
const adjustmentForm = ref({
    product_id: '',
    type: '',
    quantity: 1,
    reason: '',
    notes: ''
})

// --- Produtos ---
const products = computed(() => productStore.products || [])

// --- Produto atual ---
const currentProduct = computed(() => {
    if (props.selectedProduct) return props.selectedProduct
    return products.value.find(p => p.id === adjustmentForm.value.product_id) || null
})

// --- Estoque atual ---
const currentStock = computed(() => {
    return currentProduct.value?.stock || 0
})

// --- Novo estoque ---
const newStockPreview = computed(() => {
    const current = currentStock.value
    const qty = adjustmentForm.value.quantity || 0

    if (!qty) return current

    switch (adjustmentForm.value.type) {
        case 'add':
            return current + qty
        case 'remove':
            return Math.max(0, current - qty)
        case 'set':
            return qty
        default:
            return current
    }
})

watch(
    () => props.selectedProduct,
    (newVal) => {
        if (newVal) {
            adjustmentForm.value.product_id = newVal.id
        }
    },
    { immediate: true }
)

watch(
    () => props.showAdjustmentModal,
    (isOpen) => {
        if (!isOpen) {
            adjustmentForm.value = {
                product_id: '',
                type: '',
                quantity: 1,
                reason: '',
                notes: ''
            }
        }
    }
)

// --- Salvar ajuste ---
const saveStockAdjustment = async () => {
    if (!adjustmentForm.value.product_id || !adjustmentForm.value.reason) {
        alert('Preencha todos os campos obrigatórios')
        return
    }

    try {
        // Mapeia o tipo para o que a API espera
        const typeMap = {
            add: 'entrada',
            remove: 'saida',
            set: 'ajuste'
        }

        const payload = {
            product_id: adjustmentForm.value.product_id,
            warehouse_id: 1,
            type: typeMap[adjustmentForm.value.type],
            quantity: adjustmentForm.value.quantity,
            description: [
                adjustmentForm.value.reason,
                adjustmentForm.value.notes ? `(${adjustmentForm.value.notes})` : ''
            ].filter(Boolean).join(' - ')
        }

        // Chama a API
        await stockStore.addMovement(payload)

        // Emite evento de sucesso
        emit('saved')

        // Reseta o formulário
        adjustmentForm.value = {
            product_id: props.selectedProduct?.id || '',
            type: 'add',
            quantity: 1,
            reason: '',
            notes: ''
        }

        // Fecha o modal
        emit('close')
    } catch (error) {
        alert('Erro ao salvar ajuste de estoque')
        console.error(error)
    }
}
</script>