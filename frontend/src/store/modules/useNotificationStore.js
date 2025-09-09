import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const loading = ref(false)
  const templates = ref([])


  // Actions
  async function fetchTemplates() {
    loading.value = true
    try {
      const response = await api.get('/api/notifications')

      if (!response.status || response.status !== 200) {
        throw new Error('Failed to fetch notification templates')
      }
      templates.value = await response.data
    } catch (error) {
      console.error('Error fetching notification templates:', error)
    } finally {
      loading.value = false
    }
  }

  async function saveTemplate() {
    loading.value = true
    try {
      const response = await api.post('/api/notifications', { template: templates.value })
      if (!response.status || response.status !== 200) {
        throw new Error('Failed to save notification template')
      }
    } catch (error) {
      console.error('Error saving notification template:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateTemplate(id, updatedTemplate) {
    const { data } = await api.patch(`/api/notifications/${id}`, updatedTemplate);
    const index = this.templates.findIndex((t) => t.id === id);
    if (index !== -1) this.templates[index] = data.template;
  }

  return {
    //state
    loading,
    templates,

    //actions
    fetchTemplates,
    saveTemplate,
    updateTemplate
  }

})
