import { defineStore } from 'pinia'
import api from '@/main';

// stores/inventory.js
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    products: [],
    selectedProductHistory: null,
    movementHistory: [],
    showHistoryModal: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },
    metrics: {
      total: 0,
      in_stock: 0,
      low_stock: 0,
      out_of_stock: 0
    },
    loading: false,
    error: null,
    search: '',
    categoryFilter: '',
    stockFilter: 'all'
  }),

  getters: {
    //
  },

  actions: {
    async fetchStock() {
      this.loading = true
      this.error = null
      try {
        const params = {
          search: this.search || undefined,
          category_id: this.categoryFilter ? Number(this.categoryFilter) : undefined,
          stock: this.stockFilter !== 'all' ? this.stockFilter : undefined,
          page: this.pagination.current_page
        }

        const response = await api.get('/api/stock', { params })

        this.products = response.data.products
        this.pagination = response.data.pagination
        this.metrics = response.data.metrics
      } catch (err) {
        this.error = 'Erro ao carregar estoque'
      } finally {
        this.loading = false
      }
    },

    async addMovement(movement) {
      try {
        await api.post('/api/stock', movement)
      } catch (error) {
        this.error = 'erro ao carregar estoque'
      } finally {
        this.loading = false
      }
    },
    async fetchHistoryInventory(productId){
      try {
        const response = await api.get(`/api/stock-movements/product/${productId}`)
        this.movementHistory = response.data
        this.selectedProductHistory = this.products.find(p => p.id === productId)
        this.showHistoryModal= true
      } catch (err) {       
        alert('Erro ao carregar histórico')
      }
    },

    // Atualiza busca e recarrega
    setSearch(value) {
      this.search = value
      this.goToPage(1)
    },
    setCategoryFilter(value) {
      this.categoryFilter = value
      this.goToPage(1)
      this.fetchStock()
    },

    setStockFilter(value) {
      this.stockFilter = value
      this.goToPage(1)
      this.fetchStock()
    },

    goToPage(page) {
      this.pagination.current_page = page
      this.fetchStock()
    },

    prevPage() {
      if (this.pagination.current_page > 1) {
        this.goToPage(this.pagination.current_page - 1)
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.goToPage(this.pagination.current_page + 1)
      }
    }
  }
})
