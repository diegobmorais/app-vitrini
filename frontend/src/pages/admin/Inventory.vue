<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Controle de Estoque</h1>
          <p class="text-gray-600">Gerencie o estoque de produtos</p>
        </div>
        <button 
          @click="openAdjustmentModal()" 
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Ajustar Estoque
        </button>
      </div>
  
      <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div class="p-4 border-b border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div class="flex-1 mb-4 md:mb-0">
              <input 
                v-model="search" 
                type="text" 
                placeholder="Buscar produtos..." 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div class="flex space-x-4">
              <select 
                v-model="categoryFilter" 
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">Todas as categorias</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <select 
                v-model="stockFilter" 
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">Todos</option>
                <option value="low">Estoque Baixo</option>
                <option value="out">Sem Estoque</option>
              </select>
            </div>
          </div>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Atual</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Mínimo</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img v-if="product.image" :src="product.image" alt="" class="h-10 w-10 rounded-md object-cover">
                      <div v-else class="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.brand }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.sku }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getCategoryName(product.category_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStockStatusClass(product)"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.min_stock }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(product.last_updated) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="openAdjustmentModal(product)" 
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Ajustar
                  </button>
                  <button 
                    @click="viewHistory(product.id)" 
                    class="ml-3 text-gray-600 hover:text-gray-900"
                  >
                    Histórico
                  </button>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum produto encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ filteredProducts.length }}</span> de <span class="font-medium">{{ products.length }}</span> produtos
            </div>
            <div class="flex-1 flex justify-end">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <!-- Paginação aqui se necessário -->
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Resumo do Estoque -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total de Produtos
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ products.length }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Produtos em Estoque
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ inStockCount }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Estoque Baixo
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ lowStockCount }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Sem Estoque
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ outOfStockCount }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de Ajuste de Estoque -->
      <div v-if="showAdjustmentModal" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveStockAdjustment">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Ajuste de Estoque
                  </h3>
                  <p v-if="selectedProduct" class="mt-1 text-sm text-gray-500">
                    {{ selectedProduct.name }} (SKU: {{ selectedProduct.sku }})
                  </p>
                </div>
                <div class="space-y-4">
                  <div v-if="!selectedProduct">
                    <label for="product" class="block text-sm font-medium text-gray-700">Produto</label>
                    <select 
                      id="product" 
                      v-model="adjustmentForm.product_id" 
                      required 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Selecione um produto</option>
                      <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }} ({{ product.sku }})
                      </option>
                    </select>
                  </div>
  
                  <div>
                    <label for="current_stock" class="block text-sm font-medium text-gray-700">Estoque Atual</label>
                    <input 
                      id="current_stock" 
                      :value="currentStock" 
                      type="number" 
                      disabled 
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
                  </div>
  
                  <div>
                    <label for="adjustment_type" class="block text-sm font-medium text-gray-700">Tipo de Ajuste</label>
                    <select 
                      id="adjustment_type" 
                      v-model="adjustmentForm.type" 
                      required 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="add">Adicionar</option>
                      <option value="remove">Remover</option>
                      <option value="set">Definir Valor</option>
                    </select>
                  </div>
  
                  <div>
                    <label for="quantity" class="block text-sm font-medium text-gray-700">Quantidade</label>
                    <input 
                      id="quantity" 
                      v-model.number="adjustmentForm.quantity" 
                      type="number" 
                      min="1" 
                      required 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
  
                  <div>
                    <label for="reason" class="block text-sm font-medium text-gray-700">Motivo</label>
                    <select 
                      id="reason" 
                      v-model="adjustmentForm.reason" 
                      required 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Selecione um motivo</option>
                      <option value="purchase">Compra</option>
                      <option value="sale">Venda</option>
                      <option value="return">Devolução</option>
                      <option value="loss">Perda/Dano</option>
                      <option value="correction">Correção de Inventário</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
  
                  <div v-if="adjustmentForm.reason === 'other'">
                    <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
                    <textarea 
                      id="notes" 
                      v-model="adjustmentForm.notes" 
                      rows="2" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    ></textarea>
                  </div>
  
                  <div>
                    <label for="new_stock" class="block text-sm font-medium text-gray-700">Novo Estoque</label>
                    <input 
                      id="new_stock" 
                      :value="newStockPreview" 
                      type="number" 
                      disabled 
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
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
                  @click="showAdjustmentModal = false" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Modal de Histórico de Estoque -->
      <div v-if="showHistoryModal" class="fixed inset-0 z-10 overflow-y-auto">
        <!-- Conteúdo do modal de histórico -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminInventory',
    data() {
      return {
        products: [],
        categories: [],
        search: '',
        categoryFilter: '',
        stockFilter: 'all',
        loading: false,
        showAdjustmentModal: false,
        showHistoryModal: false,
        selectedProduct: null,
        adjustmentForm: {
          product_id: '',
          type: 'add',
          quantity: 1,
          reason: '',
          notes: ''
        },
        stockHistory: []
      };
    },
    computed: {
      filteredProducts() {
        let result = this.products;
        
        // Filtrar por categoria
        if (this.categoryFilter) {
          result = result.filter(product => product.category_id === this.categoryFilter);
        }
        
        // Filtrar por estoque
        if (this.stockFilter === 'low') {
          result = result.filter(product => product.stock > 0 && product.stock <= product.min_stock);
        } else if (this.stockFilter === 'out') {
          result = result.filter(product => product.stock === 0);
        }
        
        // Filtrar por termo de busca
        if (this.search) {
          const searchLower = this.search.toLowerCase();
          result = result.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower)
          );
        }
        
        return result;
      },
      inStockCount() {
        return this.products.filter(product => product.stock > product.min_stock).length;
      },
      lowStockCount() {
        return this.products.filter(product => product.stock > 0 && product.stock <= product.min_stock).length;
      },
      outOfStockCount() {
        return this.products.filter(product => product.stock === 0).length;
      },
      currentStock() {
        if (!this.selectedProduct && !this.adjustmentForm.product_id) return 0;
        
        const productId = this.selectedProduct ? this.selectedProduct.id : this.adjustmentForm.product_id;
        const product = this.products.find(p => p.id === productId);
        
        return product ? product.stock : 0;
      },
      newStockPreview() {
        const currentStock = this.currentStock;
        const quantity = this.adjustmentForm.quantity || 0;
        
        if (this.adjustmentForm.type === 'add') {
          return currentStock + quantity;
        } else if (this.adjustmentForm.type === 'remove') {
          return Math.max(0, currentStock - quantity);
        } else if (this.adjustmentForm.type === 'set') {
          return quantity;
        }
        
        return currentStock;
      }
    },
    created() {
      this.fetchProducts();
      this.fetchCategories();
    },
    methods: {
      fetchProducts() {
        this.loading = true;
        // Simulação de chamada à API
        setTimeout(() => {
          this.products = [
            {
              id: 1,
              name: 'Ração Premium para Cães',
              sku: 'RAC-001',
              category_id: '1',
              brand: 'PetFood',
              stock: 45,
              min_stock: 10,
              last_updated: '2023-06-15T10:30:00',
              image: null
            },
            {
              id: 2,
              name: 'Ração Premium para Gatos',
              sku: 'RAC-002',
              category_id: '1',
              brand: 'PetFood',
              stock: 8,
              min_stock: 10,
              last_updated: '2023-06-14T14:20:00',
              image: null
            },
            {
              id: 3,
              name: 'Brinquedo Interativo para Cães',
              sku: 'BRI-001',
              category_id: '2',
              brand: 'PetToys',
              stock: 0,
              min_stock: 5,
              last_updated: '2023-06-10T09:15:00',
              image: null
            },
            {
              id: 4,
              name: 'Coleira Ajustável',
              sku: 'ACE-001',
              category_id: '3',
              brand: 'PetCare',
              stock: 25,
              min_stock: 8,
              last_updated: '2023-06-12T16:45:00',
              image: null
            }
          ];
          this.loading = false;
        }, 500);
      },
      fetchCategories() {
        // Simulação de chamada à API
        setTimeout(() => {
          this.categories = [
            { id: '1', name: 'Alimentos' },
            { id: '2', name: 'Brinquedos' },
            { id: '3', name: 'Acessórios' }
          ];
        }, 500);
      },
      getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Sem categoria';
      },
      getStockStatusClass(product) {
        if (product.stock === 0) {
          return 'bg-red-100 text-red-800';
        } else if (product.stock <= product.min_stock) {
          return 'bg-yellow-100 text-yellow-800';
        } else {
          return 'bg-green-100 text-green-800';
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      },
      openAdjustmentModal(product = null) {
        this.selectedProduct = product;
        this.adjustmentForm = {
          product_id: product ? product.id : '',
          type: 'add',
          quantity: 1,
          reason: '',
          notes: ''
        };
        this.showAdjustmentModal = true;
      },
      viewHistory(productId) {
        this.fetchStockHistory(productId);
        this.showHistoryModal = true;
      },
      fetchStockHistory(productId) {
        // Simulação de chamada à API
        setTimeout(() => {
          this.stockHistory = [
            {
              id: 1,
              product_id: productId,
              type: 'add',
              quantity: 10,
              reason: 'purchase',
              notes: '',
              previous_stock: 35,
              new_stock: 45,
              created_at: '2023-06-15T10:30:00',
              user: 'Admin'
            },
            {
              id: 2,
              product_id: productId,
              type: 'remove',
              quantity: 5,
              reason: 'sale',
              notes: '',
              previous_stock: 40,
              new_stock: 35,
              created_at: '2023-06-14T14:20:00',
              user: 'Admin'
            }
          ];
        }, 500);
      },
      saveStockAdjustment() {
        const productId = this.selectedProduct ? this.selectedProduct.id : this.adjustmentForm.product_id;
        const product = this.products.find(p => p.id === productId);
        
        if (!product) return;
        
        const previousStock = product.stock;
        let newStock = previousStock;
        
        if (this.adjustmentForm.type === 'add') {
          newStock = previousStock + this.adjustmentForm.quantity;
        } else if (this.adjustmentForm.type === 'remove') {
          newStock = Math.max(0, previousStock - this.adjustmentForm.quantity);
        } else if (this.adjustmentForm.type === 'set') {
          newStock = this.adjustmentForm.quantity;
        }
        
        // Atualizar o estoque do produto
        product.stock = newStock;
        product.last_updated = new Date().toISOString();
        
        // Adicionar ao histórico
        this.stockHistory.unshift({
          id: Date.now(),
          product_id: productId,
          type: this.adjustmentForm.type,
          quantity: this.adjustmentForm.quantity,
          reason: this.adjustmentForm.reason,
          notes: this.adjustmentForm.notes,
          previous_stock: previousStock,
          new_stock: newStock,
          created_at: new Date().toISOString(),
          user: 'Admin'
        });
        
        this.showAdjustmentModal = false;
        this.$store.dispatch('notifications/add', {
          type: 'success',
          message: 'Estoque ajustado com sucesso!'
        });
      }
    }
  };
  </script>
  