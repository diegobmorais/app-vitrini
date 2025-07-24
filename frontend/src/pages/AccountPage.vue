<template>
  <div class="account-page container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Minha Conta</h1>

      <!-- Mensagem de boas-vindas -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {{ userInitials }}
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-xl font-semibold text-gray-900">Olá, {{ user.name }}</h2>
            <p class="text-gray-600">Bem-vindo(a) à sua área de cliente</p>
          </div>
        </div>
      </div>

      <!-- Navegação da conta -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Menu lateral -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <nav class="flex flex-col">
              <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = tab.id" :class="[
                'px-4 py-3 text-left transition-colors duration-200',
                activeTab === tab.id
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              ]">
                <div class="flex items-center">
                  <span class="mr-3">
                    <component :is="tab.icon" class="h-5 w-5" />
                  </span>
                  {{ tab.name }}
                </div>
              </button>
            </nav>
          </div>
        </div>

        <!-- Conteúdo principal -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Informações pessoais -->
            <div v-if="activeTab === 'profile'" class="space-y-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h3>

              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Nome -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                    <input type="text" id="name" v-model="user.name"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input type="email" id="email" v-model="user.email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                  </div>

                  <!-- Telefone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input type="tel" id="phone" v-model="user.phone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                  </div>

                  <!-- Data de nascimento -->
                  <div>
                    <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Data de
                      nascimento</label>
                    <input type="date" id="birthdate" v-model="user.birth_day"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                  </div>
                </div>

                <div>
                  <button type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    :disabled="isSubmitting">
                    <span>Salvar</span>
                  </button>
                </div>
              </form>

              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">Alterar senha</h3>
                <form @submit.prevent="updatePassword" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Senha atual -->
                    <div>
                      <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Senha
                        atual</label>
                      <input type="password" id="current-password" v-model="passwordForm.currentPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>

                    <!-- Nova senha -->
                    <div>
                      <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                      <input type="password" id="new-password" v-model="passwordForm.newPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>

                    <!-- Confirmar nova senha -->
                    <div>
                      <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmar nova
                        senha</label>
                      <input type="password" id="confirm-password" v-model="passwordForm.confirmPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                  </div>

                  <div>
                    <button type="submit"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      :disabled="isSubmitting">
                      <span v-if="isSubmitting">Alterando...</span>
                      <span v-else>Alterar senha</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Endereços -->
            <div v-if="activeTab === 'addresses'" class="space-y-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-900">Meus Endereços</h3>
                <button @click="createAddress"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Adicionar endereço
                </button>
              </div>
              <AddressForm v-if="showAddressForm" :address="currentAddress" :isEdit="isEdit"
                @close="showAddressForm = false" @saved="saveAddress" />

              <div v-if="addresses.length === 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-gray-500">Você ainda não cadastrou nenhum endereço</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="(address) in addresses" :key="address.id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ address.name }}</p>
                      <span v-if="address.for_delivery"
                        class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                        Endereço para entrega
                      </span>
                      <p class="text-gray-600">{{ address.street }}, {{ address.number }}</p>
                      <p class="text-gray-600">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
                      <p class="text-gray-600">CEP: {{ address.zipcode }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button @click="editAddress(address)" class="text-primary hover:text-primary-dark">
                        Editar
                      </button>
                      <button @click="deleteAddress(address)" class="text-red-600 hover:text-red-800">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pedidos -->
            <div v-if="activeTab === 'orders'" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Meus Pedidos</h3>

              <div v-if="orders.length === 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-gray-500">Você ainda não realizou nenhum pedido</p>
                <router-link to="/products"
                  class="inline-block mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Ver produtos
                </router-link>
              </div>

              <div v-else class="space-y-4">
                <div v-for="(order, index) in orders" :key="index"
                  class="border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-4 flex justify-between items-center">
                    <div>
                      <p class="font-medium text-gray-900">Pedido #{{ order.id }}</p>
                      <p class="text-sm text-gray-500">{{ formatDate(order.date) }}</p>
                    </div>
                    <div>
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getStatusClass(order.status)
                      ]">
                        {{ getStatusText(order.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="space-y-2">
                      <div v-for="(item, itemIndex) in order.items" :key="itemIndex" class="flex justify-between">
                        <div class="flex">
                          <span class="text-gray-600">{{ item.quantity }}x</span>
                          <span class="ml-2 text-gray-900">{{ item.name }}</span>
                        </div>
                        <span class="text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</span>
                      </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <span class="font-medium text-gray-900">Total</span>
                      <span class="font-medium text-gray-900">{{ formatCurrency(order.total) }}</span>
                    </div>
                  </div>
                  <div class="bg-gray-50 p-4 flex justify-end">
                    <button @click="viewOrderDetails(order.id)"
                      class="text-primary hover:text-primary-dark font-medium">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Favoritos -->
            <div v-if="activeTab === 'favorites'" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Meus Favoritos</h3>

              <div v-if="favorites.length === 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p class="text-gray-500">Você ainda não adicionou produtos aos favoritos</p>
                <router-link to="/products"
                  class="inline-block mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Ver produtos
                </router-link>
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(product, index) in favorites" :key="index"
                  class="border border-gray-200 rounded-lg overflow-hidden">
                  <div class="relative">
                    <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover" />
                    <button @click="removeFromFavorites(product.id)"
                      class="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div class="p-4">
                    <h4 class="text-gray-900 font-medium">{{ product.name }}</h4>
                    <p class="text-primary font-semibold mt-1">{{ formatCurrency(product.price) }}</p>
                    <div class="mt-4">
                      <router-link :to="`/products/${product.slug}`"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Ver detalhes
                      </router-link>
                      <button @click="addToCart(product)"
                        class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notificações -->
            <div v-if="activeTab === 'notifications'" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Notificações</h3>

              <div v-if="notifications.length === 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p class="text-gray-500">Você não tem notificações no momento</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="(notification, index) in notifications" :key="index" class="p-4 rounded-lg"
                  :class="notification.read ? 'bg-white border border-gray-200' : 'bg-blue-50 border border-blue-100'">
                  <div class="flex justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ notification.title }}</p>
                      <p class="text-gray-600 mt-1">{{ notification.message }}</p>
                      <p class="text-xs text-gray-500 mt-2">{{ formatDate(notification.date) }}</p>
                    </div>
                    <div>
                      <button v-if="!notification.read" @click="markAsRead(index)"
                        class="text-primary hover:text-primary-dark text-sm">
                        Marcar como lida
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthenticatedUser } from '@/store/modules/user'
import addressService from '@/services/addressService.js'
import AddressForm from '@/components/address/AddressForm.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'AccountPage',
  components: {
    AddressForm
  },
  metaInfo: {
    title: 'Minha Conta'
  },
  setup() {
    const user = ref({})

    // Abas
    const activeTab = ref('profile')
    const tabs = [
      { id: 'profile', name: 'Perfil', icon: 'UserIcon' },
      { id: 'addresses', name: 'Endereços', icon: 'HomeIcon' },
      { id: 'orders', name: 'Pedidos', icon: 'ShoppingBagIcon' },
      { id: 'favorites', name: 'Favoritos', icon: 'HeartIcon' },
      { id: 'notifications', name: 'Notificações', icon: 'BellIcon' }
    ]

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // Estado de submissão
    const isSubmitting = ref(false)

    // Endereços
    const addresses = ref([])
    const showAddressForm = ref(false)
    const currentAddress = ref(null)
    const isEdit = ref(false)

    const loadAddresses = async () => {
      const { data } = await addressService.getAll()
      addresses.value = data
    }

    const createAddress = () => {    
      currentAddress.value = {}  
      showAddressForm.value = true 
      isEdit.value = false      
    }

    const editAddress = (address) => {
      if (!address) return;
      console.log('adress', address);

      currentAddress.value = {
        ...address,
        for_delivery: address.for_delivery ?? false,
      };
      isEdit.value = true      
      showAddressForm.value = true
    }

    const deleteAddress = async (address) => {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Deseja realmente excluir este endereço?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
      })
      if (result.isConfirmed) {
        try {
          await addressService.destroy(address.id)
          await loadAddresses()
          Swal.fire('Excluído!', 'Endereço excluído com sucesso.', 'success')
        } catch (error) {
          Swal.fire('Erro', 'Falha ao excluir endereço.', 'error')
        }
      }
    }

    const saveAddress = async (address) => {
      if (address.for_delivery) {
        for (const other of addresses.value) {
          if (other.id !== address.id && other.for_delivery) {
            await addressService.update(other.id, { ...other, for_delivery: false })
          }
        }
      }

      if (isEdit.value) {
        await addressService.update(address.id, address)
      } else {
        await addressService.create(address)
      }

      await loadAddresses()
      showAddressForm.value = false
    }

    // Pedidos (simulados)
    const orders = ref([
      {
        id: '10001',
        date: '2023-05-15T14:30:00',
        status: 'delivered',
        items: [
          { name: 'Ração Premium para Cães', quantity: 2, price: 89.90 },
          { name: 'Brinquedo Interativo', quantity: 1, price: 45.50 }
        ],
        total: 225.30
      }
    ])

    // Favoritos (simulados)
    const favorites = ref([
      {
        id: 1,
        name: 'Ração Premium para Cães',
        slug: 'racao-premium-para-caes',
        price: 89.90,
        image: '/placeholder.svg?height=300&width=300'
      },
    ])

    // Notificações (simuladas)
    const notifications = ref([
      {
        id: 1,
        title: 'Pedido entregue',
        message: 'Seu pedido #10001 foi entregue com sucesso.',
        date: '2023-05-16T09:45:00',
        read: true
      }
    ])

    // Iniciais do usuário para avatar
    const userInitials = computed(() => {
      if (!user.value.name) return ''
      return user.value.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })

    // Métodos
    const updateProfile = async () => {
      isSubmitting.value = true

      try {
        const payload = {
          name: user.value.name,
          email: user.value.email,
          phone: user.value.phone,
          birth_day: user.value.birth_day
        }

        const response = await axios.put('/api/me/update', payload)

        user.value = response.data.user
        Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          text: 'Suas informações foram salvas com sucesso.',
          timer: 2000,
          showConfirmButton: false
        });

        isSubmitting.value = false

      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        Swal.fire({
          icon: 'error',
          title: 'Erro ao salvar',
          text: 'Não foi possível atualizar seus dados. Tente novamente.',
        });
      }
    }

    const updatePassword = () => {
      isSubmitting.value = true
      // Simulação de requisição
      setTimeout(() => {
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        isSubmitting.value = false
        alert('Senha alterada com sucesso!')
      }, 1000)
    }

    const viewOrderDetails = (orderId) => {
      // Implementação da visualização de detalhes do pedido
      alert(`Visualizando detalhes do pedido ${orderId}`)
    }

    const removeFromFavorites = (productId) => {
      favorites.value = favorites.value.filter(product => product.id !== productId)
    }

    const addToCart = (product) => {
      // Implementação da adição ao carrinho
      alert(`Produto ${product.name} adicionado ao carrinho!`)
    }

    const markAsRead = (index) => {
      notifications.value[index].read = true
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pendente',
        'processing': 'Em processamento',
        'shipped': 'Enviado',
        'delivered': 'Entregue',
        'canceled': 'Cancelado'
      }
      return statusMap[status] || status
    }

    const getStatusClass = (status) => {
      const classMap = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'canceled': 'bg-red-100 text-red-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    }
    onMounted(async () => {
      try {
        user.value = await getAuthenticatedUser()
        loadAddresses();

      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    })
    return {
      user,
      activeTab,
      tabs,
      passwordForm,
      isSubmitting,
      addresses,
      orders,
      favorites,
      notifications,
      userInitials,
      updateProfile,
      updatePassword,
      createAddress,
      saveAddress,
      showAddressForm,
      editAddress,
      deleteAddress,
      viewOrderDetails,
      removeFromFavorites,
      addToCart,
      markAsRead,
      formatDate,
      formatCurrency,
      getStatusText,
      getStatusClass
    }
  }
}
</script>