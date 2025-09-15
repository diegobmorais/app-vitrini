<!-- src/components/admin/tabs/ProfileInfo.vue -->
<template>
    <div class="profile-form">
        <h2>Informações Pessoais</h2>
        <form @submit.prevent="saveProfile">
            <div class="form-group">
                <label for="name">Nome Completo</label>
                <input id="name" v-model="form.name" type="text" required />
            </div>

            <div class="form-group">
                <label for="email">E-mail</label>
                <input id="email" v-model="form.email" type="email" required />
            </div>

            <div class="form-group">
                <label for="phone">Telefone</label>
                <input id="phone" v-model="form.phone" type="tel" />
            </div>

            <div class="form-group">
                <label for="address">Endereço</label>
                <textarea id="address" v-model="form.address" rows="3"></textarea>
            </div>

            <button type="submit" class="save-btn">Salvar Alterações</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Simulando dados do admin (no seu caso, virá da API)
const form = ref({
    name: 'João Silva',
    email: 'joao@admin.com',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123, São Paulo - SP'
})

const saveProfile = async () => {
    // Aqui você faria a chamada para a API Laravel
    console.log('Salvando perfil:', form.value)
    // await api.put('/admin/profile', form.value)

    // Emitir evento de sucesso
    defineEmits(['saved'])('saved', 'Perfil atualizado com sucesso!')
}
</script>

<style scoped>
.profile-form h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

.save-btn {
    background: #28a745;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.save-btn:hover {
    background: #218838;
}
</style>