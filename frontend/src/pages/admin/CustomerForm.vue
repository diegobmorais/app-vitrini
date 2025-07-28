<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Cliente' : 'Novo Cliente' }}</h1>
      <p class="text-gray-600">{{ isEditing ? 'Atualize as informações do cliente' : 'Cadastre um novo cliente no sistema' }}</p>
    </div>

    <form @submit.prevent="saveCustomer" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input id="name" v-model="customer.name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="document" class="block text-sm font-medium text-gray-700">CPF</label>
            <input id="document" v-model="customer.document" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" v-model="customer.email" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input id="phone" v-model="customer.phone" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Endereço</label>
            <input id="address" v-model="customer.address" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700">Cidade</label>
            <input id="city" v-model="customer.city" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700">Estado</label>
            <input id="state" v-model="customer.state" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="zip" class="block text-sm font-medium text-gray-700">CEP</label>
            <input id="zip" v-model="customer.zip" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
            <textarea id="notes" v-model="customer.notes" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
          </div>

          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">Avatar</label>
            <div class="mt-1 flex items-center">
              <div v-if="customer.avatar" class="flex-shrink-0 h-12 w-12 mr-3">
                <img :src="customer.avatar" alt="Avatar" class="h-12 w-12 rounded-full object-cover" />
              </div>
              <div v-else
                class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-gray-500 font-medium">{{ getInitials(customer.name || 'Cliente') }}</span>
              </div>
              <button type="button"
                class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Alterar
              </button>
            </div>
          </div>

          <div class="sm:col-span-6">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="active" v-model="customer.active" type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="active" class="font-medium text-gray-700">Ativo</label>
                <p class="text-gray-500">Clientes inativos não poderão fazer login ou realizar compras.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
        <router-link to="/painel-administrador/clientes"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Cancelar
        </router-link>
        <button type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/store/modules/useNotificationStore'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()
const notificationsStore = useNotificationStore()

const loading = ref(false)
const customer = ref({
  id: null,
  name: '',
  document: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  notes: '',
  avatar: null,
  active: true
})

// Detecta se está editando com base no param id
const isEditing = computed(() => !!route.params.id)

const fetchCustomer = async (id) => {
  loading.value = true
  // Simulação de API - substitua pelo fetch real
  setTimeout(() => {
    customer.value = {
      id: 1,
      name: 'Ana Silva',
      document: '123.456.789-00',
      email: 'ana.silva@email.com',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567',
      notes: 'Cliente VIP, sempre compra produtos premium para seu gato.',
      avatar: null,
      active: true
    }
    loading.value = false
  }, 500)
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const saveCustomer = async () => {
  loading.value = true
  // Simulação de API - substitua pela chamada real
  setTimeout(() => {
    loading.value = false
    notificationsStore.add({
      type: 'success',
      message: `Cliente ${isEditing.value ? 'atualizado' : 'cadastrado'} com sucesso!`
    })
    router.push('/admin/customers')
  }, 500)
}

onMounted(() => {
  if (isEditing.value) {
    fetchCustomer(route.params.id)
  }
})
</script>