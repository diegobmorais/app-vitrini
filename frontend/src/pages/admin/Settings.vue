<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configurações</h1>
      <p class="text-gray-600">Gerencie as configurações do sistema</p>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-4 text-sm font-medium whitespace-nowrap"
            :class="activeTab === tab.id ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Categorias -->
        <div v-if="activeTab === 'categories'" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Categorias</h2>
            <button 
              @click="openCategoryModal()" 
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Nova Categoria
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
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
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ category.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="openCategoryModal(category)" 
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      @click="deleteCategory(category.id)" 
                      class="text-red-600 hover:text-red-900"
                    >
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
            <button 
              @click="openBrandModal()" 
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Nova Marca
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="brand in brands" :key="brand.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ brand.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img v-if="brand.logo" :src="brand.logo" alt="Logo" class="h-10 w-10 object-contain" />
                    <span v-else class="text-sm text-gray-500">Sem logo</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="brand.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ brand.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="openBrandModal(brand)" 
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      @click="deleteBrand(brand.id)" 
                      class="text-red-600 hover:text-red-900"
                    >
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
            <button 
              @click="openTagModal()" 
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Nova Tag
            </button>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <div 
              v-for="tag in tags" 
              :key="tag.id" 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
            >
              {{ tag.name }}
              <button 
                @click="openTagModal(tag)" 
                class="ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                @click="deleteTag(tag.id)" 
                class="ml-1 text-red-500 hover:text-red-700"
              >
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
              <textarea 
                v-model="notificationSettings.welcome" 
                rows="3" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Confirmação de Pedido</label>
              <textarea 
                v-model="notificationSettings.orderConfirmation" 
                rows="3" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Envio de Pedido</label>
              <textarea 
                v-model="notificationSettings.orderShipped" 
                rows="3" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem de Produto Fora de Estoque</label>
              <textarea 
                v-model="notificationSettings.outOfStock" 
                rows="3" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input 
                id="enableEmailNotifications" 
                v-model="notificationSettings.enableEmail" 
                type="checkbox" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="enableEmailNotifications" class="ml-2 block text-sm text-gray-900">
                Habilitar notificações por e-mail
              </label>
            </div>

            <div class="flex items-center">
              <input 
                id="enableSmsNotifications" 
                v-model="notificationSettings.enableSms" 
                type="checkbox" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="enableSmsNotifications" class="ml-2 block text-sm text-gray-900">
                Habilitar notificações por SMS
              </label>
            </div>

            <div>
              <button 
                type="submit" 
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Categoria -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveCategory">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editingCategory.id ? 'Editar Categoria' : 'Nova Categoria' }}
                </h3>
              </div>
              <div class="space-y-4">
                <div>
                  <label for="categoryName" class="block text-sm font-medium text-gray-700">Nome</label>
                  <input 
                    id="categoryName" 
                    v-model="editingCategory.name" 
                    type="text" 
                    required 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label for="categoryDescription" class="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea 
                    id="categoryDescription" 
                    v-model="editingCategory.description" 
                    rows="3" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  ></textarea>
                </div>
                <div class="flex items-center">
                  <input 
                    id="categoryActive" 
                    v-model="editingCategory.active" 
                    type="checkbox" 
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="categoryActive" class="ml-2 block text-sm text-gray-900">
                    Ativo
                  </label>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Salvar
              </button>
              <button 
                type="button" 
                @click="showCategoryModal = false" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Marca -->
    <div v-if="showBrandModal" class="fixed inset-0 z-10 overflow-y-auto">
      <!-- Conteúdo do modal de marca (similar ao de categoria) -->
    </div>

    <!-- Modal de Tag -->
    <div v-if="showTagModal" class="fixed inset-0 z-10 overflow-y-auto">
      <!-- Conteúdo do modal de tag (similar ao de categoria) -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      activeTab: 'categories',
      tabs: [
        { id: 'categories', name: 'Categorias' },
        { id: 'brands', name: 'Marcas' },
        { id: 'tags', name: 'Tags' },
        { id: 'notifications', name: 'Notificações' }
      ],
      categories: [],
      brands: [],
      tags: [],
      showCategoryModal: false,
      showBrandModal: false,
      showTagModal: false,
      editingCategory: {
        id: null,
        name: '',
        description: '',
        active: true
      },
      editingBrand: {
        id: null,
        name: '',
        logo: null,
        active: true
      },
      editingTag: {
        id: null,
        name: ''
      },
      notificationSettings: {
        welcome: 'Bem-vindo à nossa loja! Estamos felizes em tê-lo conosco.',
        orderConfirmation: 'Seu pedido foi confirmado e está sendo processado.',
        orderShipped: 'Seu pedido foi enviado e está a caminho!',
        outOfStock: 'Desculpe, este produto está temporariamente fora de estoque.',
        enableEmail: true,
        enableSms: false
      }
    };
  },
  created() {
    this.fetchCategories();
    this.fetchBrands();
    this.fetchTags();
    this.fetchNotificationSettings();
  },
  methods: {
    fetchCategories() {
      // Simulação de chamada à API
      setTimeout(() => {
        this.categories = [
          { id: 1, name: 'Alimentos', description: 'Produtos alimentícios para pets', active: true },
          { id: 2, name: 'Brinquedos', description: 'Brinquedos para pets', active: true },
          { id: 3, name: 'Acessórios', description: 'Acessórios para pets', active: false }
        ];
      }, 500);
    },
    fetchBrands() {
      // Simulação de chamada à API
      setTimeout(() => {
        this.brands = [
          { id: 1, name: 'PetFood', logo: '/images/brands/petfood.png', active: true },
          { id: 2, name: 'PetToys', logo: '/images/brands/pettoys.png', active: true },
          { id: 3, name: 'PetCare', logo: null, active: false }
        ];
      }, 500);
    },
    fetchTags() {
      // Simulação de chamada à API
      setTimeout(() => {
        this.tags = [
          { id: 1, name: 'Promoção' },
          { id: 2, name: 'Novo' },
          { id: 3, name: 'Destaque' },
          { id: 4, name: 'Limitado' }
        ];
      }, 500);
    },
    fetchNotificationSettings() {
      // Simulação de chamada à API
      // Na prática, você buscaria essas configurações do backend
    },
    openCategoryModal(category = null) {
      if (category) {
        this.editingCategory = { ...category };
      } else {
        this.editingCategory = {
          id: null,
          name: '',
          description: '',
          active: true
        };
      }
      this.showCategoryModal = true;
    },
    openBrandModal(brand = null) {
      if (brand) {
        this.editingBrand = { ...brand };
      } else {
        this.editingBrand = {
          id: null,
          name: '',
          logo: null,
          active: true
        };
      }
      this.showBrandModal = true;
    },
    openTagModal(tag = null) {
      if (tag) {
        this.editingTag = { ...tag };
      } else {
        this.editingTag = {
          id: null,
          name: ''
        };
      }
      this.showTagModal = true;
    },
    saveCategory() {
      // Simulação de salvamento
      if (this.editingCategory.id) {
        // Atualizar categoria existente
        const index = this.categories.findIndex(c => c.id === this.editingCategory.id);
        if (index !== -1) {
          this.categories.splice(index, 1, { ...this.editingCategory });
        }
      } else {
        // Criar nova categoria
        const newId = Math.max(0, ...this.categories.map(c => c.id)) + 1;
        this.categories.push({
          ...this.editingCategory,
          id: newId
        });
      }
      this.showCategoryModal = false;
      this.$store.dispatch('notifications/add', {
        type: 'success',
        message: `Categoria ${this.editingCategory.id ? 'atualizada' : 'criada'} com sucesso!`
      });
    },
    deleteCategory(id) {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        // Simulação de exclusão
        this.categories = this.categories.filter(c => c.id !== id);
        this.$store.dispatch('notifications/add', {
          type: 'success',
          message: 'Categoria excluída com sucesso!'
        });
      }
    },
    deleteBrand(id) {
      if (confirm('Tem certeza que deseja excluir esta marca?')) {
        // Simulação de exclusão
        this.brands = this.brands.filter(b => b.id !== id);
        this.$store.dispatch('notifications/add', {
          type: 'success',
          message: 'Marca excluída com sucesso!'
        });
      }
    },
    deleteTag(id) {
      if (confirm('Tem certeza que deseja excluir esta tag?')) {
        // Simulação de exclusão
        this.tags = this.tags.filter(t => t.id !== id);
        this.$store.dispatch('notifications/add', {
          type: 'success',
          message: 'Tag excluída com sucesso!'
        });
      }
    },
    saveNotificationSettings() {
      // Simulação de salvamento das configurações de notificação
      this.$store.dispatch('notifications/add', {
        type: 'success',
        message: 'Configurações de notificação salvas com sucesso!'
      });
    }
  }
};
</script>
