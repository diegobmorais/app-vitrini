<template>
    <div v-if="show"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition duration-300">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">

            <!-- Cabeçalho -->
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 class="text-xl font-semibold text-gray-800">Gerenciar Horários</h2>
                <button @click="emit('close')"
                    class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                    aria-label="Fechar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>

            <!-- Abas (Tabs) - Design elegante e neutro -->
            <div class="px-6">
                <div class="flex border-b border-gray-200 mb-6">
                    <button @click="activeTab = 'rules'" :class="[
                        'py-3 px-2 flex-1 text-center text-sm font-medium transition-all duration-300 relative',
                        activeTab === 'rules'
                            ? 'text-blue-700 font-semibold'
                            : 'text-gray-500 hover:text-gray-700'
                    ]">
                        Criar Regras
                        <span v-if="activeTab === 'rules'"
                            class="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-blue-700 transform -translate-x-1/2 rounded-full"></span>
                    </button>
                    <button @click="activeTab = 'slots'" :class="[
                        'py-3 px-2 flex-1 text-center text-sm font-medium transition-all duration-300 relative',
                        activeTab === 'slots'
                            ? 'text-blue-700 font-semibold'
                            : 'text-gray-500 hover:text-gray-700'
                    ]">
                        Gerar Agenda
                        <span v-if="activeTab === 'slots'"
                            class="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-blue-700 transform -translate-x-1/2 rounded-full"></span>
                    </button>
                </div>
            </div>

            <!-- Conteúdo -->
            <div class="px-6 pb-6">

                <!-- Aba: Criar Regras -->
                <div v-if="activeTab === 'rules'" class="space-y-5 animate-slideIn">
                    <form @submit.prevent="handleRuleSubmit" class="space-y-5">

                        <!-- Serviço -->
                        <div v-if="useService.services.length > 0">
                            <label class="block text-sm font-medium text-gray-600 mb-2">Serviço</label>
                            <div class="relative">
                                <select v-model="ruleForm.service_id"
                                    class="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    required>
                                    <option disabled value="">Selecione um serviço</option>
                                    <option v-for="service in useService.services" :key="service.id"
                                        :value="service.id">
                                        {{ service.name }}
                                    </option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Dias da Semana -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Dias da Semana</label>
                            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                <label v-for="(day, idx) in weekDays" :key="idx"
                                    class="flex items-center justify-center py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                                    :class="{ 'bg-blue-100 text-blue-800 border border-blue-200': ruleForm.days.includes(idx) }">
                                    <input type="checkbox" :value="idx" v-model="ruleForm.days" class="sr-only" />
                                    {{ day.substring(0, 3) }}
                                </label>
                            </div>
                        </div>

                        <!-- Horários -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">Início</label>
                                <input type="time" v-model="ruleForm.start_time"
                                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-2">Fim</label>
                                <input type="time" v-model="ruleForm.end_time"
                                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    required />
                            </div>
                        </div>

                        <!-- Duração -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Duração do Slot</label>
                            <div class="relative">
                                <select v-model="ruleForm.slot_duration"
                                    class="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    required>
                                    <option value="30">30 minutos</option>
                                    <option value="60">60 minutos</option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <label class="flex items-center cursor-pointer group">
                                <div class="relative">
                                    <input type="checkbox" v-model="ruleForm.is_active" class="sr-only" />
                                    <div :class="[
                                        'w-10 h-6 rounded-full transition-all duration-300 flex items-center px-1',
                                        ruleForm.is_active ? 'bg-blue-600' : 'bg-gray-300'
                                    ]">
                                        <div class="w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out"
                                            :class="{ 'translate-x-4': ruleForm.is_active }"></div>
                                    </div>
                                </div>
                                <span
                                    class="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-700 transition">Ativar
                                    Regra</span>
                            </label>
                        </div>

                        <!-- Botão Salvar -->
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gray-800 text-white font-medium py-3 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                            <span v-if="loading" class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Salvando...
                            </span>
                            <span v-else>Salvar Regra</span>
                        </button>
                    </form>
                </div>

                <!-- Aba: Gerar Slots -->
                <div v-else class="space-y-5 animate-slideIn">
                    <form @submit.prevent="handleSubmit" class="space-y-5">

                        <!-- Serviço -->
                        <div v-if="useService.services.length > 0">
                            <label class="block text-sm font-medium text-gray-600 mb-2">Serviço</label>
                            <div class="relative">
                                <select v-model="form.service_id"
                                    class="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    required>
                                    <option disabled value="">Selecione um serviço</option>
                                    <option v-for="service in useService.services" :key="service.id"
                                        :value="service.id">
                                        {{ service.name }}
                                    </option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Data Inicial -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Data Inicial</label>
                            <input type="date" v-model="form.start_date"
                                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                required />
                        </div>

                        <!-- Data Final -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Data Final</label>
                            <input type="date" v-model="form.end_date"
                                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                required />
                        </div>

                        <!-- Botão Gerar -->
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gray-800 text-white font-medium py-3 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                            <span v-if="loading" class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Gerando...
                            </span>
                            <span v-else>Gerar Slots</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useServiceStore } from "@/store/modules/useServiceStore"
import { useToast } from "vue-toastification"

const toast = useToast()
const useService = useServiceStore()
const props = defineProps({
    show: { type: Boolean, required: true },
})
const emit = defineEmits(["close", "saved"])

const activeTab = ref("rules")
const loading = ref(false)

const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

// FORM REGRAS
const ruleForm = ref({
    service_id: "",
    days: [],
    start_time: "",
    end_time: "",
    slot_duration: 30,
    is_active: true,
})

// FORM SLOTS
const form = ref({
    service_id: "",
    start_date: "",
    end_date: "",
    slot_duration: 60,
})

const isFormValid = computed(() => {
    return form.value.service_id && form.value.start_date && form.value.end_date
})

const handleRuleSubmit = async () => {
    try {
        loading.value = true
        for (const day of ruleForm.value.days) {
            await useService.createServiceRule({
                ...ruleForm.value,
                day_of_week: day,
            })
        }
        toast.success("Regra salva com sucesso")
        ruleForm.value.days = []
    } catch (err) {
        console.error(err)
        toast.error("Erro ao salvar regra")
    } finally {
        loading.value = false
    }
}

const handleSubmit = () => {
    if (!isFormValid.value) return
    emit("saved", { ...form.value })
}

onMounted(async () => {
    await useService.fetchServices()
})
</script>

<style scoped>
.animate-slideIn {
    animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>