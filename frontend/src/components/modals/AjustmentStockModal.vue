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
                            <div class="reactive">
                                <label for="product" class="block text-sm font-medium text-gray-700">Produto</label>
                                <!-- Campo de busca -->
                                <input v-model="searchTerm" type="text" @focus="onFocus" @blur="onBlur"
                                    placeholder="Buscar produto por nome ou SKU..."
                                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                                <!-- Dropdown de resultados -->
                                <ul v-if="showDropdown && searchResults.length > 0"
                                    class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    <li v-for="product in searchResults" :key="product.id"
                                        @click="selectProduct(product)"
                                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between truncate">
                                        <span class="font-medium text-gray-900 truncate">{{ product.name }}</span>
                                        <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">
                                            {{ product.sku }}
                                        </span>
                                    </li>
                                </ul>
                                <!-- Mensagem sem resultados -->
                                <div v-else-if="showDropdown && searchResults.length === 0"
                                    class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500 text-sm">
                                    Nenhum produto encontrado.
                                </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useInventoryStore } from '@/store/modules/useInventoryStore'
import { useProductStore } from '@/store/modules/useProductStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
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
const inventoryStore = useInventoryStore()
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
const searchTerm = ref('')
const showDropdown = ref(false)
const selectedProduct = ref(null)

// Resultados da busca
const searchResults = computed(() => {
    if (!searchTerm.value) return []
    return productStore.products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})

let searchTimer = null
watch(searchTerm, (value) => {
    if (!value) {
        showDropdown.value = false
        return
    }

    clearTimeout(searchTimer)
    searchTimer = setTimeout(async () => {
        const resp = await productStore.fetchProducts({ search: value })        
        
        showDropdown.value = true
    }, 300)
})

// Seleciona produto
const selectProduct = (product) => {
    selectedProduct.value = product
    searchTerm.value = product.name
    showDropdown.value = false
    adjustmentForm.value.product_id = product.id
}

// Foco no campo
const onFocus = () => {
    if (searchTerm.value) showDropdown.value = true
}

// Desfoco
const onBlur = () => {
    setTimeout(() => (showDropdown.value = false), 100)
}
// --- Produto atual ---
const currentProduct = computed(() => {
    if (props.selectedProduct) return props.selectedProduct
    return productStore.products.find(p => p.id === adjustmentForm.value.product_id) || null
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
onMounted(() => {
    if (props.selectedProduct) {
        selectedProduct.value = props.selectedProduct
        searchTerm.value = props.selectedProduct.name
        adjustmentForm.value.product_id = props.selectedProduct.id
    }
})

watch(
    () => props.selectedProduct,
    (newProduct) => {
        if (newProduct) {
            adjustmentForm.value.product_id = newProduct.id
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

// --- Salva ajuste ---
const saveStockAdjustment = async () => {
    if (!adjustmentForm.value.product_id || !adjustmentForm.value.reason) {
        toast.warning('Preencha todos os campos obrigatórios')      
        return
    }
    try {
        // Mapeia o tipo para o que a API espera
        const typeMap = {
            add: 'in',
            remove: 'out',
            set: 'adjustment'
        }
        const payload = {
            product_id: adjustmentForm.value.product_id,          
            type: typeMap[adjustmentForm.value.type],
            quantity: adjustmentForm.value.quantity,
            description: [
                adjustmentForm.value.reason,
                adjustmentForm.value.notes ? `(${adjustmentForm.value.notes})` : ''
            ].filter(Boolean).join(' - ')
        }
        await inventoryStore.addMovement(payload)
        emit('saved')

        adjustmentForm.value = {
            product_id: '',
            type: 'add',
            quantity: 1,
            reason: '',
            notes: ''
        }
        emit('close')
    } catch (error) {
        toast.error('Preencha todos os campos obrigatórios')  
        console.error(error)
    }
}
</script>