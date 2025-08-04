<template>
  <div v-if="customer" class="max-w-6xl mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-8">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div v-if="customer.avatar" class="h-16 w-16 rounded-full overflow-hidden">
              <img :src="customer.avatar" alt="Avatar" class="h-16 w-16 object-cover" />
            </div>
            <div v-else class="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-500 font-medium text-lg">{{ getInitials(customer.name) }}</span>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h1>
            <p class="text-gray-600">{{ customer.email }}</p>
            <div class="flex items-center mt-1">
              <span :class="[
                'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                customer.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ customer.status ? 'Ativo' : 'Inativo' }}
              </span>
              <span class="ml-3 text-sm text-gray-500">Cadastro: {{ formatDate(customer.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Abas -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.key
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
            {{ tab.label }}
            <span v-if="tab.count !== undefined"
              class="ml-1 bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Conteúdo das Abas -->
      <div class="p-6">

        <!-- Aba: Informações Pessoais -->
        <div v-show="activeTab === 'personal'">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Informações Pessoais</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">CPF</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ customer.document }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Telefone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ customer.phone }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Endereço</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ customer.address }}, {{ customer.number }}<br>
                {{ customer.neighborhood }}<br>
                {{ customer.city }} - {{ customer.state }}, {{ customer.zip }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Data de Nascimento</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(customer.birth_day) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Gênero</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ customer.gender || 'Não informado' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Aba: Pets (Relevante para Petshop!) -->
        <div v-show="activeTab === 'pets'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Pets Cadastrados</h3>
            <button class="text-sm text-primary-600 hover:text-primary-800 font-medium">
              + Adicionar Pet
            </button>
          </div>
          <div v-if="pets.length > 0" class="space-y-4">
            <div v-for="pet in pets" :key="pet.id" class="border rounded-lg p-4 bg-gray-50">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-500">{{ pet.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ pet.name }}</h4>
                  <p class="text-sm text-gray-600">{{ pet.species }} • {{ pet.breed }} • {{ pet.age }} anos</p>
                </div>
                <span :class="[
                  'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                  pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ pet.vaccinated ? 'Vacinas OK' : 'Pendente' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Nenhum pet cadastrado ainda.
          </div>
        </div>

        <!-- Aba: Histórico de Compras -->
        <div v-show="activeTab === 'orders'">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Histórico de Compras</h3>
          <div v-if="orders.length > 0" class="space-y-4">
            <div v-for="order in orders" :key="order.id" class="border rounded-lg p-4">
              <div class="flex justify-between">
                <div>
                  <p class="font-medium text-gray-900">Pedido #{{ order.id }}</p>
                  <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
                  <p class="text-sm text-gray-600">{{ order.items_count }} itens</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">R$ {{ order.total.toFixed(2) }}</p>
                  <span :class="[
                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium mt-1',
                    order.status === 'entregue' ? 'bg-green-100 text-green-800' :
                      order.status === 'enviado' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ orderStatusLabel(order.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Nenhuma compra realizada.
          </div>
        </div>

        <!-- Aba: Favoritos -->
        <div v-show="activeTab === 'favorites'">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Produtos Favoritos</h3>
          <div v-if="favorites.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="product in favorites" :key="product.id" class="border rounded-lg overflow-hidden">
              <img :src="product.image" :alt="product.name" class="h-24 w-full object-cover">
              <div class="p-3">
                <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                <p class="text-sm text-gray-600">R$ {{ product.price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Nenhum produto favoritado.
          </div>
        </div>

        <!-- Aba: Observações -->
        <div v-show="activeTab === 'notes'">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Observações Internas</h3>
          <textarea v-model="internalNotes" rows="6"
            placeholder="Adicione observações internas sobre este cliente (ex: preferências, reclamações, histórico de atendimento)"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
          <div class="mt-4 text-right">
            <button @click="saveNotes"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              Salvar Observações
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useCustomerStore } from '@/store/modules/useCustomerStore'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Estado
const pets = ref([])
const orders = ref([])
const favorites = ref([])
const internalNotes = ref('')
const activeTab = ref('personal')
const customerStore = useCustomerStore()

const customerId = computed(() => route.params.id)
const customer = computed(() => customerStore.currentCustomer)
// Abas dinâmicas
const tabs = computed(() => [
  { key: 'personal', label: 'Informações' },
  { key: 'pets', label: 'Pets', count: pets.value.length },
  { key: 'orders', label: 'Compras', count: orders.value.length },
  { key: 'favorites', label: 'Favoritos', count: favorites.value.length },
  { key: 'notes', label: 'Observações' }
])

// Formatação
const getInitials = (name) => {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || 'C'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR')
}

const orderStatusLabel = (status) => {
  const labels = {
    'pendente': 'Pendente',
    'pago': 'Pago',
    'enviado': 'Enviado',
    'entregue': 'Entregue',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

const fetchPets = async () => {
  pets.value = [
    { id: 1, name: 'Luna', species: 'Cachorro', breed: 'Poodle', age: 3, vaccinated: true },
    { id: 2, name: 'Miau', species: 'Gato', breed: 'Persa', age: 2, vaccinated: false }
  ]
}

const fetchOrders = async () => {
  orders.value = [
    { id: 1001, total: 189.90, items_count: 3, status: 'entregue', created_at: '2025-04-10T14:20:00Z' },
    { id: 998, total: 85.50, items_count: 2, status: 'enviado', created_at: '2025-03-28T09:15:00Z' }
  ]
}

const fetchFavorites = async () => {
  favorites.value = [
    { id: 1, name: 'Ração Premium para Cães', price: 149.90, image: '/images/ração.jpg' },
    { id: 5, name: 'Brinquedo de Corda', price: 24.90, image: '/images/brinquedo.jpg' }
  ]
}

const fetchNotes = async () => {
  // Já carregado em internalNotes
}

// Carregar dados
onMounted(async () => {
  if (customerId.value){
    await customerStore.fetchCustomerById(customerId.value)   
  }
  

  await Promise.all([
    fetchPets(),
    fetchOrders(),
    fetchFavorites(),
    fetchNotes()
  ])
})
</script>