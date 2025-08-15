<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Nossos Serviços</h1>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto">
            Oferecemos uma variedade de serviços de alta qualidade para o seu pet, com profissionais experientes e
            dedicados.
          </p>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-12 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in filteredServices" :key="service.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
            <img :src="`${baseURL}${service.image_url}`" :alt="service.name" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-gray-800">{{ service.name }}</h3>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{
                  getCategoryName(service.categoryId) }}</span>
              </div>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-blue-600">R$ {{ Number(service.price).toFixed(2) }}</span>
                <button @click="openServiceModal(service)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredServices.length === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Nenhum serviço encontrado</h3>
          <p class="text-gray-500">Não encontramos serviços na categoria selecionada.</p>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16 bg-gray-100 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Por que escolher nossos serviços?</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Profissionais Qualificados</h3>
            <p class="text-gray-600">Nossa equipe é composta por profissionais experientes e apaixonados por pets.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Agendamento Flexível</h3>
            <p class="text-gray-600">Oferecemos horários flexíveis para atender às suas necessidades.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Satisfação Garantida</h3>
            <p class="text-gray-600">Seu pet merece o melhor, e é isso que nos comprometemos a oferecer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">O que nossos clientes dizem</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full mr-4">
              <div>
                <h4 class="font-bold text-gray-800">{{ testimonial.name }}</h4>
                <div class="flex">
                  <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                    :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.comment }}"</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Service Booking Modal -->
    <ServiceBookingModal v-if="showBookingModal" :show="showBookingModal" :selected-service="selectedService"
      @close="closeBookingModal" @scheduled="onServiceScheduled" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useCategoryStore } from '@/store/modules/useCategoryStore'
import { useServiceStore } from '@/store/modules/useServiceStore'
import ServiceBookingModal from '@/components/modals/services/ServiceBookingModal.vue'
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useToast } from 'vue-toastification'

const baseURL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter()
const toast = useToast()

// Stores Pinia
const serviceStore = useServiceStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()


// Estado local
const selectedCategory = ref(null)
const selectedService = ref(null)
const showBookingModal = ref(false)

// Dados
const testimonials = ref([
  {
    name: 'Ana Silva',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 5,
    comment: 'Meu cachorro sempre volta feliz e cheiroso depois do banho. Ótimo atendimento!'
  },
  {
    name: 'Carlos Oliveira',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 4,
    comment: 'O serviço de adestramento ajudou muito com o comportamento do meu filhote.'
  },
  {
    name: 'Mariana Costa',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 5,
    comment: 'Deixei minha gata hospedada por uma semana e fui atualizada diariamente sobre como ela estava. Muito bom!'
  }
])

// Pets do usuário - no app real, vem da conta do usuário
const userPets = ref([
  { id: 1, name: 'Rex', breed: 'Labrador' },
  { id: 2, name: 'Luna', breed: 'Poodle' },
  { id: 3, name: 'Mia', breed: 'Persa' }
])

const availableTimes = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
]

// Computed
const filteredServices = computed(() => {
  if (!selectedCategory.value) return serviceStore.services
  return serviceStore.services.filter(s => s.category_id === selectedCategory.value)
})

const getCategoryName = (id) => {
  const cat = categoryStore.categories.find(c => c.id === id)
  return cat ? cat.name : ''
}

// Métodos
const openServiceModal = (service) => {
  if (authStore.user) {
    selectedService.value = service
    showBookingModal.value = true
  } else {
    router.push('/login')
  }
}
const closeBookingModal = () => {
  showBookingModal.value = false
  selectedService.value = null
}

const onServiceScheduled = () => {
  toast.success('Serviço agendado com sucesso!')
  
  closeBookingModal()
}

onMounted(() => {
  serviceStore.fetchServices()
  categoryStore.fetchCategories()
})
</script>
