<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
      <!-- Fundo escurecido -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Histórico de Estoque</h3>
          <p class="text-sm text-gray-600 mt-1">
            Produto: <strong>{{ product?.name }}</strong> (SKU: {{ product?.sku }})
          </p>
        </div>

        <!-- Filtros -->
        <div class="px-6 py-4 bg-white border-b border-gray-200">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="type in ['all', 'in', 'out', 'adjustment']"
              :key="type"
              @click="filterType = type"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                filterType === type
                  ? type === 'in' ? 'bg-green-100 text-green-800'
                  : type === 'out' ? 'bg-red-100 text-red-800'
                  : type === 'adjustment' ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              ]"
            >
              {{ typeLabel(type) }}
            </button>
          </div>
        </div>

        <!-- Tabela de histórico -->
        <div class="max-h-96 overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="movement in filteredMovements" :key="movement.id" class="hover:bg-gray-50">
                <td class="px-6 py-3 text-sm text-gray-900">
                  {{ formatDate(movement.created_at) }}<br>
                  <span class="text-xs text-gray-500">{{ formatTime(movement.created_at) }}</span>
                </td>
                <td class="px-6 py-3">
                  <span :class="[
                    'px-2 py-1 text-xs rounded-full font-medium',
                    movement.type === 'in' ? 'bg-green-100 text-green-800' :
                    movement.type === 'out' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ typeLabel(movement.type) }}
                  </span>
                </td>
                <td class="px-6 py-3 text-sm font-medium">
                  <span :class="movement.type === 'out' ? 'text-red-600' : 'text-green-600'">
                    {{ movement.type === 'out' ? '-' : '+' }}{{ movement.quantity }}
                  </span>
                </td>
                <td class="px-6 py-3 text-sm">
                  <div class="flex flex-col">
                    <span class="text-xs text-gray-500">Antes: {{ movement.previous_stock }}</span>
                    <span class="font-medium">→ {{ movement.new_stock }}</span>
                  </div>
                </td>
                <td class="px-6 py-3 text-sm text-gray-900">
                  {{ movement.user?.name || 'Sistema' }}
                </td>
                <td class="px-6 py-3 text-sm">
                  <div class="max-w-xs">
                    <p class="font-medium">{{ movement.reason }}</p>
                    <p v-if="movement.notes" class="text-xs text-gray-600 mt-1 italic">"{{ movement.notes }}"</p>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredMovements.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma movimentação registrada.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Rodapé -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            @click="emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// --- Props ---
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    required: true
  },
  movements: {
    type: Array,
    default: () => []
  }
})

// --- Emit ---
const emit = defineEmits(['close'])

// --- Estado ---
const filterType = ref('all')

// --- Filtros ---
const filteredMovements = computed(() => {
  if (filterType.value === 'all') return props.movements
  return props.movements.filter(m => m.type === filterType.value)
})

// --- Funções de exibição ---
const typeLabel = (type) => {
  const labels = {
    all: 'Todos',
    in: 'Entrada',
    out: 'Saída',
    adjustment: 'Ajuste'
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return '–'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const formatTime = (dateString) => {
  if (!dateString) return '–'
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>