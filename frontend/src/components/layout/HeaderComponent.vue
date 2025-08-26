<template>
  <div>
    <!-- Top Bar -->
    <div class="bg-primary-600 text-white py-2 px-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-sm">
          <span class="mr-4"><i class="fas fa-phone mr-1"></i> {{ contactPhone }}</span>
          <span><i class="fas fa-envelope mr-1"></i> {{ contactEmail }}</span>
        </div>
        <div class="flex items-center space-x-6 text-white text-sm">
          <span v-if="isAuthenticated" class="hidden sm:inline">
            Olá, {{ userName }}
          </span>
          <router-link :to="accountRoute" class="hover:text-primary-200 transition">
            Minha Conta
          </router-link>
          <button v-if="isAuthenticated" @click="logout" class="hover:text-primary-dark transition underline">
            Sair
          </button>
          <!-- <cart-button :cart-items="cartItems" :cart-total="cartTotal" /> -->
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/useAuthStore'

const props = defineProps({
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
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// States
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const cartItems = ref([])
const cartTotal = ref(0)

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Produtos', path: '/produtos' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Sobre Nós', path: '/sobre' },
  { label: 'Contato', path: '/contato' }
]

// Computed
const userName = computed(() => authStore.getUser?.name || 'Visitante')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const accountRoute = computed(() => {
  if (!authStore.user) return '/minha-conta'  
  return authStore.getUser.role_id === 1 ? '/painel-administrador' : '/minha-conta'
})

// Lifecycle
onMounted(() => {
  fetchCartData()
  document.documentElement.style.setProperty('--color-primary-dark', props.primaryColor)
})

// Methods
function isActive(path) {
  return route.path === path
}

function isActiveCategory(slug) {
  return route.params.slug === slug
}

function searchProducts() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    mobileMenuOpen.value = false
  }
}

function fetchCartData() {
  // Simulação de dados do carrinho
  cartItems.value = [
    { id: 1, name: 'Ração Premium', quantity: 1, price: 89.90 },
    { id: 2, name: 'Brinquedo Interativo', quantity: 2, price: 29.90 }
  ]
  cartTotal.value = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
}

async function logout() {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
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