import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/main";

export const useServiceAvailabilityStore = defineStore("serviceAvailability", () => {
  // STATE 
  const slots = ref([]);
  const appointments = ref([]);
  const selectedServiceIds = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const rules = ref([]);
  const exceptions = ref([]);

  // ACTIONS  
  const fetchAvailableSlots = async ({ start_date, end_date, service_ids }) => {
    const response = await api.get("api/calendar/slots", {
      params: { start_date, end_date, service_ids },
    });
    slots.value = response.data;
    return response.data;
  };

  const bookSlotByAdmin = async (slot_id, pet_name, notes, transport_option) => {
    try {
      const response = await api.post("api/calendar/book-by-admin", {
        slot_id,
        pet_name,
        notes,
        transport_option,
      });
      return response;
    } catch (err) {
      console.error("Erro na requisição:", err);
      throw err;
    }
  };

  const blockSlot = async (slot_id) => {
    await api.post("api/calendar/block", { slot_id });
    const slot = slots.value.find((s) => s.slot_id === slot_id);
    if (slot) slot.status = "blocked";
  };

  const unblockSlot = async (slot_id) => {
    await api.post("api/calendar/unblock", { slot_id });
    const slot = slots.value.find((s) => s.slot_id === slot_id);
    if (slot) slot.status = "open";
  };

  // Busca slots disponíveis por serviço
  const fetchAvailableSlotsByService = async ({ service_id, start_date }) => {
    const { data } = await api.get("/api/availability", {
      params: { service_id, start_date },
    });
    slots.value = data.days || [];
    return data.days;
  };

  // Cria novos slots de horários
  const createTimeSlots = async (payload) => {
     loading.value = true

    try {     
      const response = await api.post("/api/generate-slots", payload);
    
      return response.data;
    } catch (err) {
      error.value = err;
      loading.value = false;
      throw err;
    } finally {
      loading.value = false;
    }
  };
 
  return {
    // State
    slots,
    appointments,
    selectedServiceIds,
    loading,
    error,
    rules,
    exceptions,

    // Actions
    fetchAvailableSlots,
    bookSlotByAdmin,
    blockSlot,
    unblockSlot,
    fetchAvailableSlotsByService,
    createTimeSlots,
  };
});
