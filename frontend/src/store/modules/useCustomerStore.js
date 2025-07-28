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
      setLoading(true);
      // Simulação de chamada à API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                name: "Ana Silva",
                document: "123.456.789-00",
                email: "ana.silva@email.com",
                phone: "(11) 98765-4321",
                orders_count: 5,
                active: true,
                avatar: null,
              },
              {
                id: 2,
                name: "Carlos Oliveira",
                document: "987.654.321-00",
                email: "carlos.oliveira@email.com",
                phone: "(11) 91234-5678",
                orders_count: 3,
                active: true,
                avatar: null,
              },
              {
                id: 3,
                name: "Mariana Santos",
                document: "456.789.123-00",
                email: "mariana.santos@email.com",
                phone: "(11) 94567-8901",
                orders_count: 0,
                active: false,
                avatar: null,
              },
            ],
          });
        }, 500);
      });

      setCustomers(response.data);
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
