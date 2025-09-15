<template>
    <div class="faq-manager">
        <h2>Perguntas Frequentes</h2>

        <!-- Formulário para nova pergunta -->
        <div class="new-faq">
            <h3>Adicionar Nova Pergunta</h3>
            <div class="form-group">
                <input v-model="newFaq.question" placeholder="Pergunta" />
            </div>
            <div class="form-group">
                <textarea v-model="newFaq.answer" placeholder="Resposta" rows="3"></textarea>
            </div>
            <button @click="addFaq" class="add-btn">Adicionar</button>
        </div>

        <!-- Lista de FAQs existentes -->
        <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
                <div class="faq-header">
                    <input v-model="faq.question" placeholder="Pergunta" />
                    <button @click="removeFaq(index)" class="remove-btn">×</button>
                </div>
                <textarea v-model="faq.answer" placeholder="Resposta" rows="3"></textarea>
            </div>
        </div>

        <button @click="saveFaqs" class="save-btn">Salvar Perguntas</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Simulando FAQs (virão da API)
const faqs = ref([
    { question: 'Como faço para me cadastrar?', answer: 'Basta clicar em "Cadastre-se" e preencher o formulário.' },
    { question: 'Quais são os meios de pagamento?', answer: 'Aceitamos cartão de crédito, boleto e PIX.' }
])

const newFaq = ref({ question: '', answer: '' })

const addFaq = () => {
    if (newFaq.value.question && newFaq.value.answer) {
        faqs.value.push({ ...newFaq.value })
        newFaq.value = { question: '', answer: '' }
    }
}

const removeFaq = (index) => {
    faqs.value.splice(index, 1)
}

const saveFaqs = async () => {
    // Enviar para Laravel: await api.put('/admin/faq', { faqs: faqs.value })
    console.log('Salvando FAQs:', faqs.value)
    defineEmits(['saved'])('saved', 'Perguntas frequentes atualizadas!')
}
</script>

<style scoped>
.faq-manager h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
}

.new-faq {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.new-faq h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.add-btn {
    background: #007bff;
    color: white;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.faq-list {
    margin: 2rem 0;
}

.faq-item {
    background: #fafafa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #eee;
}

.faq-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.faq-header input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.remove-btn {
    background: #dc3545;
    color: white;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
}

.save-btn {
    background: #28a745;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
}
</style>