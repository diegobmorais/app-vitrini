<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    <nav class="flex mb-6 text-sm" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/" class="text-gray-500 hover:text-primary-600">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z">
              </path>
            </svg>
            Início
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"></path>
            </svg>
            <router-link :to="{ name: 'products' }" class="ml-1 text-gray-500 hover:text-primary-600 md:ml-2">
              Produtos
            </router-link>
          </div>
        </li>
        <li v-if="product && product.category_name">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"></path>
            </svg>
            <router-link :to="{ name: 'category', params: { slug: product.category_slug } }"
              class="ml-1 text-gray-500 hover:text-primary-600 md:ml-2">
              {{ product.category_name }}
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"></path>
            </svg>
            <span class="ml-1 text-gray-800 font-medium md:ml-2 truncate">
              {{ product ? product.name : 'Carregando...' }}
            </span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">Erro!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <!-- Product details -->
    <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="md:flex">
        <!-- Product images -->
        <div class="md:w-1/2 p-6">
          <div class="relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img :src="product.images?.length ? `${baseURL}${product.images[0].url}` : '#'" :alt="product.name"
              class="w-full h-80 object-contain">

            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span v-if="isOnSale" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {{ discountPercentage }}% OFF
              </span>
              <span v-if="isNew" class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NOVO
              </span>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="product?.images?.length > 0 && product.images[0]?.url" class="flex gap-2 overflow-x-auto pb-2">
            <button v-for="(image, index) in allImages" :key="index" @click="currentImage = image"
              class="w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0"
              :class="currentImage === image ? 'border-primary-500' : 'border-gray-200'">
              <img :src="`${baseURL}${product.images[0].url}`" :alt="`${product.name} - Imagem ${index + 1}`"
                class="w-full h-full object-cover">
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="md:w-1/2 p-6 flex flex-col">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="{ 'text-gray-300': i > Math.round(product.rating) }"
                fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                </path>
              </svg>
            </div>
            <span class="text-sm text-gray-500 ml-1">
              {{ product.rating }} ({{ product.review_count || 0 }} avaliações)
            </span>
          </div>

          <!-- Price -->
          <div class="mb-4">
            <span v-if="isOnSale" class="text-gray-500 text-lg line-through mr-2">
              {{ formatPrice(product.price) }}
            </span>
            <span class="text-gray-900 text-2xl font-bold">
              {{ formatPrice(currentPrice) }}
            </span>
            <span v-if="product.installments" class="block text-sm text-gray-600 mt-1">
              ou {{ product.installments }}x de {{ formatPrice(currentPrice / product.installments) }} sem juros
            </span>
          </div>

          <!-- Short description -->
          <p class="text-gray-600 mb-6">{{ product.short_description }}</p>

          <!-- Availability -->
          <div class="mb-6">
            <span v-if="product.stock > 0" class="text-green-600 flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ product.stock > 10 ? 'Em estoque' : `Apenas ${product.stock} restantes` }}
            </span>
            <span v-else class="text-red-600 flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Fora de estoque
            </span>
          </div>

          <!-- Add to cart -->
          <div class="flex items-center mb-6">
            <div class="flex items-center border border-gray-300 rounded-l-md">
              <button @click="decrementQuantity" class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                :disabled="quantity <= 1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input v-model.number="quantity" type="number" min="1" :max="product.stock"
                class="w-12 text-center border-none focus:ring-0">
              <button @click="incrementQuantity" class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                :disabled="quantity >= product.stock">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
              </button>
            </div>
            <button @click="addToCart"
              class="flex-grow ml-2 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="product.stock <= 0">
              <span v-if="product.stock > 0">Adicionar ao Carrinho</span>
              <span v-else>Indisponível</span>
            </button>
          </div>

          <!-- SKU and categories -->
          <div class="text-sm text-gray-600 mb-4">
            <p v-if="product.sku">SKU: {{ product.sku }}</p>
            <p v-if="product.category_name">
              Categoria:
              <router-link :to="{ name: 'category', params: { slug: product.category_slug } }"
                class="text-primary-600 hover:underline">
                {{ product.category_name }}
              </router-link>
            </p>
          </div>

          <!-- Share -->
          <div class="mt-auto">
            <p class="text-sm text-gray-600 mb-2">Compartilhar:</p>
            <div class="flex space-x-2">
              <a href="#" class="text-gray-500 hover:text-blue-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-blue-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                  </path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-green-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-red-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                    fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Product tabs -->
      <div class="border-t border-gray-200 px-6 py-6">
        <div class="flex border-b border-gray-200">
          <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = tab.id"
            class="py-2 px-4 text-sm font-medium mr-2 focus:outline-none"
            :class="activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
            {{ tab.name }}
          </button>
        </div>

        <!-- Description tab -->
        <div v-if="activeTab === 'description'" class="py-4">
          <div class="prose prose-sm max-w-none" v-html="product.description"></div>
        </div>

        <!-- Specifications tab -->
        <!-- <div v-if="activeTab === 'specifications'" class="py-4">
          <div v-if="product.specifications && product.specifications.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(spec, index) in product.specifications" :key="index" class="border-b border-gray-200 pb-2">
                <span class="text-sm font-medium text-gray-600">{{ spec.name }}:</span>
                <span class="text-sm text-gray-800 ml-2">{{ spec.value }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-600 italic">
            Especificações não disponíveis para este produto.
          </div>
        </div> -->

        <!-- Reviews tab -->
        <div v-if="activeTab === 'reviews'" class="py-4">
          <div v-if="product.reviews && product.reviews.length > 0">
            <div v-for="(review, index) in product.reviews" :key="index"
              class="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="{ 'text-gray-300': i > review.rating }"
                    fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                    </path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-800 ml-2">{{ review.title }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ review.comment }}</p>
              <div class="text-xs text-gray-500">
                Por {{ review.author }} em {{ formatDate(review.date) }}
              </div>
            </div>
          </div>
          <div v-else class="text-gray-600 italic">
            Este produto ainda não possui avaliações.
          </div>
        </div>
      </div>
    </div>

    <!-- Related products -->
    <div v-if="relatedProducts.length > 0" class="mt-12">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <product-card v-for="product in relatedProducts" :key="product.id" :product="product"
          @add-to-cart="addToCartRelated" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import { useProductStore } from '@/store/modules/useProductStore'
import router from '@/router';
import { useCartStore } from '@/store/modules/userCartStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Props
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const productStore = useProductStore()
const cartStore = useCartStore()

const quantity = ref(1)
const activeTab = ref('description')
const currentImage = ref('')

const tabs = [
  { id: 'description', name: 'Descrição' },
  // { id: 'specifications', name: 'Especificações' },
  { id: 'reviews', name: 'Avaliações' }
]

const product = computed(() => productStore.product)
const loading = computed(() => productStore.isLoading)
const error = computed(() => productStore.error)
const relatedProducts = computed(() => productStore.related_products || [])

const isOnSale = computed(() => {
  return product.value?.sale_price && product.value.sale_price < product.value.price
})

const currentPrice = computed(() => {
  return isOnSale.value ? product.value.sale_price : product.value.price
})

const discountPercentage = computed(() => {
  if (!isOnSale.value) return 0
  const discount = product.value.price - product.value.sale_price
  return Math.round((discount / product.value.price) * 100)
})

const isNew = computed(() => {
  if (!product.value?.created_at) return false
  const productDate = new Date(product.value.created_at)
  const now = new Date()
  const diffTime = Math.abs(now - productDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 14
})

const allImages = computed(() => {
  if (!product.value) return []

  const images = []
  if (product.value.image) images.push(product.value.image)
  if (product.value.images && Array.isArray(product.value.images)) images.push(...product.value.images)
  return images
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  const currentProduct = productStore.product
  console.log('currentProduct', currentProduct);
  if (currentProduct && currentProduct.stock > 0) { 
    try {
      await cartStore.addItemToCart(currentProduct.id, quantity.value )
      router.push({ name: 'cart' })
    } catch (error) {
      alert('Erro ao adicionar produto ao carrinho')
    }
  }
}

const addToCartRelated = (relatedProduct, qty = 1) => {
  productStore.addItemToCart({ product: relatedProduct, quantity: qty })
}

watch(() => props.slug, (newSlug) => {
  if (newSlug) {
    productStore.fetchProduct(newSlug)
    quantity.value = 1
    activeTab.value = 'description'
  }
})

watch(product, (newProduct) => {
  if (newProduct && newProduct.image) {
    currentImage.value = newProduct.image
  }
})

onMounted(() => {
  productStore.fetchProduct(props.slug)
})
</script>