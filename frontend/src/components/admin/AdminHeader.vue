<template>
  <header class="bg-white shadow-sm z-10">
    <div class="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="$emit('toggle-sidebar')"
          class="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="ml-4 text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Notificações -->
        <div class="relative">
          <button class="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
            <span class="sr-only">Ver notificações</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>

        <!-- Perfil do usuário -->
        <div class="relative" ref="profileDropdown">
          <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none">
            <img :src="user.avatar || '/default-avatar.png'" alt="Avatar"
              class="h-8 w-8 rounded-full object-cover border border-gray-200" />
            <span class="hidden md:block text-sm font-medium text-gray-700">{{ user.name }}</span>
            <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div v-show="profileMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <router-link to="/admin/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Meu Perfil
            </router-link>
            <router-link to="/admin/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Configurações
            </router-link>
            <div class="border-t border-gray-100"></div>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/modules/useAuthStore'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const profileMenuOpen = ref(false)
const unreadNotifications = ref(0)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Título dinâmico com base na rota
const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/painel-administrador/produtos')) return 'Gerenciamento de Produtos'
  if (path.includes('/painel-administrador/clientes')) return 'Clientes'
  if (path.includes('/painel-administrador/estoque')) return 'Controle de Estoque'
  if (path.includes('/painel-administrador/pedidos')) return 'Pedidos'
  if (path.includes('/painel-administrador/configuracoes')) return 'Configurações'
  if (path.includes('/painel-administrador/')) return 'Dashboard'
  return 'Painel Administrativo'
})

const profileDropdown = ref(null)

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value
}

function closeProfileMenu(event) {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    profileMenuOpen.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', closeProfileMenu)

  // Buscar notificações se houver lógica implementada
  // Exemplo fictício:
  // unreadNotifications.value = await notificationStore.fetchUnread()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeProfileMenu)
})
</script>