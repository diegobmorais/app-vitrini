<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 class="text-3xl font-semibold text-gray-800 mb-6">Página não encontrada</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link 
            to="/" 
            class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-md"
          >
            Voltar para a página inicial
          </router-link>
          <router-link 
            to="/products" 
            class="px-6 py-3 bg-white text-primary border border-primary rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Ver produtos
          </router-link>
        </div>
      </div>
      
      <div class="mt-16 w-full max-w-md">
        <h3 class="text-xl font-medium text-gray-800 mb-4">Você pode tentar:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li>Verificar se o endereço digitado está correto</li>
          <li>Voltar para a página anterior</li>
          <li>Navegar pelo menu principal</li>
          <li>Usar a busca para encontrar o que procura</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage',
    metaInfo: {
      title: 'Página não encontrada'
    }
  }
  </script>
  