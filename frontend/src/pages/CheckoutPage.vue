<template>
  <div class="checkout-page py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <!-- Checkout Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" :class="{
              'bg-blue-600': currentStep >= index,
              'bg-gray-300': currentStep < index
            }">
              {{ index + 1 }}
            </div>
            <span class="mt-2 text-sm" :class="{
              'text-blue-600 font-medium': currentStep >= index,
              'text-gray-500': currentStep < index
            }">
              {{ step }}
            </span>
          </div>
        </div>
        <div class="relative mt-2">
          <div class="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div class="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"></div>
        </div>
      </div>

      <!-- Cart Review Step -->
      <div v-if="currentStep === 0" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Revise seu Carrinho</h2>

        <div v-if="carts.length === 0" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Seu carrinho está vazio</h3>
          <p class="text-gray-600 mb-4">Adicione alguns produtos antes de finalizar a compra.</p>
          <router-link to="/produtos"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Continuar Comprando
          </router-link>
        </div>

        <div v-else>
          <!-- Cart Items -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <div class="hidden sm:grid sm:grid-cols-12 text-sm font-medium text-gray-500 mb-3">
              <div class="sm:col-span-6">Produto</div>
              <div class="sm:col-span-2 text-center">Preço</div>
              <div class="sm:col-span-2 text-center">Quantidade</div>
              <div class="sm:col-span-2 text-right">Subtotal</div>
            </div>

            <div v-for="(item, index) in carts" :key="item.id" class="py-4 border-t border-gray-100 first:border-t-0">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div class="sm:col-span-6 flex items-center">
                  <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                    <button @click="removeItem(item.cart_item_id)"
                      class="text-sm text-red-600 hover:text-red-800 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remover
                    </button>
                  </div>
                </div>
                <div class="sm:col-span-2 text-center">
                  <div v-if="item.discount > 0" class="flex flex-col">
                    <span class="font-medium text-gray-900">
                      R$ {{ ((item.price * (100 - item.discount)) / 100).toFixed(2) }}
                    </span>
                    <span class="text-sm text-gray-500 line-through">
                      R$ {{ item.price.toFixed(2) }}
                    </span>
                  </div>
                  <div v-else class="font-medium text-gray-900">
                    R$ {{ item.price.toFixed(2) }}
                  </div>
                </div>
                <div class="sm:col-span-2 flex justify-center">
                  <div class="flex items-center border border-gray-300 rounded-md">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1"
                      class="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50">
                      -
                    </button>
                    <span class="px-2 py-1 min-w-[2rem] text-center">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)" :disabled="item.quantity >= item.stock"
                      class="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50">
                      +
                    </button>
                  </div>
                </div>
                <div class="sm:col-span-2 font-medium text-gray-900 text-right">
                  R$ {{ getItemTotal(item).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-medium mb-3">Cupom de Desconto</h3>
              <div class="flex">
                <input type="text" v-model="couponCode" placeholder="Digite o código"
                  class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button @click="applyCoupon"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-r-lg transition-colors">
                  Aplicar
                </button>
              </div>
              <p v-if="couponMessage" class="mt-2 text-sm"
                :class="{ 'text-green-600': couponValid, 'text-red-600': !couponValid }">
                {{ couponMessage }}
              </p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium mb-3">Resumo do Pedido</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {{ cartSumary.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Desconto</span>
                  <span>- R$ {{ cartSumary.discount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Frete</span>
                  <span>R$ {{ cartSumary.shipping.toFixed(2) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>R$ {{ cartSumary.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <router-link to="/produtos"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Continuar Comprando
            </router-link>
            <button @click="nextStep"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Prosseguir para Entrega
            </button>
          </div>
        </div>
      </div>

      <!-- Shipping Step -->
      <div v-else-if="currentStep === 1" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Informações de Entrega</h2>
        <form @submit.prevent="nextStep" class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div v-if="addresses.length === 0" class="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-500">Você ainda não cadastrou nenhum endereço</p>
            <button @click="createAddress"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Adicionar endereço
            </button>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(address) in addresses" :key="address.id" class="border border-gray-200 rounded-lg p-4">
              <label :for="`shipping-${address.id}`" class="flex items-start gap-3 cursor-pointer">
                <!-- Radio -->
                <input type="radio" name="shippingAddress" :id="`shipping-${address.id}`" :value="address.id"
                  v-model="shipping.address" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                  required />

                <!-- Informações do endereço -->
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p class="font-medium text-gray-900">{{ address.name }}</p>
                    <span v-if="address.for_delivery" class="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                      Endereço para entrega
                    </span>
                  </div>
                  <p class="text-gray-600">{{ address.street }}, {{ address.number }}</p>
                  <p class="text-gray-600">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
                  <p class="text-gray-600">CEP: {{ address.zipcode }}</p>
                </div>
              </label>
            </div>
          </div>

          <div class="md:col-span-2">
            <h3 class="text-lg font-medium mb-3">Método de Entrega</h3>
            <div class="space-y-3">
              <div v-for="(method, index) in shippingMethodsStore.shippingMethods" :key="index"
                class="flex items-center p-4 border rounded-lg"
                :class="{ 'border-blue-500 bg-blue-50': shipping.method === method.id, 'border-gray-200': shipping.method !== method.id }">
                <input type="radio" :id="`shipping-${method.id}`" :value="method.id" v-model="shipping.method"
                  name="shippingMethod" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" required />
                <label :for="`shipping-${method.id}`" class="ml-3 flex flex-grow justify-between cursor-pointer">
                  <div>
                    <span class="block font-medium text-gray-900">{{ method.name }}</span>
                    <span class="block text-sm text-gray-500">{{ method.description }}</span>
                    <span class="font-medium text-gray-900">R$ {{ method.price }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="md:col-span-2 mt-4 flex justify-between">
            <button type="button" @click="prevStep"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Voltar para o Carrinho
            </button>
            <button type="submit"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Prosseguir para Pagamento
            </button>
          </div>
        </form>
      </div>

      <AddressForm v-if="showAddressForm" :address="currentAddress" :isEdit="isEdit" @close="showAddressForm = false"
        @saved="saveAddress" />

      <!-- Confirmation Step -->
      <div v-else-if="currentStep === 3" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
          <p class="text-gray-600 mb-4">
            Seu pedido #000 foi recebido e está sendo processado.
          </p>
        </div>

        <div class="max-w-md mx-auto mb-8 text-left">
          <h3 class="font-medium text-gray-900 mb-2">Detalhes do Pedido</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600">Data:</div>
              <div class="text-gray-900">{{ new Date().toLocaleDateString() }}</div>

              <div class="text-gray-600">Total:</div>
              <div class="text-gray-900">R$ {{ cartSumary.total.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <p class="text-gray-600 mb-6">
          Enviamos um e-mail de confirmação para <strong>{{ shipping.email }}</strong> com todos os detalhes do seu
          pedido.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Voltar para a Loja
          </router-link>
          <button class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Acompanhar Pedido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useCartStore } from '@/store/modules/userCartStore'
import { useShippingMethod } from '@/store/modules/useShippingMethod'
import { ref, reactive, computed, watch, onMounted } from 'vue'


const cartStore = useCartStore()
const auth = useAuthStore()
const shippingMethodsStore = useShippingMethod()

// Passos do checkout
const steps = ['Carrinho', 'Entrega', 'Pagamento', 'Confirmação']
const currentStep = ref(0)

// Dados do carrinho
const carts = computed(() => cartStore.items)
const cartSumary = computed(() => cartStore.summary)
const defaultAddress = computed(() => auth.defaultAddress)
const addresses = computed(() => auth.addresses)

// Calcular totais do carrinho
const calculateTotals = () => {
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Total do item
const getItemTotal = (item) => {
  const price = item.discount > 0
    ? item.price * (100 - item.discount) / 100
    : item.price
  return price * item.quantity
}

// Atualizar quantidade do item
const updateQuantity = async (index, quantity) => {
  if (quantity < 1) return

  await cartStore.updateItemQuantity(index, quantity)

  calculateTotals()
}

// Remover item do carrinho
const removeItem = async (cartItemId) => {
  await cartStore.removeItemCart(cartItemId)

  await cartStore.fetchItems()

  calculateTotals()
}

// Cupom promocional
const couponCode = ref('')
const couponValid = ref(false)
const couponMessage = ref('')

// Aplicar cupom
const applyCoupon = () => {
  if (couponCode.value === 'PETSHOP10') {
    cartSumary.discount = cartSumary.subtotal * 0.1
    couponValid.value = true
    couponMessage.value = 'Cupom aplicado com sucesso! 10% de desconto.'
  } else {
    cartSumary.discount = 0
    couponValid.value = false
    couponMessage.value = 'Cupom inválido ou expirado.'
  }
  calculateTotals()
}

// Dados de envio
const shipping = ref({
  address: '',
  method: ''
});

watch(
  defaultAddress,
  (newDefault) => {
    if (newDefault && !shipping.value.address) {
      shipping.address = newDefault.id;
    }
  },
  { immediate: true }
);

// Navegação entre passos
const nextStep = async () => {
  if (currentStep.value < steps.length - 1) {
    await auth.fetchUser()
    currentStep.value++

    if (currentStep.value === 2) {
      calculateTotals()

      const order = await createOrder()
      console.log('Ordem criada:', order)
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const createOrder = async () => {
  try {
    const orderData = {
      customer_name: auth.user.name,
      customer_email: auth.user.email,
      customer_phone: auth.user.phone,
      discount: 0,
      shipping: shipping.value.method,    
      items: cartStore.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_unit: item.price
      })),
      shipping_address: shipping.value.address
    }

    const response = await cartStore.checkout(orderData)
    return response.data.order
  } catch (err) {
    console.error('Erro ao criar pedido', err)
  }
}
// Inicializa totais
calculateTotals()

onMounted(async () => {
  await cartStore.fetchItems()
  await shippingMethodsStore.fetchShippingMethods()
})   
</script>