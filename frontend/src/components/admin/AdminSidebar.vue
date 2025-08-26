<template>
  <div
    class="sidebar bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out z-20"
    :class="{ '-translate-x-full': !isOpen }">
    <div class="flex items-center justify-between px-4">
      <div class="flex items-center space-x-2">
        <img src="/logo.svg" alt="Logo" class="h-8 w-8" />
        <span class="text-2xl font-extrabold">Admin</span>
      </div>
      <button @click="$emit('toggle')" class="md:hidden p-2 rounded-md hover:bg-gray-800">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="flex flex-col space-y-1">
      <router-link to="/painel-administrador/"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </router-link>

      <router-link to="/painel-administrador/produtos"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Produtos
      </router-link>

      <div class="space-y-1">
        <button @click="toggleServicesMenu"
          class="w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center justify-between"
          :class="{ 'bg-gray-800': isServicesMenuOpen || $route.path.startsWith('/painel-administrador/servicos') }">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Serviços</span>
          </div>
          <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isServicesMenuOpen }" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-show="isServicesMenuOpen" class="ml-4 space-y-1 overflow-hidden transition-all duration-300">
          <router-link to="/painel-administrador/servicos"
            class="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center text-sm"
            active-class="bg-gray-700">
            <span class="ml-6">Gerenciar Serviços</span>
          </router-link>
          <router-link to="/painel-administrador/servicos/disponibilidade"
            class="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center text-sm"
            active-class="bg-gray-700">
            <span class="ml-6">Agenda Inteligente</span>
          </router-link>
          <router-link to="/painel-administrador/servicos/agendamentos"
            class="block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center text-sm"
            active-class="bg-gray-700">
            <span class="ml-6">Agendamentos</span>
          </router-link>
        </div>
      </div>

      <router-link to="/painel-administrador/fornecedores"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Fornecedores
      </router-link>

      <router-link to="/painel-administrador/clientes"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Clientes
      </router-link>

      <router-link to="/painel-administrador/estoque"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Estoque
      </router-link>

      <router-link to="/painel-administrador/pedidos"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Pedidos
      </router-link>

      <router-link to="/painel-administrador/configuracoes"
        class="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center"
        active-class="bg-gray-800">
        <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configurações
      </router-link>
    </nav>

    <div class="px-4 mt-auto">
      <div class="border-t border-gray-700 pt-4">
        <button @click="logout"
          class="w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800 flex items-center text-red-400">
          <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isServicesMenuOpen = ref(false)

const isServicesMenuOpenLocalStorage = localStorage.getItem('servicesMenuOpen') === 'true'


onMounted(() => {
  isServicesMenuOpen.value = isServicesMenuOpenLocalStorage || route.path.startsWith('/painel-administrador/servicos')

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleServicesMenu = () => {
  isServicesMenuOpen.value = !isServicesMenuOpen.value
  localStorage.setItem('servicesMenuOpen', isServicesMenuOpen.value.toString())
}

const handleClickOutside = (event) => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar && !sidebar.contains(event.target)) {
  }
}
// Função de logout
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
