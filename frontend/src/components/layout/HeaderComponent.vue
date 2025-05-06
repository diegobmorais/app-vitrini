<template>
  <div>
    <!-- Top Bar -->
    <div class="bg-primary-600 text-white py-2 px-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-sm">
          <span class="mr-4"><i class="fas fa-phone mr-1"></i> {{ contactPhone }}</span>
          <span><i class="fas fa-envelope mr-1"></i> {{ contactEmail }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/login">
            <a href="#" class="text-white hover:text-primary-200 transition">
              <i class="fas fa-user"></i>
              <span class="ml-1 hidden sm:inline">Minha Conta</span>
            </a>
          </router-link>
          <cart-button :cart-items="cartItems" :cart-total="cartTotal"></cart-button>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="bg-white shadow-md py-4 sticky top-0 z-30">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <img :src="logoUrl" alt="Logo" class="h-12 w-auto mr-3">
              <span class="text-xl font-bold text-primary-600">{{ shopName }}</span>
            </router-link>
          </div>

          <!-- Search Bar - Desktop -->
          <div class="hidden md:block w-1/3">
            <div class="relative">
              <input type="text" placeholder="Buscar produtos..."
                class="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                v-model="searchQuery" @keyup.enter="searchProducts">
              <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
                @click="searchProducts">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>

          <!-- Navigation - Desktop -->
          <nav class="hidden md:flex items-center space-x-6">
            <router-link v-for="(item, index) in navItems" :key="index" :to="item.path"
              class="font-medium hover:text-primary-600 transition"
              :class="{ 'text-primary-600': isActive(item.path) }">
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Mobile Menu Button -->
          <button class="md:hidden text-gray-700 focus:outline-none" @click="mobileMenuOpen = !mobileMenuOpen">
            <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white shadow-lg absolute w-full z-20 transition-all duration-300"
      :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'">
      <div class="container mx-auto px-4 py-3">
        <!-- Search Bar - Mobile -->
        <div class="mb-4">
          <div class="relative">
            <input type="text" placeholder="Buscar produtos..."
              class="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              v-model="searchQuery" @keyup.enter="searchProducts">
            <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
              @click="searchProducts">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Navigation - Mobile -->
        <nav class="flex flex-col space-y-3 pb-4">
          <router-link v-for="(item, index) in navItems" :key="index" :to="item.path"
            class="font-medium py-2 hover:text-primary-600 transition border-b border-gray-100"
            :class="{ 'text-primary-600': isActive(item.path) }" @click="mobileMenuOpen = false">
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Categories Bar -->
    <div class="bg-gray-100 shadow-sm py-2 px-4 hidden md:block">
      <div class="container mx-auto">
        <div class="flex items-center space-x-6 overflow-x-auto pb-1 scrollbar-hide">
          <router-link v-for="category in categories" :key="category.id" :to="`/categoria/${category.slug}`"
            class="whitespace-nowrap text-sm font-medium hover:text-primary-600 transition"
            :class="{ 'text-primary-600': isActiveCategory(category.slug) }">
            {{ category.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shopName: {
      type: String,
      default: 'Pet Shop'
    },
    logoUrl: {
      type: String,
      default: '/images/logo.png'
    },
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    categories: {
      type: Array,
      default: () => []
    },
    contactPhone: {
      type: String,
      default: '(11) 99999-9999'
    },
    contactEmail: {
      type: String,
      default: 'contato@petshop.com'
    }
  },
  data() {
    return {
      mobileMenuOpen: false,
      searchQuery: '',
      cartItems: [],
      cartTotal: 0,
      navItems: [
        { label: 'Início', path: '/' },
        { label: 'Produtos', path: '/produtos' },
        { label: 'Serviços', path: '/servicos' },
        { label: 'Sobre Nós', path: '/sobre' },
        { label: 'Contato', path: '/contato' }
      ]
    }
  },
  mounted() {
    this.fetchCartData();
    // Apply primary color from props to CSS variables
    document.documentElement.style.setProperty('--color-primary-600', this.primaryColor);
  },
  methods: {
    isActive(path) {
      return this.$route && this.$route.path === path;
    },
    isActiveCategory(slug) {
      return this.$route && this.$route.params.slug === slug;
    },
    searchProducts() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } });
        this.mobileMenuOpen = false;
      }
    },
    fetchCartData() {
      // This would be replaced with an actual API call
      // Example: axios.get('/api/cart')
      //   .then(response => {
      //     this.cartItems = response.data.items;
      //     this.cartTotal = response.data.total;
      //   });

      // Placeholder data
      this.cartItems = [
        { id: 1, name: 'Ração Premium', quantity: 1, price: 89.90 },
        { id: 2, name: 'Brinquedo Interativo', quantity: 2, price: 29.90 }
      ];
      this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>