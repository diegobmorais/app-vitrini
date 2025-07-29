import { defineStore } from "pinia";
import { ref, computed } from "vue";

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

  // Mutations (funções que alteram o estado)
  function setCustomers(data) {
    customers.value = data;
  }
  function addCustomer(customer) {
    customers.value.push(customer);
  }
  function updateCustomer(updatedCustomer) {
    const index = customers.value.findIndex((c) => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers.value.splice(index, 1, updatedCustomer);
    }
  }
  function removeCustomer(id) {
    customers.value = customers.value.filter((c) => c.id !== id);
  }
  function setLoading(status) {
    loading.value = status;
  }
  function setError(err) {
    error.value = err;
  }

  // Actions (operações assíncronas)
  async function fetchCustomers() {
    try {     
     

      // setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveCustomer(customer) {
    try {
      setLoading(true);
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (customer.id) {
        updateCustomer(customer);
      } else {
        const newId = Date.now();
        addCustomer({ ...customer, id: newId });
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCustomer(id) {
    try {
      setLoading(true);
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 500));
      removeCustomer(id);
      setError(null);
    } catch (err) {
      setError(err.message);
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
    saveCustomer,
    deleteCustomer,
  };
});
