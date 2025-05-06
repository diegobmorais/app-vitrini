<template>
    <div>
      <!-- Overlay de fundo -->
      <div 
        v-if="isOpen" 
        class="cart-overlay" 
        @click="closeCart"
        v-bind:class="{ 'cart-overlay-active': isOpen }"
      ></div>
  
      <!-- Modal do carrinho -->
      <div class="cart-modal" v-bind:class="{ 'cart-modal-active': isOpen }">
        <div class="cart-header">
          <h2 class="cart-title">Seu Carrinho</h2>
          <button class="cart-close" @click="closeCart">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div class="cart-content">
          <!-- Mensagem de carrinho vazio -->
          <div v-if="items.length === 0" class="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Seu carrinho está vazio</p>
            <button @click="continueShopping" class="btn-continue">Continuar comprando</button>
          </div>
  
          <!-- Lista de itens no carrinho -->
          <div v-else>
            <div class="cart-item-list">
              <transition-group name="cart-item">
                <div 
                  v-for="item in items" 
                  :key="item.id" 
                  class="cart-item"
                >
                  <div class="cart-item-image">
                    <img :src="item.image" :alt="item.name">
                  </div>
                  
                  <div class="cart-item-details">
                    <h3>{{ item.name }}</h3>
                    <p class="cart-item-price">{{ formatPrice(item.price) }}</p>
                  </div>
                  
                  <div class="cart-item-quantity">
                    <button @click="decrementQuantity(item.id)" class="btn-quantity" :disabled="item.quantity <= 1">-</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button @click="incrementQuantity(item.id)" class="btn-quantity" :disabled="item.quantity >= item.stock">+</button>
                  </div>
                  
                  <div class="cart-item-subtotal">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                  
                  <button @click="removeFromCart(item.id)" class="btn-remove">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </transition-group>
            </div>
  
            <div class="cart-footer">
              <div class="cart-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="summary-row" v-if="discount > 0">
                  <span>Desconto:</span>
                  <span>-{{ formatPrice(discount) }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>{{ formatPrice(total) }}</span>
                </div>
              </div>
  
              <div class="cart-actions">
                <button @click="continueShopping" class="btn-secondary">Continuar comprando</button>
                <button @click="goToCheckout" class="btn-primary">Finalizar Compra</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'CartModal',
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState('cart', ['items']),
      ...mapGetters('cart', ['subtotal', 'discount', 'total'])
    },
    methods: {
      ...mapActions('cart', ['removeItem', 'updateQuantity', 'clearCart']),
      closeCart() {
        this.$emit('close');
      },
      removeFromCart(itemId) {
        this.removeItem(itemId);
        
        // Se o carrinho ficar vazio, notificar
        if (this.items.length === 0) {
          this.$store.dispatch('notifications/add', {
            type: 'info',
            title: 'Carrinho vazio',
            message: 'Você removeu todos os itens do carrinho.',
            timeout: 3000
          });
        }
      },
      incrementQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        
        if (item && item.quantity < item.stock) {
          this.updateQuantity({ id: itemId, quantity: item.quantity + 1 });
        } else {
          this.$store.dispatch('notifications/add', {
            type: 'warning',
            title: 'Estoque indisponível',
            message: `Apenas ${item.stock} unidades disponíveis em estoque.`,
            timeout: 3000
          });
        }
      },
      decrementQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        
        if (item && item.quantity > 1) {
          this.updateQuantity({ id: itemId, quantity: item.quantity - 1 });
        }
      },
      continueShopping() {
        this.closeCart();
        this.$router.push('/products');
      },
      goToCheckout() {
        this.closeCart();
        this.$router.push('/checkout');
      },
      formatPrice(value) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      }
    }
  }
  </script>
  
  <style scoped>
  .cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .cart-overlay-active {
    opacity: 1;
    visibility: visible;
  }
  
  .cart-modal {
    position: fixed;
    top: 0;
    right: -450px;
    width: 450px;
    height: 100%;
    background-color: white;
    z-index: 999;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .cart-modal-active {
    right: 0;
  }
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .cart-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #212529;
  }
  
  .cart-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #6c757d;
    padding: 5px;
    transition: color 0.2s;
  }
  
  .cart-close:hover {
    color: #343a40;
  }
  
  .cart-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #6c757d;
  }
  
  .cart-item-list {
    margin-bottom: 20px;
  }
  
  .cart-item {
    display: grid;
    grid-template-columns: 80px 1fr 100px 100px 30px;
    gap: 15px;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #e9ecef;
  }
  
  .cart-item-image {
    width: 80px;
    height: 80px;
    background-color: #f8f9fa;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cart-item-details h3 {
    font-size: 1rem;
    margin: 0 0 5px 0;
    color: #212529;
  }
  
  .cart-item-price {
    color: #6c757d;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .cart-item-quantity {
    display: flex;
    align-items: center;
  }
  
  .btn-quantity {
    width: 26px;
    height: 26px;
    border: 1px solid #dee2e6;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #495057;
    transition: all 0.2s;
  }
  
  .btn-quantity:hover:not(:disabled) {
    background-color: #e9ecef;
  }
  
  .btn-quantity:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .quantity {
    padding: 0 10px;
    font-weight: 500;
  }
  
  .cart-item-subtotal {
    font-weight: 600;
    color: #343a40;
  }
  
  .btn-remove {
    background: transparent;
    border: none;
    color: #dc3545;
    cursor: pointer;
    padding: 5px;
    transition: color 0.2s;
  }
  
  .btn-remove:hover {
    color: #c82333;
  }
  
  .cart-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
  }
  
  .cart-summary {
    margin-bottom: 20px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .summary-row.total {
    font-weight: 700;
    font-size: 1.2rem;
    margin-top: 10px;
    border-top: 1px solid #e9ecef;
    padding-top: 10px;
  }
  
  .cart-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .btn-primary {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #fa5252;
  }
  
  .btn-secondary {
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    padding: 12px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background-color: #e9ecef;
  }
  
  .btn-continue {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.2s;
  }
  
  .btn-continue:hover {
    background-color: #fa5252;
  }
  
  /* Animações */
  .cart-item-enter-active,
  .cart-item-leave-active {
    transition: all 0.3s;
  }
  
  .cart-item-enter-from,
  .cart-item-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  
  /* Responsividade */
  @media (max-width: 576px) {
    .cart-modal {
      width: 100%;
      right: -100%;
    }
    
    .cart-item {
      grid-template-columns: 60px 1fr 80px;
      grid-template-rows: auto auto;
      gap: 10px;
    }
    
    .cart-item-quantity {
      grid-column: 2;
      grid-row: 2;
    }
    
    .cart-item-subtotal {
      grid-column: 3;
      grid-row: 1 / span 2;
      align-self: center;
    }
    
    .btn-remove {
      grid-column: 3;
      grid-row: 1;
      justify-self: end;
      align-self: start;
    }
  }
  </style>
  