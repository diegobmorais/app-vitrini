<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</h1>
      <p class="text-gray-600">{{ isEditing ? 'Atualize as informações do fornecedor' : 'Cadastre um novo fornecedor no sistema' }}</p>
    </div>

    <form @submit.prevent="saveSupplier" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input id="name" v-model="supplier.name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="cnpj" class="block text-sm font-medium text-gray-700">CNPJ</label>
            <input id="cnpj" v-model="supplier.cnpj" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="contact_name" class="block text-sm font-medium text-gray-700">Nome do Contato</label>
            <input id="contact_name" v-model="supplier.contact_name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" v-model="supplier.email" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input id="phone" v-model="supplier.phone" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input id="website" v-model="supplier.website" type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Endereço</label>
            <input id="address" v-model="supplier.address" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700">Cidade</label>
            <input id="city" v-model="supplier.city" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700">Estado</label>
            <input id="state" v-model="supplier.state" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="zip" class="block text-sm font-medium text-gray-700">CEP</label>
            <input id="zip" v-model="supplier.zip" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
            <textarea id="notes" v-model="supplier.notes" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
          </div>

          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">Logo</label>
            <div class="mt-1 flex items-center">
              <div v-if="supplier.logo" class="flex-shrink-0 h-12 w-12 mr-3">
                <img :src="supplier.logo" alt="Logo" class="h-12 w-12 rounded-full object-cover" />
              </div>
              <div v-else
                class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-gray-500 font-medium">{{ getInitials(supplier.name || 'Fornecedor') }}</span>
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
                <input id="active" v-model="supplier.active" type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="active" class="font-medium text-gray-700">Ativo</label>
                <p class="text-gray-500">Fornecedores inativos não aparecerão nas listagens de compra.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
        <router-link to="/painel-administrador/fornecedores"
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

const supplier = ref({
  id: null,
  name: '',
  cnpj: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  notes: '',
  logo: null,
  active: true
})

const loading = ref(false)

const isEditing = computed(() => !!route.params.id)

const fetchSupplier = (id) => {
  loading.value = true
  // Simulação de chamada à API
  setTimeout(() => {
    supplier.value = {
      id: 1,
      name: 'PetFood Distribuidora',
      cnpj: '12.345.678/0001-90',
      contact_name: 'João Silva',
      email: 'joao@petfood.com',
      phone: '(11) 98765-4321',
      website: 'https://www.petfood.com',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567',
      notes: 'Fornecedor principal de ração para cães e gatos.',
      logo: null,
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

const saveSupplier = () => {
  loading.value = true
  // Simulação de chamada à API
  setTimeout(() => {
    loading.value = false
    notificationsStore.add({
      type: 'success',
      message: `Fornecedor ${isEditing.value ? 'atualizado' : 'cadastrado'} com sucesso!`
    })
    router.push('/admin/suppliers')
  }, 500)
}

onMounted(() => {
  if (isEditing.value) {
    fetchSupplier(route.params.id)
  }
})
</script>