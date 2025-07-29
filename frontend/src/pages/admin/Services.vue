<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gerenciar Serviços</h1>
      <button @click="openModal(null)"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Novo Serviço
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" id="search" v-model="filters.search" placeholder="Nome do serviço"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <!-- <div class="w-full md:w-48">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select id="category" v-model="filters.categoryId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todas</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div> -->
        <div class="w-full md:w-48">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
        <div class="w-full md:w-auto flex items-end">
          <button @click="resetFilters"
            class="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Services Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="service in filteredServices" :key="service.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full object-cover"
                      :src="service.image || '/placeholder.svg?height=100&width=100'" :alt="service.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ service.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">R$ {{ Number(service.price).toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ service.duration }} min</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ service.status === 'active' ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openModal(service)" class="text-blue-600 hover:text-blue-900 mr-3">
                  Editar
                </button>
                <button @click="confirmDelete(service)" class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="filteredServices.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                Nenhum serviço encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Service Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div class="p-6">
          <!-- Título e Fechar -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-800">
              {{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}
            </h3>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveService">
            <!-- Nome e Imagem lado a lado -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <!-- Nome -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" id="name" v-model="serviceForm.name"
                  class="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:ring-blue-500"
                  required>
              </div>

              <!-- Upload de Imagem com Preview -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Foto da Capa</label>
                <div class="mt-1 flex items-center space-x-4">
                  <div class="w-24 h-24 rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img v-if="previewImage" :src="previewImage" alt="Prévia" class="w-full h-full object-cover">
                    <span v-else class="text-gray-400 text-sm">Sem imagem</span>
                  </div>
                  <div>
                    <input type="file" ref="fileInputRef" @change="handleFileUpload" accept="image/*" class="hidden">
                    <button type="button" @click="openFileInput"
                      class="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Escolher
                      Imagem</button>
                    <p class="mt-1 text-xs text-gray-500">Formatos: JPG, PNG. Máx: 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Descrição -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea id="description" v-model="serviceForm.description" rows="4"
                class="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:ring-blue-500"></textarea>
            </div>

            <!-- Preço e Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" id="price" v-model="serviceForm.price" min="0" step="0.01"
                  class="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:ring-blue-500"
                  required>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <div class="mt-2 space-x-6">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="serviceForm.status" value="active"
                      class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                    <span class="ml-2 text-sm">Ativo</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="serviceForm.status" value="inactive"
                      class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                    <span class="ml-2 text-sm">Inativo</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="showModal = false"
                class="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" :disabled="isSubmitting"
                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Excluir Serviço</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Tem certeza que deseja excluir o serviço "{{ serviceToDelete?.name }}"? Esta ação não pode ser
                  desfeita.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button" @click="deleteService"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isSubmitting">
              {{ isSubmitting ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button type="button" @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useServiceStore } from '@/store/modules/useServiceStore'
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const serviceStore = useServiceStore();
const toast = useToast()

const showModal = ref(false)
const showDeleteModal = ref(false)
const isSubmitting = ref(false)
const editingService = ref(null)
const serviceToDelete = ref(null)
const previewImage = ref(null)
const fileInputRef = ref([])

const serviceForm = reactive({
  name: '',
  description: '',
  price: 0,
  image: '',
  status: 'active'
})

const filters = reactive({
  search: '',
  categoryId: '',
  status: ''
})
const services = computed(() => serviceStore.services)

const filteredServices = computed(() =>
  services.value.filter(service => {
    const matchesSearch =
      !filters.search ||
      service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesCategory = !filters.categoryId || service.categoryId === Number(filters.categoryId)

    const matchesStatus = !filters.status || service.status === filters.status

    return matchesSearch && matchesCategory && matchesStatus
  })
)

const resetFilters = () => {
  filters.search = ''
  filters.categoryId = ''
  filters.status = ''
}

const openModal = service => {
  if (service) {
    editingService.value = service
    Object.assign(serviceForm, { ...service })
  } else {
    editingService.value = null
    Object.assign(serviceForm, {
      name: '',
      description: '',
      price: 0,
      image: '',
      status: 'active'
    })
  }
  showModal.value = true
}
function openFileInput() {
  fileInputRef.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  previewImage.value = URL.createObjectURL(file)

  serviceForm.image = file
}

const saveService = async () => {
  try {
    isSubmitting.value = true

    const payload = new FormData()

    payload.append('name', serviceForm.name.toString())
    payload.append('description', serviceForm.description.toString())
    payload.append('price', parseFloat(serviceForm.price.toString()))
    payload.append('status', serviceForm.status.toString())

    if (serviceForm.image) {
      payload.append('image', serviceForm.image)
    }

    if (editingService.value) {
      await serviceStore.updateService(editingService.value.id, payload)
      toast.success('Serviço atualizado com sucesso!')
    } else {
      await serviceStore.createService(payload)
      toast.success('Serviço criado com sucesso!')
    }

    showModal.value = false
  } catch (error) {
    toast.error('Erro ao salvar serviço. Verifique os dados e tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = service => {
  serviceToDelete.value = service
  showDeleteModal.value = true
}

const deleteService = async () => {
  try {
    isSubmitting.value = true

    await serviceStore.deleteService(serviceToDelete.value.id)

    toast.success("Serviço excluído com sucesso!")

    showDeleteModal.value = false
  } catch {
    toast.error("Erro ao excluir serviço. Tente novamente.")
  } finally {
    isSubmitting.value = false
  }
}
onMounted( ()=> {
  serviceStore.fetchServices()
})
</script>