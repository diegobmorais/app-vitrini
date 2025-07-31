import { defineStore } from 'pinia';
import api from '@/main';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    product: null,
    items: [],
    loading: false,
    error: null,
    filters: {
      category: null,
      search: "",
      minPrice: null,
      maxPrice: null,
      sort: "featured",

    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 12,
    },
    uploadSessionId: null,
    uploadedImages: [],
  }),

  getters: {
    getProducts: state => state.products,
    getProduct: state => state.product,
    isLoading: state => state.loading,
    getError: state => state.error,
    getFilters: state => state.filters,
    getPagination: state => state.pagination,
  },

  actions: {
    async fetchProducts() {
      try {
        this.loading = true;

        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.perPage,
          category_id: this.filters.category,
          search: this.filters.search,
          min_price: this.filters.minPrice,
          max_price: this.filters.maxPrice,
          sort: this.filters.sort,
        };

        const response = await api.get('api/product', { params });

        this.products = response.data.data;
        this.pagination = {
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          perPage: response.data.per_page,
        };
        this.error = null;

        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar produtos';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(slug) {
      try {
        this.loading = true;
        const response = await api.get(`api/product-detail/${slug}`);
        this.product = response.data;
        this.error = null;
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar produto';
        console.error('Error fetching product:', error);
      } finally {
        this.loading = false;
      }
    },

    async createProduct(payload) {
      try {
        const response = await api.post('/api/product', payload);
        return response.data;
      } catch (error) {
        console.error('Erro ao criar produto: ', error.response.data)
        throw error
      }
    },

    async updateProduct({ id, data }) {
      try {
        const response = await api.put(`/api/product/${id}`, data)
        return response.data.data
      } catch (error) {
        console.error('Erro ao atualizar produto:', error.response.data)
        throw error
      }
    },
    async deleteProduct(id) {
      const response = await api.delete(`/api/product/${id}`)
      return response
    },

    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.currentPage = 1;
      this.fetchProducts();
    },

    changePage(page) {
      this.pagination.currentPage = page;
      this.fetchProducts();
    },

    resetFilters() {
      this.filters = {
        category: null,
        search: "",
        minPrice: null,
        maxPrice: null,
        sort: "featured",
      };
      this.pagination.currentPage = 1;
      this.fetchProducts();
    },

    async uploadTempImages(files) {
      if (!this.uploadSessionId) {
        this.uploadSessionId = crypto.randomUUID();
      }

      const formData = new FormData();
      formData.append('upload_session_id', this.uploadSessionId);

      for (const file of files) {
        formData.append('images[]', file);
      }

      try {
        const response = await api.post('/api/uploads/temp-images', formData);
        this.uploadedImages.push(...response.data.images);
      } catch (err) {
        console.error('Erro ao enviar imagens:', err);
      }
    },

    resetUploadSession() {
      this.uploadSessionId = null;
      this.uploadedImages = [];
    },
  }
});
