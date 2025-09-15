<template>
  <div class="landing-content">
    <h2>Configurações da Landing Page</h2>

    <div class="upload-section">
      <h3>Logo</h3>
      <input type="file" @change="onFileChange('logo', $event)" accept="image/*" />
      <img v-if="preview.logo" :src="preview.logo" class="preview-image" />
    </div>

    <div class="upload-section">
      <h3>Banner da Home</h3>
      <input type="file" @change="onFileChange('banner', $event)" accept="image/*" />
      <img v-if="preview.banner" :src="preview.banner" class="preview-image" />
    </div>

    <div class="text-section">
      <h3>Missão</h3>
      <textarea v-model="content.mission" placeholder="Descreva a missão da empresa..." rows="4"></textarea>
    </div>

    <div class="text-section">
      <h3>Visão</h3>
      <textarea v-model="content.vision" placeholder="Descreva a visão da empresa..." rows="4"></textarea>
    </div>

    <div class="text-section">
      <h3>Valores</h3>
      <textarea v-model="content.values" placeholder="Liste os valores da empresa..." rows="4"></textarea>
    </div>

    <div class="text-section">
      <h3>Nossa História</h3>
      <textarea v-model="content.history" placeholder="Conte a história da empresa..." rows="6"></textarea>
    </div>

    <button @click="saveContent" class="save-btn">Salvar Conteúdo</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Estrutura de conteúdo (virá da API)
const content = ref({
  mission: 'Nossa missão é transformar vidas através da tecnologia.',
  vision: 'Ser referência global em soluções digitais até 2030.',
  values: 'Inovação, Ética, Compromisso, Excelência.',
  history: 'Fundada em 2010, nossa empresa começou como uma startup...'
})

const preview = ref({
  logo: null,
  banner: null
})

const onFileChange = (type, event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      preview.value[type] = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveContent = async () => {
  // Aqui você montaria FormData e enviaria para Laravel
  // const formData = new FormData()
  // formData.append('mission', content.value.mission)
  // formData.append('logo', logoFile) etc...

  console.log('Salvando conteúdo da landing:', content.value)
  defineEmits(['saved'])('saved', 'Conteúdo da landing page atualizado!')
}
</script>

<style scoped>
.landing-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.upload-section,
.text-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.upload-section h3,
.text-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

input[type="file"] {
  margin-bottom: 1rem;
}

.preview-image {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
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