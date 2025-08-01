<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Carrinho de Compras</h1>

    <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-shopping-cart text-5xl"></i>
      </div>
      <h2 class="text-xl font-medium text-gray-900 mb-2">Seu carrinho está vazio</h2>
      <p class="text-gray-500 mb-6">Adicione produtos ao seu carrinho para continuar comprando.</p>
      <router-link to="/produtos"
        class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition inline-block">
        Continuar Comprando
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Itens do Carrinho ({{ totalItems }})</h2>
              <button @click="clearCart" class="text-red-600 hover:text-red-800 text-sm font-medium transition">
                <i class="fas fa-trash-alt mr-1"></i> Limpar Carrinho
              </button>
            </div>
          </div>

          <!-- Cart Item List -->
          <div class="divide-y divide-gray-200">
            <div v-for="item in cartItems" :key="item.id" class="p-6 flex flex-col sm:flex-row">
              <!-- Product Image -->
              <div class="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                <img :src="item.image || '/images/placeholder.jpg'" :alt="item.name"
                  class="w-full h-full object-cover rounded-md">
              </div>

              <!-- Product Details -->
              <div class="flex-1 sm:ml-6">
                <div class="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 class="text-base font-medium text-gray-900 mb-1">
                      <router-link :to="`/produto/${item.slug}`" class="hover:text-primary-600 transition">
                        {{ item.name }}
                      </router-link>
                    </h3>
                    <div class="text-sm text-gray-500 mb-2">
                      <span v-if="item.variant">{{ item.variant.name }}</span>
                      <span v-if="item.sku" class="ml-2">SKU: {{ item.sku }}</span>
                    </div>
                    <div class="text-sm text-gray-500 mb-4">
                      <span>Preço unitário: R$ {{ item.price.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="flex flex-col sm:items-end">
                    <div class="text-primary-600 font-bold mb-2">
                      R$ {{ (item.price * item.quantity).toFixed(2) }}
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center">
                      <button @click="updateQuantity(item, item.quantity - 1)"
                        class="w-8 h-8 rounded-l-md bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition"
                        :disabled="item.quantity <= 1" :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }">
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      <input type="number" v-model.number="item.quantity" min="1" :max="item.stock_quantity || 99"
                        class="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-0"
                        @change="updateQuantity(item, item.quantity)">
                      <button @click="updateQuantity(item, item.quantity + 1)"
                        class="w-8 h-8 rounded-r-md bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition"
                        :disabled="item.quantity >= (item.stock_quantity || 99)"
                        :class="{ 'opacity-50 cursor-not-allowed': item.quantity >= (item.stock_quantity || 99) }">
                        <i class="fas fa-plus text-xs"></i>
                      </button>

                      <button @click="removeItem(item)" class="ml-4 text-red-500 hover:text-red-700 transition"
                        title="Remover item">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Continue Shopping -->
          <div class="p-6 bg-gray-50">
            <router-link to="/produtos"
              class="text-primary-600 hover:text-primary-800 font-medium transition flex items-center">
              <i class="fas fa-arrow-left mr-2"></i> Continuar Comprando
            </router-link>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Resumo do Pedido</h2>
          </div>

          <div class="p-6 space-y-4">
            <!-- Subtotal -->
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900 font-medium">R$ {{ subtotal.toFixed(2) }}</span>
            </div>

            <!-- Discount -->
            <div v-if="discount > 0" class="flex justify-between">
              <span class="text-gray-600">Desconto</span>
              <span class="text-green-600 font-medium">-R$ {{ discount.toFixed(2) }}</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between">
              <span class="text-gray-600">Frete</span>
              <span v-if="shipping > 0" class="text-gray-900 font-medium">R$ {{ shipping.toFixed(2) }}</span>
              <span v-else class="text-green-600 font-medium">Grátis</span>
            </div>

            <!-- Tax -->
            <div class="flex justify-between">
              <span class="text-gray-600">Impostos</span>
              <span class="text-gray-900 font-medium">R$ {{ tax.toFixed(2) }}</span>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-4"></div>

            <!-- Total -->
            <div class="flex justify-between items-center">
              <span class="text-gray-900 font-bold">Total</span>
              <span class="text-primary-600 text-xl font-bold">R$ {{ total.toFixed(2) }}</span>
            </div>

            <!-- Coupon Code -->
            <div class="mt-6">
              <div class="flex">
                <input type="text" v-model="couponCode" placeholder="Código promocional"
                  class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
                <button @click="applyCoupon"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-r-md transition">
                  Aplicar
                </button>
              </div>
            </div>

            <!-- Checkout Button -->
            <div class="mt-6">
              <router-link to="/checkout"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition flex items-center justify-center">
                Finalizar Compra <i class="fas fa-arrow-right ml-2"></i>
              </router-link>
            </div>

            <!-- Secure Checkout -->
            <div class="mt-4 text-center">
              <p class="text-xs text-gray-500 flex items-center justify-center">
                <i class="fas fa-lock mr-1"></i> Pagamento 100% seguro
              </p>
              <div class="flex justify-center mt-2 space-x-2">
                <i class="fab fa-cc-visa text-gray-400 text-2xl"></i>
                <i class="fab fa-cc-mastercard text-gray-400 text-2xl"></i>
                <i class="fab fa-cc-amex text-gray-400 text-2xl"></i>
                <i class="fab fa-pix text-gray-400 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/modules/userCartStore'
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const cartStore = useCartStore()
const toast = useToast()

const couponCode = ref('')
const appliedCoupon = ref(null)
const shipping = ref(0)
const taxRate = 0.08 // 8% imposto

// Sincronizar cartItems com store
const cartItems = computed(() => cartStore.items)

// Computed properties
const totalItems = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0)
)

