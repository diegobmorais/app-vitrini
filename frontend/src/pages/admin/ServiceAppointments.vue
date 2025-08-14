<!-- src/views/admin/services/ServiceAppointments.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agendamentos de Serviços</h1>
        <p class="text-gray-600">Gerencie os agendamentos realizados pelos clientes</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select 
          v-model="filters.status" 
          @change="applyFilters"
          class="border border-gray-300 rounded-md p-2"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <input 
          v-model="filters.date" 
          @change="applyFilters"
          type="date" 
          class="border border-gray-300 rounded-md p-2"
          placeholder="Filtrar por data"
        />

        <select 
          v-model="filters.service_id" 
          @change="applyFilters"
          class="border border-gray-300 rounded-md p-2"
        >
          <option value="">Todos os serviços</option>
          <option 
            v-for="service in services" 
            :key="service.id" 
            :value="service.id"
          >
            {{ service.name }}
          </option>
        </select>

        <div class="flex space-x-2">
          <button 
            @click="applyFilters"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Filtrar
          </button>
          <button 
            @click="resetFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Agendamentos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transporte</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="appointment in appointments" :key="appointment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ appointment.client_name }}</div>
                <div class="text-sm text-gray-500">{{ appointment.client_phone }}</div>
                <div v-if="appointment.client_email" class="text-xs text-gray-400">{{ appointment.client_email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ appointment.service?.name || 'Serviço não encontrado' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ appointment.pet_name }}</div>
                <div class="text-sm text-gray-500">{{ appointment.pet_breed || 'Raça não informada' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(appointment.scheduled_at) }}<br>
                <span class="text-xs">{{ formatTime(appointment.scheduled_at) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span 
                  :class="appointment.transport_option === 'pickup' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ appointment.transport_option === 'pickup' ? 'Buscar' : 'Levar' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  :value="appointment.status"
                  @change="updateStatus(appointment.id, $event.target.value)"
                  class="text-sm border border-gray-300 rounded px-2 py-1"
                  :class="getStatusClass(appointment.status)"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDetails(appointment)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Detalhes
                </button>
                <button 
                  v-if="appointment.status !== 'completed' && appointment.status !== 'cancelled'"
                  @click="editAppointment(appointment)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Editar
                </button>
              </td>
            </tr>
            <tr v-if="appointments.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhum agendamento encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ appointments.length }}</span> agendamentos
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span class="px-3 py-1 text-sm">
              Página {{ pagination.current_page }} de {{ pagination.last_page }}
            </span>
            <button 
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeDetailsModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Detalhes do Agendamento
                </h3>
                <div class="mt-4 space-y-3">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Cliente</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment?.client_name }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Telefone</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment?.client_phone }}</p>
                    </div>
                    <div v-if="selectedAppointment?.client_email">
                      <label class="block text-sm font-medium text-gray-700">E-mail</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment.client_email }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Serviço</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment?.service?.name }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Pet</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment?.pet_name }}</p>
                    </div>
                    <div v-if="selectedAppointment?.pet_breed">
                      <label class="block text-sm font-medium text-gray-700">Raça</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedAppointment.pet_breed }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Data/Hora</label>
                      <p class="mt-1 text-sm text-gray-900">
                        {{ formatDate(selectedAppointment?.scheduled_at) }} às {{ formatTime(selectedAppointment?.scheduled_at) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Transporte</label>
                      <p class="mt-1 text-sm text-gray-900">
                        {{ selectedAppointment?.transport_option === 'pickup' ? 'Cliente buscará o pet' : 'Loja levará o pet' }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Status</label>
                      <span 
                        :class="getStatusClass(selectedAppointment?.status)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{ getStatusText(selectedAppointment?.status) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedAppointment?.notes">
                    <label class="block text-sm font-medium text-gray-700">Observações</label>
                    <p class="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{{ selectedAppointment.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="closeDetailsModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppointmentStore } from '@/store/modules/useAppointmentStore'
import { useServiceStore } from '@/store/modules/useServiceStore'
import { ref, computed, onMounted, watch } from 'vue'


const appointmentStore = useAppointmentStore()
const serviceStore = useServiceStore()

// Estados
const showDetailsModal = ref(false)
const selectedAppointment = ref(null)
const filters = ref({
  status: '',
  date: '',
  service_id: ''
})

// Paginação
const pagination = computed(() => appointmentStore.pagination)

// Dados
const appointments = computed(() => appointmentStore.appointments)
const services = computed(() => serviceStore.services)

// Lifecycle
onMounted(async () => {
  await Promise.all([
    appointmentStore.fetchAppointments(),
    serviceStore.fetchServices()
  ])
})

// Métodos
const applyFilters = () => {
  appointmentStore.filters = { ...filters.value }
  appointmentStore.fetchAppointments()
}

const resetFilters = () => {
  filters.value = { status: '', date: '', service_id: '' }
  appointmentStore.filters = { ...filters.value }
  appointmentStore.fetchAppointments()
}

const updateStatus = async (id, status) => {
  try {
    await appointmentStore.updateStatus(id, status)
    // Atualiza localmente sem recarregar tudo
  } catch (err) {
    alert('Erro ao atualizar status')
  }
}

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAppointment.value = null
}

const editAppointment = (appointment) => {
  // Implementar edição (opcional)
  alert('Função de edição não implementada')
}

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    appointmentStore.goToPage(pagination.value.current_page + 1)
  }
}

const prevPage = () => {
  if (pagination.value.current_page > 1) {
    appointmentStore.goToPage(pagination.value.current_page - 1)
  }
}

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatTime = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }
  return texts[status] || status
}
</script>