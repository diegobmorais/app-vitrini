import { defineStore } from 'pinia'
import api from '@/main'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
    }),
    actions: {
        addToCart(product, quantity = 1) {
            const existing = this.items.find(i => i.id === product.id)
            if (existing) {
                existing.quantity += quantity
            } else {
                this.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images?.[0]?.url || null
                })
            }
        },
        async fetchItems() {
            const { data } = await api.get('/cart')
            this.items = data.items
        },
        async addItem(productId, quantity = 1) {
            const { data } = await api.post('/cart/items', { product_id: productId, quantity })
            this.items = data.items
        },
        async updateQuantity(itemId, quantity) {
            const { data } = await api.patch(`/cart/items/${itemId}`, { quantity })
            this.items = data.items
        },
        async removeItem(itemId) {
            const { data } = await api.delete(`/cart/items/${itemId}`)
            this.items = data.items
        },
        async clearCart() {
            await api.delete('/cart')
            this.items = []
        }
    }
})
