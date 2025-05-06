<template>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group">
      <!-- Product Image with Badge -->
      <div class="relative">
        <!-- Wishlist Button -->
        <button 
          @click.stop="toggleWishlist" 
          class="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{ 'text-red-500': isInWishlist }"
        >
          <i class="fas" :class="isInWishlist ? 'fa-heart' : 'fa-heart'"></i>
        </button>
        
        <!-- Sale Badge -->
        <div 
          v-if="product.discount_percentage > 0" 
          class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10"
        >
          -{{ product.discount_percentage }}%
        </div>
        
        <!-- New Badge -->
        <div 
          v-if="isNewProduct" 
          class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10"
        >
          Novo
        </div>
        
        <!-- Product Image -->
        <div class="h-48 overflow-hidden">
          <img 
            :src="product.image || '/images/placeholder.jpg'" 
            :alt="product.name" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >
        </div>
        
        <!-- Quick Actions -->
        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="flex space-x-2">
            <button 
              @click.stop="$emit('quick-view', product)" 
              class="bg-white text-gray-800 rounded-full p-2 hover:bg-primary-500 hover:text-white transition"
              title="Visualização Rápida"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              @click.stop="$emit('add-to-cart', product, 1)" 
              class="bg-white text-gray-800 rounded-full p-2 hover:bg-primary-500 hover:text-white transition"
              title="Adicionar ao Carrinho"
            >
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="p-4">
        <!-- Category -->
        <div class="text-xs text-gray-500 mb-1">{{ categoryName }}</div>
        
        <!-- Product Name -->
        <h3 class="font-medium text-gray-900 mb-1 truncate">
          <router-link :to="`/produto/${product.slug}`" class="hover:text-primary-600 transition">
            {{ product.name }}
          </router-link>
        </h3>
        
        <!-- Rating -->
        <div class="flex items-center mb-2">
          <div class="flex text-yellow-400">
            <i v-for="i in 5" :key="i" class="fas" :class="i <= product.rating ? 'fa-star' : 'fa-star text-gray-300'"></i>
          </div>
          <span class="text-xs text-gray-500 ml-1">({{ product.reviews_count || 0 }})</span>
        </div>
        
        <!-- Price -->
        <div class="flex items-center">
          <span 
            v-if="product.original_price && product.original_price > product.price" 
            class="text-gray-500 line-through text-sm mr-2"
          >
            R$ {{ product.original_price.toFixed(2) }}
          </span>
          <span class="text-primary-600 font-bold">R$ {{ product.price.toFixed(2) }}</span>
        </div>
        
        <!-- Stock Status -->
        <div class="mt-2 flex items-center text-xs">
          <span 
            v-if="product.stock_status === 'in_stock'" 
            class="text-green-600 flex items-center"
          >
            <i class="fas fa-check-circle mr-1"></i> Em estoque
          </span>
          <span 
            v-else-if="product.stock_status === 'low_stock'" 
            class="text-yellow-600 flex items-center"
          >
            <i class="fas fa-exclamation-circle mr-1"></i> Estoque baixo
          </span>
          <span 
            v-else 
            class="text-red-600 flex items-center"
          >
            <i class="fas fa-times-circle mr-1"></i> Fora de estoque
          </span>
        </div>
        
        <!-- Add to Cart Button -->
        <button 
          @click="$emit('add-to-cart', product, 1)"
          class="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition"
          :disabled="product.stock_status === 'out_of_stock'"
          :class="{ 'opacity-50 cursor-not-allowed': product.stock_status === 'out_of_stock' }"
        >
          <i class="fas fa-shopping-cart mr-1"></i> Adicionar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: {
        type: Object,
        required: true
      },
      categories: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        isInWishlist: false
      }
    },
    computed: {
      categoryName() {
        if (!this.product.category_id) return '';
        const category = this.categories.find(c => c.id === this.product.category_id);
        return category ? category.name : '';
      },
      isNewProduct() {
        if (!this.product.created_at) return false;
        const productDate = new Date(this.product.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return productDate >= thirtyDaysAgo;
      }
    },
    methods: {
      toggleWishlist() {
        this.isInWishlist = !this.isInWishlist;
        // This would be replaced with an actual API call
        // Example: 
        // if (this.isInWishlist) {
        //   axios.post('/api/wishlist', { product_id: this.product.id });
        // } else {
        //   axios.delete(`/api/wishlist/${this.product.id}`);
        // }
        
        this.$emit('toggle-wishlist', {
          product: this.product,
          added: this.isInWishlist
        });
      }
    }
  }
  </script>
  