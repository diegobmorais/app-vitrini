<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</h1>
      <router-link to="/painel-administrador/fornecedores"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </router-link>
    </div>

    <form @submit.prevent="saveSupplier" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input id="name" v-model="form.company_name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>
          <p v-if="formErrors.company_name"
            class="mt-1 text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md shadow-sm">
            <span class="font-semibold">Erro:</span> {{ formErrors.company_name[0] }}
          </p>
          <div class="sm:col-span-3">
            <label for="cnpj" class="block text-sm font-medium text-gray-700">CNPJ</label>
            <input id="cnpj" v-model="form.cnpj" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>
          <p v-if="formErrors.cnpj"
            class="mt-1 text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md shadow-sm">
            <span class="font-semibold">Erro:</span> {{ formErrors.cnpj[0] }}
          </p>

          <div class="sm:col-span-3">
            <label for="contact_name" class="block text-sm font-medium text-gray-700">Nome do Contato</label>
            <input id="contact_name" v-model="form.contact_name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" v-model="form.email" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input id="phone" v-model="form.phone" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>
          <p v-if="formErrors.phone"
            class="mt-1 text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md shadow-sm">
            <span class="font-semibold">Erro:</span> {{ formErrors.phone[0] }}
          </p>
          <div class="sm:col-span-3">
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input id="website" v-model="form.website" type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Endereço</label>
            <input id="address" v-model="form.address" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="city" class="block text-sm font-medium text-gray-700">Cidade</label>
            <input id="city" v-model="form.city" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700">Estado</label>
            <input id="state" v-model="form.state" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-2">
            <label for="zipcode" class="block text-sm font-medium text-gray-700">CEP</label>
            <input id="zipcode" v-model="form.zipcode" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          </div>

          <div class="sm:col-span-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
            <textarea id="notes" v-model="form.notes" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
          </div>

          <!-- <div class="sm:col-span-6">
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
          </div> -->

          <div class="sm:col-span-6">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="status" v-model="form.status" type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="status" class="font-medium text-gray-700">Ativo</label>
                <p class="text-gray-500">Fornecedores inativos não aparecerão nas listagens de compra.</p>
              </div>
              <p v-if="formErrors.status"
                class="mt-1 text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md shadow-sm">
                <span class="font-semibold">Erro:</span> {{ formErrors.status[0] }}
              </p>
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
import { useSupplierStore } from '@/store/modules/useSupplierStore'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const suppliersStore = useSupplierStore()
const formErrors = ref({})
const form = ref({
  company_name: '',
  cnpj: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  notes: '', 
})
const isEditing = computed(() => !!route.params.id)
const supplierStore = useSupplierStore()

async function saveSupplier() {
  formErrors.value = {}

  const payload = {
    ...form.value,
  }
  console.log('payload antes do envio', payload);
  
  try {
    if (isEditing.value) {
      await supplierStore.updateSupplier({
        id: form.value.id,
        data: payload
      })
      toast.success(`Fornecedor "${form.value.company_name}" atualizado com sucesso!`)
    } else {
      console.log('payload form', payload);
      
      await supplierStore.createSupplier(payload)
      toast.success(`Fornecedor "${form.value.company_name}" criado com sucesso!`)
    }
    router.push('/painel-administrador/fornecedores')
  } catch (error) {
    console.error('Erro capturado:', error)
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors
      toast.error('Por favor, corrija os erros do formulário.')
    } else {
      toast.error('Erro ao salvar Fornecedor!')
    }
  }
}

onMounted(async () => {
  suppliersStore.fetchSuppliers()

  if (route.params.id) {
    isEditing.value = true
    const data = await suppliersStore.fetchSupplier(route.params.id)
    if (data) {
      form.value = { ...data }
    }
  }
})

</script>