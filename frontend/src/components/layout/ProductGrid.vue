<template>
    <div>
      <!-- Filters and Sorting -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Category Filter -->
          <div class="flex items-center space-x-2">
            <label for="category-filter" class="text-sm font-medium text-gray-700">Categoria:</label>
            <select 
              id="category-filter" 
              v-model="selectedCategory"
              class="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              @change="filterProducts"
            >
              <option value="">Todas as Categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Sort Options -->
          <div class="flex items-center space-x-2">
            <label for="sort-options" class="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select 
              id="sort-options" 
              v-model="sortOption"
              class="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              @change="sortProducts"
            >
              <option value="featured">Destaque</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="name-asc">Nome: A-Z</option>
              <option value="name-desc">Nome: Z-A</option>
              <option value="newest">Mais Recentes</option>
            </select>
          </div>
          
          <!-- View Toggle -->
          <div class="flex items-center space-x-2">
            <button 
              @click="viewMode = 'grid'"
              class="p-2 rounded-md transition"
              :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              @click="viewMode = 'list'"
              class="p-2 rounded-md transition"
              :class="viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Products Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <product-card 
          v-for="product in displayedProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
          @quick-view="showQuickView"
        ></product-card>
      </div>
      
      <!-- Products List View -->
      <div v-else class="space-y-4">
        <product-list-item 
          v-for="product in displayedProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
          @quick-view="showQuickView"
        ></product-list-item>
      </div>
      
      <!-- Empty State -->
      <div v-if="displayedProducts.length === 0" class="bg-white p-8 rounded-lg shadow-sm text-center">
        <img src="/images/empty-state.svg" alt="Nenhum produto encontrado" class="w-32 h-32 mx-auto mb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
        <p class="text-gray-500 mb-4">Tente ajustar seus filtros ou buscar por outro termo.</p>
        <button 
          @click="resetFilters" 
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Limpar Filtros
        </button>
      </div>
      
      <!-- Pagination -->
      <div v-if="displayedProducts.length > 0" class="mt-8 flex justify-center">
        <pagination 
          :total-pages="totalPages" 
          :current-page="currentPage"
          @page-changed="changePage"
        ></pagination>
      </div>
      
      <!-- Quick View Modal -->
      <quick-view-modal 
        v-if="quickViewProduct" 
        :product="quickViewProduct"
        @close="quickViewProduct = null"
        @add-to-cart="addToCart"
      ></quick-view-modal>
    </div>
  </template>
  
  <script>
  import ProductCard from './ProductCard.vue';
  import ProductListItem from './ProductListItem.vue';
  import Pagination from './Pagination.vue';
  import QuickViewModal from './QuickViewModal.vue';
  
  export default {
    components: {
      ProductCard,
      ProductListItem,
      Pagination,
      QuickViewModal
    },
    props: {
      products: {
        type: Array,
        default: () => []
      },
      categories: {
        type: Array,
        default: () => []
      },
      itemsPerPage: {
        type: Number,
        default: 12
      }
    },
    data() {
      return {
        selectedCategory: '',
        sortOption: 'featured',
        viewMode: 'grid',
        currentPage: 1,
        quickViewProduct: null,
        filteredProducts: []
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      },
      displayedProducts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredProducts.slice(start, end);
      }
    },
    watch: {
      products: {
        immediate: true,
        handler() {
          this.filteredProducts = [...this.products];
          this.applyFiltersAndSort();
        }
      }
    },
    methods: {
      filterProducts() {
        this.currentPage = 1;
        this.applyFiltersAndSort();
      },
      sortProducts() {
        this.applyFiltersAndSort();
      },
      applyFiltersAndSort() {
        // Filter by category
        let result = [...this.products];
        
        if (this.selectedCategory) {
          result = result.filter(product => product.category_id === this.selectedCategory);
        }
        
        // Sort products
        switch (this.sortOption) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'newest':
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          default:
            // 'featured' - use the default order
            break;
        }
        
        this.filteredProducts = result;
      },
      resetFilters() {
        this.selectedCategory = '';
        this.sortOption = 'featured';
        this.currentPage = 1;
        this.filteredProducts = [...this.products];
      },
      changePage(page) {
        this.currentPage = page;
        // Scroll to top of products
        window.scrollTo({
          top: this.$el.offsetTop - 100,
          behavior: 'smooth'
        });
      },
      addToCart(product, quantity = 1) {
        // This would be replaced with an actual API call
        // Example: axios.post('/api/cart/items', { product_id: product.id, quantity })
        //   .then(response => {
        //     // Update cart data
        //   });
        
        this.$emit('add-to-cart', { product, quantity });
        
        // Show notification
        this.$toast.success(`${product.name} adicionado ao carrinho!`);
      },
      showQuickView(product) {
        this.quickViewProduct = product;
      }
    }
  }
  </script>
  