const subtotal = computed(() =>
  cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
)

const discount = computed(() => {
  if (!appliedCoupon.value) return 0
  if (appliedCoupon.value.type === 'percentage') {
    return subtotal.value * (appliedCoupon.value.value / 100)
  }
  if (appliedCoupon.value.type === 'fixed') {
    return appliedCoupon.value.value
  }
  return 0
})

const tax = computed(() => (subtotal.value - discount.value) * taxRate)
const total = computed(() => subtotal.value - discount.value + shipping.value + tax.value)

// Métodos
async function fetchCartItems() {
  // Use store action para buscar os itens (ou API)
  await cartStore.fetchItems()
  calculateShipping()
}

function updateQuantity(item, quantity) {
  if (quantity < 1) quantity = 1
  if (quantity > (item.stock_quantity || 99)) quantity = item.stock_quantity || 99
  cartStore.updateQuantity(item.id, quantity)
  calculateShipping()
}

function removeItem(item) {
  cartStore.removeItem(item.id)
  calculateShipping()
  toast.info(`${item.name} removido do carrinho!`)
}

function clearCart() {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    cartStore.clearCart()
    appliedCoupon.value = null
    couponCode.value = ''
    shipping.value = 0
    toast.info('Carrinho limpo com sucesso!')
  }
}

function applyCoupon() {
  if (!couponCode.value.trim()) {
    toast.error('Por favor, insira um código promocional.')
    return
  }
  const code = couponCode.value.toUpperCase()

  // Aqui você pode usar uma action no store para validar o cupom via API

  // Placeholder
  if (code === 'PETSHOP10') {
    appliedCoupon.value = { code: 'PETSHOP10', type: 'percentage', value: 10 }
    toast.success('Cupom de 10% de desconto aplicado!')
  } else if (code === 'FRETE') {
    shipping.value = 0
    appliedCoupon.value = { code: 'FRETE', type: 'shipping', value: 0 }
    toast.success('Cupom de frete grátis aplicado!')
  } else {
    toast.error('Código promocional inválido ou expirado.')
  }
}

function calculateShipping() {
  // Placeholder - frete grátis acima de R$ 150
  shipping.value = subtotal.value >= 150 ? 0 : 15.9
}

// Ao montar o componente
onMounted(() => {
  fetchCartItems()
})

// Caso queira recalcular frete sempre que o subtotal mudar:
watch(subtotal, () => {
  calculateShipping()
})

</script>