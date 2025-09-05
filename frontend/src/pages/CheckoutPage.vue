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

        <form @submit.prevent="nextStep" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" id="fullname" v-model="shipping.fullName" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" id="email" v-model="shipping.email" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input type="tel" id="phone" v-model="shipping.phone" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="zipcode" class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input type="text" id="zipcode" v-model="shipping.zipCode" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input type="text" id="address" v-model="shipping.address" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="number" class="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input type="text" id="number" v-model="shipping.number" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="complement" class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input type="text" id="complement" v-model="shipping.complement"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="neighborhood" class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input type="text" id="neighborhood" v-model="shipping.neighborhood" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input type="text" id="city" v-model="shipping.city" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input type="text" id="state" v-model="shipping.state" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="md:col-span-2">
            <h3 class="text-lg font-medium mb-3">Método de Entrega</h3>
            <div class="space-y-3">
              <div v-for="(method, index) in shippingMethods" :key="index"
                class="flex items-center p-4 border rounded-lg"
                :class="{ 'border-blue-500 bg-blue-50': shipping.method === method.id, 'border-gray-200': shipping.method !== method.id }">
                <input type="radio" :id="`shipping-${method.id}`" :value="method.id" v-model="shipping.method"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label :for="`shipping-${method.id}`" class="ml-3 flex flex-grow justify-between cursor-pointer">
                  <div>
                    <span class="block font-medium text-gray-900">{{ method.name }}</span>
                    <span class="block text-sm text-gray-500">{{ method.description }}</span>
                  </div>
                  <span class="font-medium text-gray-900">R$ {{ method.price.toFixed(2) }}</span>
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

      <!-- Payment Step -->
      <div v-else-if="currentStep === 2" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Informações de Pagamento</h2>

        <form @submit.prevent="nextStep" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-3">Método de Pagamento</h3>
            <div class="space-y-3">
              <div v-for="(method, index) in paymentMethods" :key="index"
                class="flex items-center p-4 border rounded-lg"
                :class="{ 'border-blue-500 bg-blue-50': payment.method === method.id, 'border-gray-200': payment.method !== method.id }"
                @click="payment.method = method.id">
                <input type="radio" :id="`payment-${method.id}`" :value="method.id" v-model="payment.method"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label :for="`payment-${method.id}`" class="ml-3 flex items-center cursor-pointer">
                  <img :src="method.icon" :alt="method.name" class="h-8 w-auto mr-3" />
                  <span class="font-medium text-gray-900">{{ method.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Credit Card Form -->
          <div v-if="payment.method === 'credit-card'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="card-number" class="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
              <input type="text" id="card-number" v-model="payment.cardNumber" placeholder="0000 0000 0000 0000"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label for="card-name" class="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
              <input type="text" id="card-name" v-model="payment.cardName" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="card-expiry" class="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                <input type="text" id="card-expiry" v-model="payment.cardExpiry" placeholder="MM/AA" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div>
                <label for="card-cvv" class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input type="text" id="card-cvv" v-model="payment.cardCvv" placeholder="123" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div class="md:col-span-2">
              <label for="installments" class="block text-sm font-medium text-gray-700 mb-1">Parcelamento</label>
              <select id="installments" v-model="payment.installments" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="1">1x de R$ 200.00 (sem juros)</option>
              </select>
            </div>
          </div>

          <!-- Pix Form -->
          <div v-else-if="payment.method === 'pix'" class="text-center">
            <div class="bg-gray-100 p-6 rounded-lg mb-4">
              <img src="/images/pix-qrcode.png" alt="QR Code PIX" class="w-48 h-48 mx-auto mb-4" />
              <div class="text-sm text-gray-600 mb-2">Escaneie o QR Code ou copie o código abaixo:</div>
              <div class="flex">
                <input type="text"
                  value="00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff817b5a8520400005303986540510.005802BR5925Loja Pet Shop Exemplo6009Sao Paulo62090505123456304B14A"
                  readonly class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg bg-white" />
                <button type="button"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-r-lg transition-colors">
                  Copiar
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              O pagamento via PIX é processado instantaneamente. Após o pagamento, você receberá a confirmação por
              e-mail.
            </p>
          </div>

          <!-- Boleto Form -->
          <div v-else-if="payment.method === 'boleto'" class="text-center">
            <div class="bg-gray-100 p-6 rounded-lg mb-4">
              <img src="/images/barcode.png" alt="Código de Barras" class="h-16 mx-auto mb-4" />
              <div class="text-sm text-gray-600 mb-2">Copie o código de barras abaixo:</div>
              <div class="flex">
                <input type="text" value="34191.79001 01043.510047 91020.150008 9 87770026000" readonly
                  class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg bg-white" />
                <button type="button"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-r-lg transition-colors">
                  Copiar
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600">
              O boleto tem vencimento em 3 dias úteis. Após o pagamento, a compensação pode levar até 3 dias úteis.
            </p>
          </div>

          <div class="mt-6 flex justify-between">
            <button type="button" @click="prevStep"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Voltar para Entrega
            </button>
            <button type="submit"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Finalizar Pedido
            </button>
          </div>
        </form>
      </div>

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
            Seu pedido #{{ orderId }} foi recebido e está sendo processado.
          </p>
        </div>

        <div class="max-w-md mx-auto mb-8 text-left">
          <h3 class="font-medium text-gray-900 mb-2">Detalhes do Pedido</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600">Data:</div>
              <div class="text-gray-900">{{ new Date().toLocaleDateString() }}</div>

              <div class="text-gray-600">Total:</div>
              <div class="text-gray-900">R$ {{ cart.total.toFixed(2) }}</div>

              <div class="text-gray-600">Pagamento:</div>
              <div class="text-gray-900">{{ getPaymentMethodName() }}</div>

              <div class="text-gray-600">Entrega:</div>
              <div class="text-gray-900">{{ getShippingMethodName() }}</div>
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
          <button @click="trackOrder"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Acompanhar Pedido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import serviceAddress from '@/services/addressService'
import { useAuthStore } from '@/store/modules/useAuthStore'
import { useCartStore } from '@/store/modules/userCartStore'
import { ref, reactive, computed, watch, onMounted } from 'vue'


const cartStore = useCartStore()
const auth = useAuthStore()

// Passos do checkout
const steps = ['Carrinho', 'Entrega', 'Pagamento', 'Confirmação']
const currentStep = ref(0)

// Dados do carrinho
const carts = computed(() => cartStore.items)
const cartSumary = computed(() => cartStore.summary)
const defaultAddress = computed(() => auth.defaultAddress)

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
const shipping = reactive({
  fullName: auth.user.name || '',
  email: auth.user.email || '',
  phone: auth.user.phone || '',
  zipCode: auth.defaultAddress ? auth.defaultAddress.zipcode : '',
  address: auth.defaultAddress ? auth.defaultAddress.street : '',
  number: auth.defaultAddress ? auth.defaultAddress.number : '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  method: 'standard'
});

// Métodos de envio disponíveis
const shippingMethods = [
  {
    id: 'standard',
    name: 'Entrega Padrão',
    description: 'Entrega em 3-5 dias úteis',
    price: 15.90
  },
  {
    id: 'express',
    name: 'Entrega Expressa',
    description: 'Entrega em 1-2 dias úteis',
    price: 25.90
  },
  {
    id: 'pickup',
    name: 'Retirada na Loja',
    description: 'Retire na loja em até 24h',
    price: 0
  }
]

// Método de envio selecionado
const getSelectedShippingMethod = () => {
  return shippingMethods.find(method => method.id === shipping.method)
}

// Nome do método de envio
const getShippingMethodName = () => {
  const method = getSelectedShippingMethod()
  return method ? method.name : ''
}

// Dados de pagamento
const payment = reactive({
  method: 'credit-card',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  installments: '1'
})

// Métodos de pagamento disponíveis
const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    icon: '/images/credit-card-icon.png'
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: '/images/pix-icon.png'
  },
  {
    id: 'boleto',
    name: 'Boleto Bancário',
    icon: '/images/boleto-icon.png'
  }
]

// Nome do método de pagamento
const getPaymentMethodName = () => {
  const method = paymentMethods.find(m => m.id === payment.method)
  return method ? method.name : ''
}

// ID do pedido gerado aleatoriamente
const orderId = ref(Math.floor(100000 + Math.random() * 900000))

// Navegação entre passos
const nextStep = async () => {
  if (currentStep.value < steps.length - 1) {
    await auth.fetchUser()
    currentStep.value++
    // Atualiza custo do frete ao ir para pagamento
    if (currentStep.value === 2) {
      serviceAddress.update(defaultAddress.value.id, shipping)
      calculateTotals()
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Acompanhar pedido (placeholder)
const trackOrder = () => {
  alert(`Acompanhamento do pedido #${orderId.value} ainda não disponível.`)
}

// Inicializa totais
calculateTotals()

onMounted(async () => {
  await cartStore.fetchItems()
})   
</script>