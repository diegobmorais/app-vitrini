import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from '@/main';

export const useCustomerStore = defineStore("customer", () => {
  // States
  const customers = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const allCustomers = computed(() => customers.value);
  const activeCustomers = computed(() =>
    customers.value.filter((customer) => customer.active)
  );
  const customerById = (id) => customers.value.find((c) => c.id === id);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);

  function removeCustomer(id) {
    customers.value = customers.value.filter((c) => c.id !== id);
  }

  function setLoading(status) {
    loading.value = status;
  }

  function setError(err) {
    error.value = err;
  }

  async function fetchCustomers() {
    try {          
      setLoading(true)
      setError(null);
      const response = await api.get("/api/customer");
      customers.value = response.data.customer;

      return response.data.customer
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  async function deleteCustomer(id) {
    try {
      setLoading(true);
      await api.delete(`/api/customer/${id}`);
      removeCustomer(id);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // Return
  return {
    customers,
    loading,
    error,

    allCustomers,
    activeCustomers,
    customerById,
    isLoading,
    hasError,

    fetchCustomers,
    deleteCustomer,
  };
});
