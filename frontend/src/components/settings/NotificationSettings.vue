<template>
    <div class="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl border border-blue-200 space-y-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Configurações de Notificações</h2>
            <p class="text-blue-600 text-sm font-medium">Personalize as mensagens enviadas para seus clientes por
                categoria</p>
        </div>

        <!-- Tabs -->
        <div class="flex flex-wrap gap-1 bg-white p-2 rounded-2xl shadow-sm border border-blue-100">
            <button v-for="category in categories" :key="category.name" @click="activeCategory = category.name" :class="[
                'px-6 py-3 font-medium text-sm rounded-xl transition-all duration-300',
                'hover:shadow-md hover:-translate-y-1',
                activeCategory === category.name
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-transparent hover:border-blue-200'
            ]">
                {{ category.name }}
            </button>
        </div>

        <!-- Conteúdo da Tab -->
        <div class="max-h-[420px] overflow-y-auto mt-6 space-y-6 pr-2 custom-scrollbar">
            <div v-for="template in getTemplatesByCategory(categories.find(c => c.name === activeCategory))"
                :key="template.id"
                class="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

                <!-- Accordion interno para cada template -->
                <button @click="template.open = !template.open"
                    class="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 flex justify-between items-center hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-125 transition-transform"></div>
                        <span class="font-semibold text-gray-800">{{ template.type }}</span>
                    </div>
                    <span class="text-blue-600 font-bold transform transition-transform"
                        :class="{ 'rotate-45': template.open }">+</span>
                </button>

                <div v-show="template.open" class="p-6 space-y-5">
                    <div class="relative">
                        <textarea v-model="template.message" rows="4"
                            class="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none text-gray-700 leading-relaxed"
                            placeholder="Digite a mensagem para este template..."></textarea>
                        <div class="absolute top-3 right-4 text-xs text-blue-600 font-medium">
                            {{ template.message?.length || 0 }} caracteres
                        </div>
                    </div>

                    <div v-if="template.variables?.length" class="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                        <div class="flex items-center mb-2">
                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <strong class="text-blue-800 font-medium">Variáveis disponíveis:</strong>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <span v-for="variable in template.variables" :key="variable"
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                {{ variable }}
                            </span>
                        </div>
                    </div>

                    <div v-if="template.variables?.length" class="bg-green-50 border border-green-200 p-4 rounded-xl">
                        <div class="flex items-center mb-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <strong class="text-green-800 font-medium">Pré-visualização:</strong>
                        </div>
                        <p
                            class="text-gray-700 text-sm leading-relaxed mt-2 bg-white p-3 rounded-lg border border-gray-200">
                            {{ getPreview(template) }}
                        </p>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button @click="saveTemplate(template)"
                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useNotificationStore } from "@/store/modules/useNotificationStore";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

const store = useNotificationStore();
const activeCategory = ref('Onboarding')
const toast = useToast();

onMounted(() => {
    store.fetchTemplates();
});

const categories = [
    { name: 'Onboarding', type: ['Bem-vindo', 'Confirmação de cadastro', 'Alteração de senha'] },
    { name: 'Pedidos', type: ['Confirmação de pedido', 'Pedido enviado', 'Pedido entregue', 'Pedido cancelado', 'Pagamento pendente', 'Novo pedido recebido'] },
    { name: 'Agendamentos', type: ['Confirmação de agendamento', 'Cancelamento de agendamento', 'Reagendamento', 'Agendamento marcado'] },
    { name: 'Estoque', type: ['Produto fora de estoque', 'Estoque baixo'] },
]

const saveTemplate = async (template) => {
    await store.updateTemplate(template.id, {
        message: template.message,
        enable_email: template.enable_email,
        enable_sms: template.enable_sms,
    });
    toast.success("Configuração salva com sucesso!");
};

const exampleValues = {
    '{{name}}': 'João',
    '{{order_id}}': '#12345',
    '{{service}}': 'Banho e Tosa',
    '{{product}}': 'Ração Premium',
    '{{pet_name}}': 'Rex',
    '{{min_stock}}': '3',
    '{{user}}': 'Maria',
    '{{data}}': '15/09/2025'
}

const getPreview = (template) => {
    let message = template.message

    if (template.variables && template.variables.length) {
        template.variables.forEach(variable => {
            message = message.replaceAll(variable, exampleValues[variable] || '______')
        })
    }

    return message
}

const getTemplatesByCategory = (category) => {
    return store.templates.filter(t => category.type.includes(t.type))
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
}
</style>