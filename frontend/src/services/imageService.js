import api from '@/main'

export const imageService = {

  async getProductImages (productId){
    const response = await api.get(`/api/products/${productId}/images`)
    return response.data
  },

  async uploadProductImages (productId, files){
    const formData = new FormData()
    for (const file of files) {
      formData.append('images[]', file)
    }

    const response = await api.post(`/api/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  },

  removeTempImage(tempPath) {
    return api.delete('/api/delete-temp-image', { params: { temp_path: tempPath } });
  },

  async deleteProductImage (imageId) {
    await api.delete(`/api/images/${imageId}`)
  }
}