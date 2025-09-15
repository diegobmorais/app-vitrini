<template>
    <div class="about-page container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Seção de cabeçalho -->
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Sobre Nossa Empresa</h1>
          <p class="text-xl text-gray-600">Conheça nossa história, missão e valores que nos guiam todos os dias.</p>
        </div>
        
        <!-- Seção de história -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p class="text-gray-700 mb-4">
                Fundada em 2010, nossa empresa começou como uma pequena loja de produtos para animais de estimação em uma garagem. Com dedicação e paixão pelos animais, rapidamente nos expandimos para atender a crescente demanda por produtos de qualidade.
              </p>
              <p class="text-gray-700 mb-4">
                Ao longo dos anos, construímos uma reputação sólida baseada na qualidade dos produtos, atendimento excepcional e compromisso com o bem-estar animal. Hoje, somos orgulhosamente uma das principais referências no mercado pet.
              </p>
              <p class="text-gray-700">
                Nossa jornada continua com o mesmo entusiasmo do primeiro dia, sempre buscando inovação e excelência para proporcionar o melhor para os pets e seus tutores.
              </p>
            </div>
            <div class="rounded-lg overflow-hidden shadow-lg">
              <img src="/placeholder.svg?height=400&width=600" alt="História da empresa" class="w-full h-auto" />
            </div>
          </div>
        </section>
        
        <!-- Seção de missão, visão e valores -->
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Missão, Visão e Valores</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2 text-center">Missão</h3>
              <p class="text-gray-700 text-center">
                Proporcionar produtos e serviços de alta qualidade que contribuam para o bem-estar e felicidade dos animais de estimação e fortaleçam o vínculo entre pets e seus tutores.
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2 text-center">Visão</h3>
              <p class="text-gray-700 text-center">
                Ser reconhecida como referência nacional em produtos para pets, destacando-se pela inovação, sustentabilidade e compromisso com a causa animal.
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2 text-center">Valores</h3>
              <ul class="text-gray-700 space-y-2">
                <li class="flex items-center">
                  <span class="mr-2">•</span> Amor e respeito pelos animais
                </li>
                <li class="flex items-center">
                  <span class="mr-2">•</span> Ética e transparência
                </li>
                <li class="flex items-center">
                  <span class="mr-2">•</span> Qualidade e inovação
                </li>
                <li class="flex items-center">
                  <span class="mr-2">•</span> Responsabilidade socioambiental
                </li>
                <li class="flex items-center">
                  <span class="mr-2">•</span> Compromisso com o cliente
                </li>
              </ul>
            </div>
          </div>
        </section>
        <!-- Seção de compromisso social -->
        <section>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Compromisso Social</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <img src="/placeholder.svg?height=400&width=600" alt="Ações sociais" class="w-full h-auto" />
            </div>
            <div>
              <p class="text-gray-700 mb-4">
                Acreditamos que nossa responsabilidade vai além de oferecer produtos de qualidade. Por isso, mantemos um compromisso ativo com causas sociais relacionadas ao bem-estar animal.
              </p>
              <p class="text-gray-700 mb-4">
                Regularmente, realizamos campanhas de adoção, doações para abrigos e ONGs, além de programas educativos sobre posse responsável e cuidados com os animais.
              </p>
              <p class="text-gray-700">
                Parte de nosso lucro é destinado a projetos que promovem o resgate, tratamento e reabilitação de animais abandonados ou em situação de risco.
              </p>
              <div class="mt-6">
                <router-link to="/contact" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Entre em contato
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useHead } from '@vueuse/head'
  
  useHead({
    title: 'Sobre Nós'
  })
  </script>
  
  