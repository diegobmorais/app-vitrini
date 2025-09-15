<template>
    <div class="admin-profile-container">  

        <Tabs :tabs="tabs" v-model:activeTab="activeTab" />

        <div class="tab-content">
            <component :is="currentTabComponent" @saved="handleSave" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tabs from '@/components/admin/Tabs.vue'
import ProfileInfo from '@/components/admin/ProfileInfo.vue'
import FaqSection from '@/components/admin/FaqSection.vue'
import LandingSettings from '@/components/admin/LandingSettings.vue'

// Lista de abas
const tabs = [
    { id: 'profile', label: 'Informações Pessoais', component: ProfileInfo },
    { id: 'faq', label: 'Perguntas Frequentes', component: FaqSection },
    { id: 'landing', label: 'Conteúdo da Landing Page', component: LandingSettings }
]

// Aba ativa
const activeTab = ref('profile')

// Componente atual baseado na aba ativa
const currentTabComponent = computed(() => {
    return tabs.find(tab => tab.id === activeTab.value)?.component
})

// Tratamento de salvamento (opcional: exibir toast, recarregar, etc)
const handleSave = (message) => {
    alert(message || 'Dados salvos com sucesso!')
}
</script>

<style scoped>
.admin-profile-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
}

.tab-content {
    margin-top: 2rem;
}
</style>