<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configurações</h1>
      <p class="text-gray-600">Gerencie as configurações do sistema</p>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="px-6 py-4 text-sm font-medium whitespace-nowrap"
            :class="activeTab === tab.id ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Categorias -->
        <div v-if="activeTab === 'categories'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Categorias</h2>
            <button @click="openModal('category')"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Categoria
            </button>
          </div>
          <!-- Campo de busca -->
          <div class="mb-4">
            <input v-model="categorySearch" type="text" placeholder="Buscar categoria..."
              class="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="category in categoryStore.categories" :key="category.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-500">{{ category.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="category.featured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ category.featured ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="openModal('category', category)"
                      class="text-primary-600 hover:text-primary-900 mr-3">
                      Editar
                    </button>
                    <button @click="confirmDeleteCategory(category)" class="text-red-600 hover:text-red-900">
                      Excluir
                    </button>
                  </td>
                </tr>
                <tr v-if="categoryStore.categoriesCount === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginação -->
          <Pagination :current-page="categoryPage" :total-pages="categoryStore.lastPage"
            :total="categoryStore.totalCategories" @page-changed="categoryPage = $event" />
        </div>

        <!-- Marcas -->
        <div v-if="activeTab === 'brands'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Marcas</h2>
            <button @click="openModal('brand')"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Marca
            </button>
          </div>
          <!-- Campo de busca -->
          <div class="mb-4">
            <input v-model="brandSearch" type="text" placeholder="Buscar marca..."
              class="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="brand in brandStore.brands" :key="brand.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ brand.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="brand.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-green-800'">
                      {{ brand.active ? 'Ativo' : 'Ativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="openModal('brand', brand)" class="text-primary-600 hover:text-primary-900 mr-3">
                      Editar
                    </button>
                    <button @click="confirmDeleteBrand(brand)" class="text-red-600 hover:text-red-900">
                      Excluir
                    </button>
                  </td>
                </tr>
                <tr v-if="brandStore.brandCount === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma marca encontrada
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginação -->
          <Pagination :current-page="brandPage" :total-pages="brandStore.lastPage"
            :total="brandStore.totalBrands" @page-changed="brandPage = $event" />
        </div>

        <!-- Tags -->
        <div v-if="activeTab === 'tags'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Tags</h2>
            <button @click="openModal('tag')"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Tag
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <div v-for="tag in tagStore.tags" :key="tag.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
              {{ tag.name }}
              <button @click="openModal('tag', tag)" class="ml-2 text-gray-500 hover:text-gray-700">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button @click="confirmDeleteTag(tag)" class="ml-1 text-red-500 hover:text-red-700">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div v-if="tagStore.tagCount === 0" class="text-sm text-gray-500">
              Nenhuma tag encontrada
            </div>
          </div>
        </div>

        <!-- Notificações -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <div class="mb-4">
            <h2 class="text-lg font-medium">Configurações de Notificações</h2>
            <p class="text-sm text-gray-500">Configure as mensagens de notificação do sistema</p>
          </div>

          <form @submit.prevent="saveNotificationSettings" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Boas-vindas</label>
              <textarea v-model="notificationSettings.welcome" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Confirmação de Pedido</label>
              <textarea v-model="notificationSettings.orderConfirmation" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Envio de Pedido</label>
              <textarea v-model="notificationSettings.orderShipped" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Produto Fora de Estoque</label>
              <textarea v-model="notificationSettings.outOfStock" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
            </div>

            <div class="flex items-center">
              <input id="enableEmailNotifications" v-model="notificationSettings.enableEmail" type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label for="enableEmailNotifications" class="ml-2 block text-sm text-gray-900">
                Habilitar notificações por e-mail
              </label>
            </div>

            <div class="flex items-center">
              <input id="enableSmsNotifications" v-model="notificationSettings.enableSms" type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label for="enableSmsNotifications" class="ml-2 block text-sm text-gray-900">
                Habilitar notificações por SMS
              </label>
            </div>

            <div>
              <button type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal de Categoria -->
    <div v-if="isModalOpen('category')" class="fixed inset-0 overflow-y-auto">
      <SettingCategoryModal @close="closeModal" @save="handleSaveCategory" :category="editingCategory" />
    </div>

    <!-- Modal de Marca -->
    <div v-if="isModalOpen('brand')" class="fixed inset-0 overflow-y-auto">
      <SettingBrandModal @close="closeModal" @save="handleSaveBrand" :brand="editingBrand" />
    </div>

    <!-- Modal de Tag -->
    <div v-if="isModalOpen('tag')" class="fixed inset-0 overflow-y-auto">
      <SettingTagsModal @close="closeModal" @save="handleSaveTag" :tag="editingTag" />
    </div>
  </div>
  <confirm-delete-modal :is-open="showConfirmModal"
    :message="`Tem certeza que deseja excluir ${getDeleteItemType()} '${deleteTarget.name}'? Esta ação não pode ser desfeita.`"
    @confirm="handleDelete" @cancel="showConfirmModal = false" />
</template>
<script setup>
import { useBrandStore } from '@/store/modules/useBrandStore'
import { useCategoryStore } from '@/store/modules/useCategoryStore'
import { useTagStore } from '@/store/modules/useTagStore'
import { useToast } from 'vue-toastification'
import { ref, reactive, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/store/modules/useNotificationStore'
import SettingCategoryModal from '@/components/modals/settings-modals/SettingCategoryModal.vue'
import SettingBrandModal from '@/components/modals/settings-modals/SettingBrandModal.vue'
import SettingTagsModal from '@/components/modals/settings-modals/SettingTagsModal.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import { usePaginationStore } from '@/store/modules/usePaginationStore'
import Pagination from '@/components/ui/Pagination.vue'


const toast = useToast()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const tagStore = useTagStore()
const notificationStore = useNotificationStore()

const activeTab = ref('categories')
const tabs = [
  { id: 'categories', name: 'Categorias' },
  { id: 'brands', name: 'Marcas' },
  { id: 'tags', name: 'Tags' },
  { id: 'notifications', name: 'Notificações' }
]

// Filtros
const categoryPagination = usePaginationStore(() => categoryStore.categories, 'name')
const brandPagination = usePaginationStore(() => brandStore.brands, 'name')

// Desestruture com nomes claros
const {
  search: categorySearch,
  page: categoryPage,
  paginated: paginatedCategories,
  totalPages: categoryTotalPages
} = categoryPagination

const {
  search: brandSearch,
  page: brandPage,
  paginated: paginatedBrands,
  totalPages: brandTotalPages
} = brandPagination

watch([categorySearch, categoryPage], async ([search, page]) => {
  await categoryStore.fetchCategories(categoryPage.value, 10, categorySearch.value)
})

watch([brandSearch, brandPage], async ([search, page]) => {
  await brandStore.fetchBrands(brandPage.value, 10, brandSearch.value)
})
// Modais
const modalOpen = ref(null)
const categories = ref([])
const brands = ref([])
const tags = ref([])
const notificationSettings = ref({})
const showConfirmModal = ref(false)
const deleteTarget = ref({ type: null, id: null, name: null })

const isModalOpen = (type) => modalOpen.value === type

const editingCategory = reactive({
  id: null,
  name: '',
  description: '',
  featured: true
})

const editingBrand = reactive({
  id: null,
  name: '',
  description: ''
})

const editingTag = reactive({
  id: null,
  name: ''
})

const fetchNotifications = async () => {
  notificationSettings.value = await notificationStore.addNotification()
}


function openModal(type, data = null) {
  if (type === 'category') {
    if (data) {
      Object.assign(editingCategory, {
        id: data.id,
        name: data.name,
        description: data.description,
        featured: data.featured
      })
    } else {
      Object.assign(editingCategory, {
        id: null,
        name: '',
        description: '',
        featured: true
      })
    }
  }

  if (type === 'brand') {
    if (data) {
      Object.assign(editingBrand, {
        id: data.id,
        name: data.name,
        description: data.description
      })
    } else {
      Object.assign(editingBrand, {
        id: null,
        name: '',
        description: ''
      })
    }
  }

  if (type === 'tag') {
    if (data) {
      Object.assign(editingTag, {
        id: data.id,
        name: data.name
      })
    } else {
      Object.assign(editingTag, {
        id: null,
        name: ''
      })
    }
  }

  modalOpen.value = type
}
function closeModal() {
  modalOpen.value = null
}

const handleSaveCategory = async (savedCategory) => {
  try {
    const categoryId = savedCategory.id ? Number(savedCategory.id) : null

    if (categoryId) {
      const response = await categoryStore.updateCategory(categoryId, {
        ...savedCategory,
      })
      const updatedCategory = response.category

      if (updatedCategory) {
        const index = categories.value.findIndex(c => c.id === categoryId)
        if (index !== -1) {
          categories.value.splice(index, 1, { ...updatedCategory })
        }
        categories.value = [...categories.value]
        toast.success(`Categoria "${updatedCategory.name}" atualizada!`)
      }
    } else {
      const response = await categoryStore.createCategory(savedCategory)
      const newCategory = response.category

      categories.value.push(newCategory)
      categories.value = [...categories.value]

      toast.success(`Categoria "${newCategory.name}" criada!`)
    }
  } catch (error) {
    const action = savedCategory.id ? 'atualizar' : 'criar'
    toast.error(`Erro ao ${action} categoria: ${error.message || 'Tente novamente'}`)
    console.error(error)
  }
}

const handleSaveBrand = async (data) => {
  try {
    const brandId = data.id ? Number(data.id) : null

    if (brandId) {
      const response = await brandStore.updateBrand(brandId, {
        ...data,
      })
      const updatedBrand = response.brand

      if (updatedBrand) {
        const index = brands.value.findIndex(b => b.id === brandId)
        if (index !== -1) {
          brands.value.splice(index, 1, { ...updatedBrand })

          toast.success(`Marca "${updatedBrand.name}" atualizada!`)
        }
      }
    } else {
      const response = await brandStore.createBrand(data)

      const newBrand = response.brand

      brands.value.push(newBrand)
      categories.value = [...categories.value]

      toast.success(`Marca "${newBrand.name}" criada!`)
    }
  } catch (error) {
    const action = data.id ? 'atualizar' : 'criar'
    toast.error(`Erro ao ${action} marca: ${error.message || 'Tente novamente'}`)
    console.error(error)
  }
}

const handleSaveTag = async (savedTag) => {
  try {
    const tagId = savedTag.id ? Number(savedTag.id) : null

    if (tagId) {
      const response = await tagStore.updateTag(tagId, {
        ...savedTag,
      })
      const updatedTag = response.tag

      if (updatedTag) {
        const index = tags.value.findIndex(t => t.id === tagId)
        if (index !== -1) {
          tags.value.splice(index, 1, { ...updatedTag })

          toast.success(`Tag "${updatedTag.name}" atualizada!`)
        }
      }
    } else {
      const response = await tagStore.createTag(savedTag)
      const newTag = response.tag

      toast.success(`Tag "${newTag.name}" criada!`)
      tags.value.push(newTag)
    }
  } catch (error) {
    const action = savedTag.id ? 'atualizar' : 'criar'
    toast.error(`Erro ao ${action} tag: ${error.message || 'Tente novamente'}`)
    console.error(error)
  }
}

const confirmDeleteCategory = (category) => {
  deleteTarget.value = {
    type: 'category',
    id: category.id,
    name: category.name
  }
  showConfirmModal.value = true
}

const confirmDeleteBrand = (brand) => {
  deleteTarget.value = {
    type: 'brand',
    id: brand.id,
    name: brand.name
  }
  showConfirmModal.value = true
}

const confirmDeleteTag = (tag) => {
  deleteTarget.value = {
    type: 'tag',
    id: tag.id,
    name: tag.name
  }
  showConfirmModal.value = true
}
const handleDelete = async () => {
  try {
    if (deleteTarget.value.type === 'category') {
      await categoryStore.deleteCategory(deleteTarget.value.id)
      toast.success(`Categoria "${deleteTarget.value.name}" deletada!`)

    } else if (deleteTarget.value.type === 'brand') {
      await brandStore.deleteBrand(deleteTarget.value.id)
      toast.success(`Marca "${deleteTarget.value.name}" deletada!`)

    } else if (deleteTarget.value.type === 'tag') {
      await tagStore.deleteTag(deleteTarget.value.id)
      toast.success(`Tag "${deleteTarget.value.name}" deletada!`)
    }
  } catch (error) {
    toast.error(`Erro ao deletar ${deleteTarget.value.type}: ${error.message || 'Tente novamente'}`)
    console.error(error)
  }
  showConfirmModal.value = false
}

const getDeleteItemType = () => {
  const types = {
    category: 'a categoria',
    brand: 'a marca',
    tag: 'a tag'
  }
  return types[deleteTarget.value.type] || 'este item'
}

const saveNotificationSettings = () => {
  toast.success('Configurações salvas com sucesso!')
}

onMounted(async () => {
  await categoryStore.fetchCategories(1, 10, '')
  await brandStore.fetchBrands(1, 10, '')
  await tagStore.fetchTags()
  await fetchNotifications()
})

</script>