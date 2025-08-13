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
     <!-- <notifications-container />-->

    <!-- Modal de carrinho -->
     <cart-modal v-if="showCartModal" @close="showCartModal = false" />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import HeaderComponent from './components/layout/HeaderComponent.vue'
import FooterComponent from './components/layout/FooterComponent.vue'
// import NotificationsContainer from './components/ui/NotificationsContainer.vue'
import CartModal from './components/shop/CartModal.vue'
import { useCategoryStore } from './store/modules/useCategoryStore'
import { useCartStore } from './store/modules/userCartStore'

// Importa os stores


// Instância dos stores
const cartStore = useCartStore()
const categoryStore = useCategoryStore()

// Computed para controle do modal do carrinho
const showCartModal = computed(() => cartStore.showModal)

onMounted(() => {
  categoryStore.fetchCategories()
  cartStore.loadCart()
})
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
</style>
