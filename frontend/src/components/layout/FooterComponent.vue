<template>
  <footer class="bg-gray-800 text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- About Section -->
        <div>
          <h3 class="text-xl font-bold mb-4">{{ shopName }}</h3>
          <p class="text-gray-300 mb-4">
            Oferecemos produtos de alta qualidade para o seu pet, com preços justos e entrega rápida.
          </p>
          <div class="flex space-x-4">
            <a v-for="(social, index) in socialMedia" :key="index" :href="social.url" target="_blank"
              class="text-gray-300 hover:text-primary-400 transition">
              <i :class="`fab fa-${social.icon} text-xl`"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-4">Links Rápidos</h3>
          <ul class="space-y-2">
            <li v-for="(link, index) in quickLinks" :key="index">
              <router-link :to="link.path" class="text-gray-300 hover:text-primary-400 transition">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-bold mb-4">Contato</h3>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt mt-1 mr-3 text-primary-400"></i>
              <span>{{ address }}</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone mr-3 text-primary-400"></i>
              <span>{{ contactPhone }}</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope mr-3 text-primary-400"></i>
              <span>{{ contactEmail }}</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-clock mr-3 text-primary-400"></i>
              <span>{{ businessHours }}</span>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-bold mb-4">Newsletter</h3>
          <p class="text-gray-300 mb-4">
            Inscreva-se para receber novidades e promoções exclusivas.
          </p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-3">
            <div>
              <input type="email" v-model="newsletterEmail" placeholder="Seu e-mail"
                class="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required>
            </div>
            <button type="submit"
              class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition w-full">
              Inscrever-se
            </button>
          </form>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 my-6"></div>

      <!-- Bottom Footer -->
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} {{ shopName }}. Todos os direitos reservados.
        </p>
        <div class="flex items-center space-x-4">
          <a href="#" class="text-gray-400 hover:text-primary-400 text-sm transition">Termos de Uso</a>
          <a href="#" class="text-gray-400 hover:text-primary-400 text-sm transition">Política de Privacidade</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  shopName: {
    type: String,
    default: 'Pet Shop'
  },
  contactEmail: {
    type: String,
    default: 'contato@petshop.com'
  },
  contactPhone: {
    type: String,
    default: '(11) 99999-9999'
  },
  socialMedia: {
    type: Array,
    default: () => [
      { icon: 'facebook', url: 'https://facebook.com' },
      { icon: 'instagram', url: 'https://instagram.com' },
      { icon: 'twitter', url: 'https://twitter.com' },
      { icon: 'youtube', url: 'https://youtube.com' }
    ]
  }
})

// Refs (data)
const newsletterEmail = ref('')
const address = ref('Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100')
const businessHours = ref('Seg - Sex: 9h às 18h | Sáb: 9h às 14h')
const quickLinks = ref([
  { label: 'Início', path: '/' },
  { label: 'Produtos', path: '/produtos' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Sobre Nós', path: '/sobre' },
  { label: 'Contato', path: '/contato' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' }
])

// Método
function subscribeNewsletter() {
  alert(`Email ${newsletterEmail.value} inscrito com sucesso!`)
  newsletterEmail.value = ''
}
</script>