<template>
    <div v-if="showAdjustmentModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0">
            <!-- Fundo escurecido -->
            <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity" @click="emit('close')"></div>

            <!-- Espaçador invisível -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Conteúdo do modal -->
            <div
                class="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full scale-100 opacity-100 duration-300 ease-in-out">
                <form @submit.prevent="saveStockAdjustment" class="divide-y divide-gray-100">
                    <!-- Cabeçalho -->
                    <div class="px-6 pt-6 pb-4">
                        <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            Ajuste de Estoque
                        </h3>
                        <p v-if="selectedProduct" class="mt-1 text-sm text-gray-600">
                            {{ selectedProduct.name }} <span class="text-gray-400 text-xs">(SKU: {{ selectedProduct.sku
                            }})</span>
                        </p>
                    </div>

                    <!-- Corpo do formulário -->
                    <div class="px-6 py-5 space-y-5">
                        <!-- Campo de busca de produto -->
                        <div class="relative">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                            <input v-model="searchTerm" type="text" @focus="onFocus" @onblur="onBlur"
                                placeholder="Buscar produto por nome ou SKU..."
                                class="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />

                            <!-- Dropdown de resultados -->
                            <ul v-if="showDropdown && searchResults.length > 0"
                                class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <li v-for="product in searchResults" :key="product.id"
                                    @mousedown="selectProduct(product)" @click="selectProduct(product)"
                                    class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between transition-colors duration-150">
                                    <span class="font-medium text-gray-900 text-sm">{{ product.name }}</span>
                                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {{ product.sku }}
                                    </span>
                                </li>
                            </ul>

                            <!-- Mensagem sem resultados -->
                            <div v-else-if="showDropdown && searchResults.length === 0"
                                class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-gray-500 text-sm">
                                Nenhum produto encontrado.
                            </div>
                        </div>

                        <!-- Estoque Atual -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                            <input :value="currentStock" type="number" disabled
                                class="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" />
                        </div>

                        <!-- Tipo de Ajuste -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Ajuste</label>
                            <select v-model="adjustmentForm.type" required
                                class="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="" disabled selected>Selecione o tipo de ajuste</option>
                                <option value="add">Adicionar</option>
                                <option value="remove">Remover</option>
                                <option value="set">Ajustar Valor</option>
                            </select>
                        </div>

                        <!-- Quantidade -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input v-model.number="adjustmentForm.quantity" type="number" min="1" required
                                class="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <!-- Motivo -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                            <select v-model="adjustmentForm.reason" required
                                class="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Selecione um motivo</option>
                                <option value="Compra">Compra</option>
                                <option value="Venda">Venda</option>
                                <option value="Devolução">Devolução</option>
                                <option value="Perda/Dano">Perda/Dano</option>
                                <option value="Correção de Inventário">Correção de Inventário</option>
                                <option value="Outros">Outro</option>
                            </select>
                        </div>

                        <!-- Observações -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea v-model="adjustmentForm.notes" rows="2"
                                class="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>

                        <!-- Novo Estoque (prévia) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Novo Estoque</label>
                            <input :value="newStockPreview" type="number" disabled
                                class="w-full rounded-xl border-gray-200 bg-gray-50 text-gray-700 shadow-sm" />
                        </div>
                    </div>

                    <!-- Rodapé com botões -->
                    <div class="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2">
                        <button type="button" @click="emit('close')"
                            class="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-150 shadow-sm">
                            Salvar
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
const emit = defineEmits(['close'])

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
const onBlur = () => {   
    setTimeout(() => {
        showDropdown.value = false
    }, 150);
}
const onFocus = () => {
    showDropdown.value = true
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
            description: adjustmentForm.value.reason,
            observation: adjustmentForm.value.notes
        }
        await inventoryStore.addMovement(payload)      

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