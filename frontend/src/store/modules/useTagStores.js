import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useTagStore = defineStore('tags', () => {
  // State
  const tags = ref([])

  // Getters
  const allTags = computed(() => tags.value)

  // Actions
  async function fetchTags() {
    try {
      const response = await api.get('api/tags')
      tags.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  return {
    tags,
    allTags,
    fetchTags,
  }
})
