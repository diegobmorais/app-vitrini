<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Produtos</h2>
        <p class="text-gray-600 mt-1">Gerencie o catálogo de produtos da loja</p>
      </div>
      <div class="mt-4 md:mt-0">
        <router-link to="/produto/criar-produto"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Produto
        </router-link>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="search" type="text" placeholder="Buscar produtos..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <select v-model="categoryFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <select v-model="stockFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="">Todos os estoques</option>
              <option value="in_stock">Em estoque</option>
              <option value="low_stock">Estoque baixo</option>
              <option value="out_of_stock">Sem estoque</option>
            </select>

            <select v-model="sortBy"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="price_asc">Preço (menor-maior)</option>
              <option value="price_desc">Preço (maior-menor)</option>
              <option value="stock_asc">Estoque (menor-maior)</option>
              <option value="stock_desc">Estoque (maior-menor)</option>
              <option value="created_at_desc">Mais recentes</option>
              <option value="created_at_asc">Mais antigos</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Produtos -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
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
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-md object-cover" :src="product.image" :alt="product.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">SKU: {{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">R$ {{ formatNumber(product.price) }}</div>
                <div v-if="product.compare_price" class="text-xs text-gray-500 line-through">
                  R$ {{ formatNumber(product.compare_price) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.stock }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                  'bg-green-100 text-green-800': product.status === 'active',
                  'bg-yellow-100 text-yellow-800': product.status === 'draft',
                  'bg-red-100 text-red-800': product.status === 'inactive'
                }">
                  {{ getStatusText(product.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="`/admin/products/${product.id}/edit`" class="text-blue-600 hover:text-blue-900 mr-3">
                  Editar
                </router-link>
                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>

            <!-- Estado vazio -->
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="px-6 py-10 text-center">
                <div class="text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Comece adicionando um novo produto ao catálogo.
                  </p>
                  <div class="mt-6">
                    <router-link to="/produto/criar-produto"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar Produto
                    </router-link>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Anterior
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ paginationStart }}</span> a <span class="font-medium">{{
                  paginationEnd }}</span> de <span class="font-medium">{{ totalProducts }}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click="prevPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" :class="[
                  currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]">
                  {{ page }}
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Próximo</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Excluir produto
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir o produto "{{ productToDelete?.name }}"? Esta ação não pode ser
                    desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="deleteProduct" type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Excluir
            </button>
            <button @click="cancelDelete" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AdminProducts',
  data() {
    return {
      search: '',
      categoryFilter: '',
      stockFilter: '',
      sortBy: 'name_asc',
      currentPage: 1,
      perPage: 10,
      showDeleteModal: false,
      productToDelete: null,
    };
  },
  computed: {
    ...mapState({
      products: state => state.products.items,
      categories: state => state.categories.categories,
      loading: state => state.products.loading,
      totalProducts: state => state.products.total
    }),
    filteredProducts() {   
      if (!Array.isArray(this.products)) return [];

      let filtered = [...this.products];

      if (this.categoryFilter) {
        filtered = filtered.filter(p => p.category_id === this.categoryFilter);
      }

      // Aplicar filtro de busca
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower)
        );
      }

      // Aplicar filtro de categoria
      if (this.categoryFilter) {
        filtered = filtered.filter(product => product.category_id === this.categoryFilter);
      }

      // Aplicar filtro de estoque
      if (this.stockFilter) {
        switch (this.stockFilter) {
          case 'in_stock':
            filtered = filtered.filter(product => product.stock > 0);
            break;
          case 'low_stock':
            filtered = filtered.filter(product => product.stock > 0 && product.stock <= 5);
            break;
          case 'out_of_stock':
            filtered = filtered.filter(product => product.stock === 0);
            break;
        }
      }

      // Aplicar ordenação
      switch (this.sortBy) {
        case 'name_asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'stock_asc':
          filtered.sort((a, b) => a.stock - b.stock);
          break;
        case 'stock_desc':
          filtered.sort((a, b) => b.stock - a.stock);
          break;
        case 'created_at_desc':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'created_at_asc':
          filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
      }

      return filtered;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
    displayedPages() {
      const pages = [];
      const maxPagesToShow = 5;

      if (this.totalPages <= maxPagesToShow) {
        // Mostrar todas as páginas se houver menos que o máximo
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Lógica para mostrar páginas com elipses
        if (this.currentPage <= 3) {
          // Caso 1: Página atual próxima ao início
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (this.currentPage >= this.totalPages - 2) {
          // Caso 2: Página atual próxima ao fim
          for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          // Caso 3: Página atual no meio
          for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }

      return pages;
    },
    paginationStart() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    paginationEnd() {
      const end = this.currentPage * this.perPage;
      return end > this.filteredProducts.length ? this.filteredProducts.length : end;
    }
  },
  methods: {
    ...mapActions({
      fetchProducts: 'products/fetchProducts',
      fetchCategories: 'categories/fetchCategories',
      removeProduct: 'products/removeProduct'
    }),
    formatNumber(value) {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    getStatusText(status) {
      const statusMap = {
        'active': 'Ativo',
        'draft': 'Rascunho',
        'inactive': 'Inativo'
      };
      return statusMap[status] || status;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.productToDelete = null;
    },
    deleteProduct() {
      if (this.productToDelete) {
        this.removeProduct(this.productToDelete.id)
          .then(() => {
            this.$store.dispatch('notifications/add', {
              type: 'success',
              message: `Produto "${this.productToDelete.name}" excluído com sucesso!`
            });
          })
          .catch(error => {
            this.$store.dispatch('notifications/add', {
              type: 'error',
              message: `Erro ao excluir produto: ${error.message}`
            });
          })
          .finally(() => {
            this.showDeleteModal = false;
            this.productToDelete = null;
          });
      }
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();    
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    categoryFilter() {
      this.currentPage = 1;
    },
    stockFilter() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    }
  }
};
</script>