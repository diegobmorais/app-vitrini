<script setup>
import { useBrandStore } from '@/store/modules/useBrandStore'
import { useCategoryStore } from '@/store/modules/useCategoryStore'
import { useTagStore } from '@/store/modules/useTagStores'
import { useToast } from 'vue-toastification'
import { ref, reactive, onMounted } from 'vue'
import { useNotificationStore } from '@/store/modules/useNotificationStore'
import SettingCategoryModal from '@/components/modals/settings-modals/SettingCategoryModal.vue'
import SettingBrandModal from '@/components/modals/settings-modals/SettingBrandModal.vue'
import SettingTagsModal from '@/components/modals/settings-modals/SettingTagsModal.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'

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

const categories = ref([])
const brands = ref([])
const tags = ref([])
const notificationSettings = ref({})
const categoryNameToDelete = ref('')
const categoryIdToDelete = ref(null)
const showConfirmModal = ref(false)
const showCategoryModal = ref(false)
const showBrandModal = ref(false)
const showTagModal = ref(false)

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
const fetchCategories = async () => {
  categories.value = await categoryStore.fetchCategories()
}

const fetchBrands = async () => {
  brands.value = await brandStore.fetchBrands()
}

const fetchTags = async () => {
  tags.value = await tagStore.fetchTags()
}

const openCategoryModal = (category = null) => {
  if (category) {
    Object.assign(editingCategory, {
      id: category.id,
      name: category.name,
      description: category.description,
      featured: category.featured
    })

  } else {
    Object.assign(editingCategory, {
      id: null,
      name: '',
      description: '',
      featured: true
    })
  }

  showCategoryModal.value = true
}

const openBrandModal = (brand = null) => {
  if (brand) {
    Object.assign(editingBrand, {
      id: brand,
      name: brand,
      description: brand.description
    })
  } else {
    Object.assign(editingBrand, {
      id: null,
      name: '',
      description: ''
    })
  }
  showBrandModal.value = true
}

const openTagModal = (tag = null) => {
  if (tag) {
    Object.assign(editingTag, {
      id: tag.id,
      name: tag.name
    })
  } else {
    Object.assign(editingTag, {
      id: null,
      name: ''
    })
  }
  showTagModal.value = true
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

const confirmDelete = (category) => {
  categoryIdToDelete.value = category.id
  categoryNameToDelete.value = category.name
  showConfirmModal.value = true
}

const deleteCategoryFromDB = async () => {
  try {
    await categoryStore.deleteCategoryById(categoryIdToDelete.value)

    categories.value = categories.value.filter(c => c.id !== categoryIdToDelete.value)

    toast.success(`Categoria "${categoryNameToDelete.value}" excluída com sucesso!`)
  } catch (error) {
    toast.error('Erro ao excluir categoria. Tente novamente.')
    console.error(error)
  } finally {
    showConfirmModal.value = false
    categoryIdToDelete.value = null
  }
}

const deleteBrand = id => {

}

const deleteTag = id => {
  if (confirm('Tem certeza que deseja excluir esta tag?')) {
    tags.value = tags.value.filter(t => t.id !== id)
    toast.success('Tag excluida com sucesso!')
  }
}

const saveNotificationSettings = () => {
  toast.success('Configurações salvas com sucesso!')
}

onMounted(async () => {
  await fetchCategories()
  await fetchBrands()
  await fetchTags()
  await fetchNotifications()
})

</script>
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
            <button @click="openCategoryModal()"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Categoria
            </button>
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
                <tr v-for="category in categories" :key="category.id">
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
                    <button @click="openCategoryModal(category)" class="text-primary-600 hover:text-primary-900 mr-3">
                      Editar
                    </button>
                    <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">
                      Excluir
                    </button>
                  </td>
                </tr>
                <tr v-if="categories.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Marcas -->
        <div v-if="activeTab === 'brands'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Marcas</h2>
            <button @click="openBrandModal()"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Marca
            </button>
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
                <tr v-for="brand in brands" :key="brand.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ brand.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="brand.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ brand.active ? 'Ativo' : 'Ativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="openBrandModal(brand)" class="text-primary-600 hover:text-primary-900 mr-3">
                      Editar
                    </button>
                    <button @click="confirmDelete(category.id)" class="text-red-600 hover:text-red-900">
                      Excluir
                    </button>
                  </td>
                </tr>
                <tr v-if="brands.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma marca encontrada
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="activeTab === 'tags'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Tags</h2>
            <button @click="openTagModal()"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Nova Tag
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <div v-for="tag in tags" :key="tag.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
              {{ tag.name }}
              <button @click="openTagModal(tag)" class="ml-2 text-gray-500 hover:text-gray-700">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button @click="deleteTag(tag.id)" class="ml-1 text-red-500 hover:text-red-700">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div v-if="tags.length === 0" class="text-sm text-gray-500">
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
    <div v-if="showCategoryModal" class="fixed inset-0 overflow-y-auto">
      <SettingCategoryModal @close="showCategoryModal = false" @save="handleSaveCategory" :category="editingCategory" />
    </div>

    <!-- Modal de Marca -->
    <div v-if="showBrandModal" class="fixed inset-0 overflow-y-auto">
      <SettingBrandModal @close="showBrandModal = false" :brand="editingBrand" />
    </div>

    <!-- Modal de Tag -->
    <div v-if="showTagModal" class="fixed inset-0 overflow-y-auto">
      <SettingTagsModal @close="showTagModal = false" :tag="editingTag" />
    </div>
  </div>
  <confirm-delete-modal :is-open="showConfirmModal"
    message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
    @confirm="deleteCategoryFromDB" @cancel="showConfirmModal = false" />
</template>