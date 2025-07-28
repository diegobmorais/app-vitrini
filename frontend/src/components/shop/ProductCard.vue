<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
    <!-- Badge para promoção ou novo produto -->
    <div class="relative">
      <span v-if="isOnSale"
        class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
        {{ discountPercentage }}% OFF
      </span>
      <span v-if="isNew"
        class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
        NOVO
      </span>

      <!-- Imagem do produto -->
      <router-link :to="{ name: 'product-detail', params: { slug: product.slug } }">
        <div class="relative h-48 overflow-hidden bg-gray-100">
          <img :src="product.image" :alt="product.name"
            class="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105">
        </div>
      </router-link>
    </div>

    <!-- Informações do produto -->
    <div class="p-4">
      <!-- Categoria -->
      <div class="text-xs text-gray-500 mb-1">{{ product.category_name }}</div>

      <!-- Nome do produto -->
      <router-link :to="{ name: 'product-detail', params: { slug: product.slug } }">
        <h3 class="text-gray-900 font-medium text-lg mb-1 hover:text-primary-600 line-clamp-2">
          {{ product.name }}
        </h3>
      </router-link>

      <!-- Avaliação -->
      <div class="flex items-center mb-2">
        <div class="flex text-yellow-400">
          <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="{ 'text-gray-300': i > Math.round(product.rating) }"
            fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
            </path>
          </svg>
        </div>
        <span class="text-xs text-gray-500 ml-1">
          ({{ product.review_count || 0 }})
        </span>
      </div>

      <!-- Preço -->
      <div class="flex items-center justify-between mt-2">
        <div>
          <span v-if="isOnSale" class="text-gray-500 text-sm line-through mr-2">
            {{ formatPrice(product.price) }}
          </span>
          <span class="text-gray-900 font-bold">
            {{ formatPrice(currentPrice) }}
          </span>
        </div>

        <!-- Botão de adicionar ao carrinho -->
        <button @click="addToCart"
          class="flex items-center justify-center p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          :aria-label="`Adicionar ${product.name} ao carrinho`">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
        </button>
      </div>

      <!-- Disponibilidade -->
      <div class="mt-2 text-xs">
        <span v-if="product.stock > 0" class="text-green-600">
          {{ product.stock > 10 ? 'Em estoque' : `Apenas ${product.stock} restantes` }}
        </span>
        <span v-else class="text-red-600">
          Fora de estoque
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/modules/userCartStore'
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const cartStore = useCartStore()

// Computed properties
const isOnSale = computed(() => {
  return props.product.sale_price && props.product.sale_price < props.product.price
})

const currentPrice = computed(() => {
  return isOnSale.value ? props.product.sale_price : props.product.price
})

const discountPercentage = computed(() => {
  if (!isOnSale.value) return 0
  const discount = props.product.price - props.product.sale_price
  return Math.round((discount / props.product.price) * 100)
})

const isNew = computed(() => {
  if (!props.product.created_at) return false
  const productDate = new Date(props.product.created_at)
  const now = new Date()
  const diffTime = Math.abs(now - productDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 14 
})

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

function addToCart() {
  if (props.product.stock > 0) {
    cartStore.addToCart({ product: props.product, quantity: 1 })
    emit('add-to-cart', props.product, 1)
  }
}
</script>


<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>