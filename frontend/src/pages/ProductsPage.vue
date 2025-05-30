<template>
  <div class="products-page py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Produtos</h1>
        <p class="text-gray-600">Encontre os melhores produtos para o seu pet</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-semibold mb-4">Filtros</h2>

            <!-- Search -->
            <div class="mb-6">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div class="relative">
                <input type="text" id="search" v-model="filters.search" placeholder="Buscar produtos..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button v-if="filters.search" @click="filters.search = ''"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span class="sr-only">Limpar busca</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-900 mb-2">Categorias</h3>
              <div class="space-y-2">
                <div v-for="category in categories" :key="category.id" class="flex items-center">
                  <input type="checkbox" :id="`category-${category.id}`" :value="category.id"
                    v-model="filters.categories"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label :for="`category-${category.id}`" class="ml-2 text-sm text-gray-700">
                    {{ category.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-900 mb-2">Faixa de Preço</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="min-price" class="block text-xs text-gray-500 mb-1">Mínimo</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input type="number" id="min-price" v-model="filters.minPrice" min="0"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label for="max-price" class="block text-xs text-gray-500 mb-1">Máximo</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input type="number" id="max-price" v-model="filters.maxPrice" min="0"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Ratings -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-900 mb-2">Avaliações</h3>
              <div class="space-y-2">
                <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center">
                  <input type="radio" :id="`rating-${rating}`" :value="rating" v-model="filters.rating" name="rating"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <label :for="`rating-${rating}`" class="ml-2 text-sm text-gray-700 flex items-center">
                    <div class="flex text-amber-400">
                      <span v-for="i in 5" :key="i">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                          :class="{ 'fill-current': i <= rating, 'text-gray-300': i > rating }" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    </div>
                    <span class="ml-1">ou mais</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-900 mb-2">Disponibilidade</h3>
              <div class="flex items-center">
                <input type="checkbox" id="in-stock" v-model="filters.inStock"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label for="in-stock" class="ml-2 text-sm text-gray-700">
                  Apenas itens em estoque
                </label>
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="flex space-x-2">
              <button @click="applyFilters"
                class="flex-grow py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Aplicar
              </button>
              <button @click="resetFilters"
                class="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
                Limpar
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <!-- Sorting and View Options -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="text-sm text-gray-500">
              Mostrando <span class="font-medium">{{ filteredProducts.length }}</span> produtos
            </div>

            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <label for="sort" class="text-sm text-gray-700 mr-2">Ordenar por:</label>
                <select id="sort" v-model="sortOption"
                  class="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                  <option value="newest">Mais Recentes</option>
                </select>
              </div>

              <div class="flex items-center space-x-2">
                <button @click="viewMode = 'grid'"
                  :class="{ 'text-blue-600': viewMode === 'grid', 'text-gray-400': viewMode !== 'grid' }"
                  class="p-1 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button @click="viewMode = 'list'"
                  :class="{ 'text-blue-600': viewMode === 'list', 'text-gray-400': viewMode !== 'list' }"
                  class="p-1 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="filteredProducts.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p class="text-gray-600 mb-4">Tente ajustar seus filtros ou buscar por outro termo.</p>
            <button @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Limpar filtros
            </button>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <product-card v-for="product in paginatedProducts" :key="product.id" :product="product" />
          </div>

          <!-- List View -->
          <div v-else class="space-y-6">
            <div v-for="product in paginatedProducts" :key="product.id"
              class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
              <div class="sm:w-1/3 relative">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                <div v-if="product.discount > 0"
                  class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{{ product.discount }}%
                </div>
                <div v-if="product.isNew"
                  class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Novo
                </div>
              </div>
              <div class="p-4 flex-grow flex flex-col">
                <div class="flex-grow">
                  <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
                  <div class="flex items-center mb-2">
                    <div class="flex text-amber-400">
                      <span v-for="i in 5" :key="i">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                          :class="{ 'fill-current': i <= Math.floor(product.rating), 'text-gray-300': i > Math.floor(product.rating) }"
                          viewBox="0 0 20 20" fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    </div>
                    <span class="ml-1 text-sm text-gray-600">{{ product.rating }}</span>
                  </div>
                  <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description || 'Descrição não disponível.' }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div v-if="product.discount > 0" class="flex items-center">
                      <span class="text-lg font-bold text-gray-900">
                        R$ {{ ((product.price * (100 - product.discount)) / 100).toFixed(2) }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500 line-through">
                        R$ {{ product.price.toFixed(2) }}
                      </span>
                    </div>
                    <div v-else class="text-lg font-bold text-gray-900">
                      R$ {{ product.price.toFixed(2) }}
                    </div>
                  </div>
                  <button @click="addToCart(product)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                class="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                Anterior
              </button>

              <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="{
                'bg-blue-600 text-white': currentPage === page,
                'bg-white text-gray-700 hover:bg-gray-50': currentPage !== page
              }" class="px-3 py-1 rounded-md border border-gray-300">
                {{ page }}
              </button>

              <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                class="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/shop/ProductCard.vue';
import axios from 'axios';

export default {
  name: 'ProductsPage',
  components: {
    ProductCard
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // View mode (grid or list)
    const viewMode = ref('grid');

    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = ref(9);

    // Sorting
    const sortOption = ref('relevance');

    // Filters
    const filters = ref({
      search: '',
      categories: [],
      minPrice: null,
      maxPrice: null,
      rating: null,
      inStock: false
    });

    // Products data
    const products = ref([]);

    // Categories data
    const categories = ref([]);

    const fetchProducts = async () => {
      try {
        const response = await axios.get('product');   
        products.value = response.data;      
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('category');    
        categories.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    // Filter products based on current filters
    const filteredProducts = computed(() => {
      let result = [...products.value];

      // Search filter
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase();
        result = result.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm))
        );
      }

      // Category filter
      if (filters.value.categories.length > 0) {
        result = result.filter(product =>
          filters.value.categories.includes(product.category_id)
        );
      }

      // Price range filter
      if (filters.value.minPrice !== null && filters.value.minPrice !== '') {
        result = result.filter(product => {
          const finalPrice = product.discount > 0
            ? product.price * (100 - product.discount) / 100
            : product.price;
          return finalPrice >= filters.value.minPrice;
        });
      }

      if (filters.value.maxPrice !== null && filters.value.maxPrice !== '') {
        result = result.filter(product => {
          const finalPrice = product.discount > 0
            ? product.price * (100 - product.discount) / 100
            : product.price;
          return finalPrice <= filters.value.maxPrice;
        });
      }

      // Rating filter
      if (filters.value.rating !== null) {
        result = result.filter(product =>
          product.rating >= filters.value.rating
        );
      }

      // Stock filter
      if (filters.value.inStock) {
        result = result.filter(product => product.stock > 0);
      }

      // Apply sorting
      switch (sortOption.value) {
        case 'price-asc':
          result.sort((a, b) => {
            const priceA = a.discount > 0 ? a.price * (100 - a.discount) / 100 : a.price;
            const priceB = b.discount > 0 ? b.price * (100 - b.discount) / 100 : b.price;
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          result.sort((a, b) => {
            const priceA = a.discount > 0 ? a.price * (100 - a.discount) / 100 : a.price;
            const priceB = b.discount > 0 ? b.price * (100 - b.discount) / 100 : b.price;
            return priceB - priceA;
          });
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default: // relevance - default sorting
          break;
      }

      return result;
    });

    // Pagination
    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return filteredProducts.value.slice(startIndex, endIndex);
    });

    // Reset to page 1 when filters change
    watch(filteredProducts, () => {
      currentPage.value = 1;
    });

    // Methods
    const applyFilters = () => {
      // Update URL with filter params
      const query = {};

      if (filters.value.search) query.q = filters.value.search;
      if (filters.value.categories.length > 0) query.cat = filters.value.categories.join(',');
      if (filters.value.minPrice) query.min = filters.value.minPrice;
      if (filters.value.maxPrice) query.max = filters.value.maxPrice;
      if (filters.value.rating) query.rating = filters.value.rating;
      if (filters.value.inStock) query.stock = 1;
      if (sortOption.value !== 'relevance') query.sort = sortOption.value;

      router.push({ query });
    };

    const resetFilters = () => {
      filters.value = {
        search: '',
        categories: [],
        minPrice: null,
        maxPrice: null,
        rating: null,
        inStock: false
      };
      sortOption.value = 'relevance';
      router.push({ query: {} });
    };

    const addToCart = (product) => {
      // Implement cart functionality
      console.log('Adding to cart:', product);
      alert(`${product.name} adicionado ao carrinho!`);
    };

    // Initialize filters from URL on page load
    onMounted(() => {
      fetchProducts();
      fetchCategories();

      const query = route.query;

      if (query.q) filters.value.search = query.q;
      if (query.cat) filters.value.categories = query.cat.split(',').map(Number);
      if (query.min) filters.value.minPrice = Number(query.min);
      if (query.max) filters.value.maxPrice = Number(query.max);
      if (query.rating) filters.value.rating = Number(query.rating);
      if (query.stock) filters.value.inStock = Boolean(Number(query.stock));
      if (query.sort) sortOption.value = query.sort;
    });

    return {
      viewMode,
      currentPage,
      itemsPerPage,
      sortOption,
      filters,
      products,
      categories,
      filteredProducts,
      totalPages,
      paginatedProducts,
      applyFilters,
      resetFilters,
      addToCart
    };
  }
};
</script>