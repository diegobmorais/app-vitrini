<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <header-component></header-component>
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer-component></footer-component>
    
    <!-- Notificações -->
    <!-- <notifications-container /> -->
    
    <!-- Modal de carrinho -->
    <!-- <cart-modal v-if="showCartModal" @close="showCartModal = false" /> -->
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import HeaderComponent from './components/layout/HeaderComponent.vue'
import FooterComponent from './components/layout/FooterComponent.vue'
import NotificationsContainer from './components/ui/NotificationsContainer.vue'
import CartModal from './components/shop/CartModal.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent,
    NotificationsContainer,
    CartModal
  },
  setup() {
    const store = useStore()
    const showCartModal = computed(() => store.state.cart.showModal)
    
    onMounted(() => {
      // Carregar dados iniciais
      store.dispatch('categories/fetchCategories')
      store.dispatch('cart/loadCart')
      
      // Verificar autenticação
      if (localStorage.getItem('token')) {
        store.dispatch('auth/checkAuth')
      }
    })
    
    return {
      showCartModal
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos globais adicionais podem ser adicionados aqui */
</style>
