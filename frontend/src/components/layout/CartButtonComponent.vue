<template>
  <div class="relative">
    <button @click="toggleCart" class="flex items-center text-white hover:text-primary-200 transition">
      <i class="fas fa-shopping-cart"></i>
      <span class="ml-1 hidden sm:inline">Carrinho</span>
      <span v-if="cartItemsCount > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {{ cartItemsCount }}
      </span>
    </button>

    <!-- Cart Dropdown -->
    <div v-if="isCartOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50"
      @click.outside="isCartOpen = false">
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Seu Carrinho</h3>

        <div v-if="cartItems.length === 0" class="text-center py-4">
          <i class="fas fa-shopping-cart text-gray-400 text-3xl mb-2"></i>
          <p class="text-gray-500">Seu carrinho está vazio</p>
        </div>

        <div v-else>
          <!-- Cart Items -->
          <div class="max-h-60 overflow-y-auto">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center py-2 border-b border-gray-100">
              <div class="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img :src="item.image || '/images/placeholder.jpg'" :alt="item.name" class="w-full h-full object-cover">
              </div>
              <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-gray-500">{{ item.quantity }} x R$ {{ item.price.toFixed(2) }}</span>
                  <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700 text-xs">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Total -->
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center mb-3">
              <span class="font-medium">Total:</span>
              <span class="font-bold text-primary-600">R$ {{ cartTotal.toFixed(2) }}</span>
            </div>

            <!-- Cart Actions -->
            <div class="flex space-x-2">
              <router-link to="/carrinho"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-md text-center transition"
                @click="isCartOpen = false">
                Ver Carrinho
              </router-link>
              <router-link to="/checkout"
                class="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition"
                @click="isCartOpen = false">
                Checkout
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  },
  cartTotal: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['remove-item'])

// Estado local
const isCartOpen = ref(false)

// Computed: total de itens
const cartItemsCount = computed(() =>
  props.cartItems.reduce((count, item) => count + item.quantity, 0)
)

// Métodos
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const removeFromCart = (itemId) => {
  emit('remove-item', itemId)
}
</script>