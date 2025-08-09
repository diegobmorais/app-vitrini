<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
              Tudo para o seu Pet em um só lugar
            </h1>
            <p class="text-lg md:text-xl opacity-90">
              Produtos de qualidade, preços justos e entrega rápida para o seu melhor amigo.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/produtos"
                class="btn-primary px-6 py-3 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors">
                Ver Produtos
              </router-link>
              <router-link to="/sobre"
                class="btn-secondary px-6 py-3 rounded-lg font-medium text-white bg-transparent border border-white hover:bg-white hover:text-indigo-700 transition-colors">
                Sobre Nós
              </router-link>
            </div>
          </div>
          <div class="hidden md:block">
            <img src="/images/hero-pets.png" alt="Pets felizes" class="w-full h-auto rounded-lg shadow-xl" />
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style="clip-path: polygon(0 100%, 100% 100%, 100% 0);"></div>
    </section>
    <!-- Featured Categories -->
    <section class="py-12 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Categorias em Destaque</h2>

        <div class="relative">
          <!-- button next -->
          <button @click="scrollLeft"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors -translate-x-1/2"
            aria-label="Scroll para esquerda">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Container do carrossel -->
          <div ref="carousel" class="overflow-x-auto scrollbar-hide px-12">
            <div class="flex space-x-6 py-4" style="min-width: max-content;">
              <div v-for="(category, index) in featuredCategories" :key="index" class="category-card flex-shrink-0">
                <router-link :to="`/produtos?cat=${category.id}`"
                  class="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 w-64">
                  <div class="aspect-square relative overflow-hidden">
                    <img :src="category.image" :alt="category.name" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div class="p-4 text-center">
                    <h3 class="font-semibold text-lg">{{ category.name }}</h3>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- button prev -->
          <button @click="scrollRight"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors translate-x-1/2"
            aria-label="Scroll para direita">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
    <!-- Featured Products -->
    <section class="py-12 md:py-20">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Produtos em Destaque</h2>
          <router-link to="/products" class="text-blue-600 hover:text-blue-800 font-medium">Ver todos</router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <product-card v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-12 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="text-amber-400 flex">
                <span v-for="i in 5" :key="i" class="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                    :class="{ 'fill-current': i <= testimonial.rating, 'text-gray-300': i > testimonial.rating }"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
            </div>
            <p class="text-gray-600 mb-4">"{{ testimonial.text }}"</p>
            <div class="flex items-center">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 class="font-medium">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-500">{{ testimonial.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-12 md:py-20 bg-blue-600 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Receba nossas novidades</h2>
          <p class="mb-8 opacity-90">Cadastre-se para receber ofertas exclusivas, dicas de cuidados com pets e
            novidades.</p>

          <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row gap-4">
            <input type="email" v-model="newsletterEmail" placeholder="Seu melhor e-mail"
              class="flex-grow px-4 py-3 rounded-lg text-gray-900" required />
            <button type="submit"
              class="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-medium transition-colors"
              :disabled="isSubscribing">
              {{ isSubscribing ? 'Enviando...' : 'Inscrever-se' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/shop/ProductCard.vue'
import api from '@/main'

const newsletterEmail = ref('')
const isSubscribing = ref(false)
const featuredCategories = ref([])
const featuredProducts = ref([])
const carousel = ref(null)
const testimonials = ref([
  {
    name: 'Ana Silva',
    avatar: '/images/avatar-1.jpg',
    rating: 5,
    text: 'Produtos de excelente qualidade. Meu cachorro adorou a ração premium e a entrega foi super rápida!',
    location: 'São Paulo, SP'
  },
  {
    name: 'Carlos Mendes',
    avatar: '/images/avatar-2.jpg',
    rating: 4,
    text: 'Atendimento excepcional e preços justos. Recomendo para todos os donos de pets.',
    location: 'Rio de Janeiro, RJ'
  },
  {
    name: 'Mariana Costa',
    avatar: '/images/avatar-3.jpg',
    rating: 5,
    text: 'Meus gatos ficaram apaixonados pelos brinquedos. Certamente voltarei a comprar mais vezes!',
    location: 'Belo Horizonte, MG'
  }
])

const fetchProducts = async () => {
  try {
    const response = await api.get('api/products/featured')
    featuredProducts.value = response.data.data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get('api/categories/featured')
    featuredCategories.value = response.data.data
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  }
}

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) {
    alert('Por favor, insira um e-mail válido.')
    return
  }
  isSubscribing.value = true

  try {
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`E-mail ${newsletterEmail.value} cadastrado com sucesso!`)
    newsletterEmail.value = ''
  } catch (error) {
    console.error('Erro ao cadastrar e-mail:', error)
    alert('Ocorreu um erro ao cadastrar seu e-mail. Por favor, tente novamente.')
  } finally {
    isSubscribing.value = false
  }
}
const scrollLeft = () => {
  if (carousel.value) {
    const cardWidth = getCardWidth()
    carousel.value.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    })
  }
}
const getCardWidth = () => {
  return 280
}
const scrollRight = () => {
  if (carousel.value) {
    const cardWidth = getCardWidth()
    carousel.value.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.relative {
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .relative {
    padding: 0 1.5rem;
  }

  .category-card {
    min-width: 280px;
  }
}
</style>