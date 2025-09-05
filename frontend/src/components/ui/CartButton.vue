<template>
    <div class="relative flex items-center">
        <!-- Botão do carrinho -->
        <button @click="goToCart"
            class="relative flex items-center space-x-2 px-3 py-2  bg-primary-600 hover:bg-primary-700 transition duration-200 text-white">
            <!-- Ícone do carrinho -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.3 5.3A1 1 0 007.6 20h8.8a1 1 0 00.97-.76L21 13M16 21a1 1 0 11-2 0m6 0a1 1 0 11-2 0" />
            </svg>

            <!-- Quantidade de itens -->
            <span v-if="cartItemCount > 0"
                class="bg-white text-primary-600 rounded-full px-2 py-0.5 text-xs font-semibold shadow">
                {{ cartItemCount }}
            </span>

            <!-- Total -->
            <span v-if="cartTotal > 0" class="hidden sm:inline font-semibold">
                R$ {{ cartTotal.toFixed(2) }}
            </span>
        </button>

        <!-- Badge de notificação -->
        <span v-if="cartItemCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
            {{ cartItemCount }}
        </span>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/store/modules/userCartStore";

// Importa o store do carrinho
const cartStore = useCartStore();
const router = useRouter();

// Computed properties para os dados do carrinho
const cartItemCount = computed(() => cartStore.cartItemCount);
const cartTotal = computed(() => cartStore.cartSummary.total || 0);

// Função para navegar para o carrinho
const goToCart = () => {
    router.push({ name: "checkout" });
};

onMounted(async () => {  
    await cartStore.fetchItems();
});
</script>
