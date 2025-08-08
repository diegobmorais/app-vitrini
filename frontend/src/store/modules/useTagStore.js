import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/main'

export const useTagStore = defineStore('tags', () => {
  // State
  const tags = ref([])

  // Getters
  const allTags = computed(() => tags.value)
  const tagCount = computed(() => tags.value.length)

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

  async function createTag(payload) {
    try {
      const response = await api.post('/api/tags', payload)
      tags.value = response.data
      await fetchTags()
      
      return response.data
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  }

  async function updateTag(id, payload) {
    try {
      const response = await api.put(`/api/tags/${id}`, payload)
      await fetchTags()

      return response.data
    } catch (error) {
      console.error('Error updating tag:', error)
      throw error
    }
  }

  async function deleteTag(id) {
    try {
      const response = await api.delete(`/api/tags/${id}`)
      tags.value = tags.value.filter(b => b.id !== id)

      return response.data
    } catch (error) {
      console.error('Error deleting tag:', error)
      throw error
    }
  }

  return {
    //getters
    tags,
    allTags,
    tagCount,

    //actions
    fetchTags,
    createTag,
    updateTag,
    deleteTag
  }
})
