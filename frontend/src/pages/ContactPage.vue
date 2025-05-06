<template>
    <div>
      <!-- Hero Section -->
      <div class="bg-primary-600 text-white py-16">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h1>
          <p class="text-lg md:text-xl max-w-2xl mx-auto">
            Estamos aqui para ajudar! Envie-nos uma mensagem e responderemos o mais breve possível.
          </p>
        </div>
      </div>
      
      <!-- Contact Information -->
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Phone -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-phone-alt text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Telefone</h3>
            <p class="text-gray-600 mb-4">Estamos disponíveis de segunda a sexta, das 9h às 18h</p>
            <a href="tel:+551199999999" class="text-primary-600 font-medium hover:text-primary-800 transition">
              (11) 99999-9999
            </a>
          </div>
          
          <!-- Email -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-envelope text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
            <p class="text-gray-600 mb-4">Envie-nos um e-mail e responderemos em até 24 horas</p>
            <a href="mailto:contato@petshop.com" class="text-primary-600 font-medium hover:text-primary-800 transition">
              contato@petshop.com
            </a>
          </div>
          
          <!-- Address -->
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-map-marker-alt text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Endereço</h3>
            <p class="text-gray-600 mb-4">Visite nossa loja física</p>
            <address class="not-italic text-primary-600 font-medium">
              Av. Paulista, 1000<br>
              Bela Vista, São Paulo - SP<br>
              CEP: 01310-100
            </address>
          </div>
        </div>
        
        <!-- Contact Form and Map -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Envie uma Mensagem</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required
                  >
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required
                  >
                </div>
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                >
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Assunto *</label>
                <select 
                  id="subject" 
                  v-model="form.subject"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                  <option value="Informações de pedido">Informações de pedido</option>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Sugestão">Sugestão</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Mensagem *</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  rows="5"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  required
                ></textarea>
              </div>
              
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    v-model="form.privacyAccepted"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    required
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="privacy" class="font-medium text-gray-700">
                    Concordo com a <a href="#" class="text-primary-600 hover:text-primary-800">Política de Privacidade</a> *
                  </label>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">
                    <i class="fas fa-spinner fa-spin mr-2"></i> Enviando...
                  </span>
                  <span v-else>Enviar Mensagem</span>
                </button>
              </div>
            </form>
          </div>
          
          <!-- Map -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="h-full min-h-[400px]">
              <!-- Replace with actual map implementation -->
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951333286!2d-46.65390548502211!3d-23.563273284682785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1623254987841!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      <!-- FAQ Section -->
      <div class="bg-gray-50 py-12">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          
          <div class="max-w-3xl mx-auto">
            <div class="space-y-4">
              <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-sm overflow-hidden">
                <button 
                  @click="toggleFaq(index)"
                  class="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                >
                  <span class="font-medium text-gray-900">{{ faq.question }}</span>
                  <i class="fas" :class="faq.open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
                <div v-if="faq.open" class="p-4 pt-0 text-gray-600">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          privacyAccepted: false
        },
        isSubmitting: false,
        faqs: [
          {
            question: 'Qual o prazo de entrega?',
            answer: 'O prazo de entrega varia de acordo com a sua localização. Em geral, entregamos em até 3 dias úteis para a cidade de São Paulo e região metropolitana, e até 7 dias úteis para outras localidades.',
            open: false
          },
          {
            question: 'Como posso rastrear meu pedido?',
            answer: 'Após a confirmação do envio, você receberá um e-mail com o código de rastreamento. Você pode acompanhar seu pedido através do nosso site na seção "Meus Pedidos" ou diretamente no site da transportadora.',
            open: false
          },
          {
            question: 'Quais são as formas de pagamento aceitas?',
            answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), boleto bancário, PIX e transferência bancária.',
            open: false
          },
          {
            question: 'Como funciona a política de trocas e devoluções?',
            answer: 'Você pode solicitar a troca ou devolução em até 7 dias após o recebimento do produto. O produto deve estar em perfeito estado, na embalagem original e com todos os acessórios. Entre em contato com nosso atendimento para iniciar o processo.',
            open: false
          },
          {
            question: 'Vocês oferecem serviços de banho e tosa?',
            answer: 'Sim, oferecemos serviços de banho e tosa em nossa loja física. Você pode agendar pelo telefone ou diretamente em nossa loja.',
            open: false
          }
        ]
      }
    },
    methods: {
      submitForm() {
        this.isSubmitting = true;
        
        // This would be replaced with an actual API call
        // Example: axios.post('/api/contact', this.form)
        //   .then(response => {
        //     this.$toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        //     this.resetForm();
        //   })
        //   .catch(error => {
        //     this.$toast.error('Erro ao enviar mensagem. Por favor, tente novamente.');
        //   })
        //   .finally(() => {
        //     this.isSubmitting = false;
        //   });
        
        // Placeholder logic
        setTimeout(() => {
          this.$toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
          this.resetForm();
          this.isSubmitting = false;
        }, 2000);
      },
      resetForm() {
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          privacyAccepted: false
        };
      },
      toggleFaq(index) {
        this.faqs.forEach((faq, i) => {
          if (i === index) {
            faq.open = !faq.open;
          } else {
            faq.open = false;
          }
        });
      }
    }
  }
  </script>
  