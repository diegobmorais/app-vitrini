<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Criar Conta</h1>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="registerUser" class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input type="text" id="first-name" v-model="form.firstName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Sobrenome *</label>
                  <input type="text" id="last-name" v-model="form.lastName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input type="email" id="email" v-model="form.email"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input type="tel" id="phone" v-model="form.phone"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="cpf" class="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input type="text" id="cpf" v-model="form.cpf"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="birth-date" class="block text-sm font-medium text-gray-700 mb-1">Data de
                    Nascimento</label>
                  <input type="date" id="birth-date" v-model="form.birthDate"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Endereço</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="zip-code" class="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <div class="flex">
                    <input type="text" id="zip-code" v-model="form.zipCode"
                      class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                      required>
                    <button type="button" @click="searchZipCode"
                      class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-r-md transition">
                      Buscar
                    </button>
                  </div>
                </div>

                <div>
                  <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                  <input type="text" id="street" v-model="form.street"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="number" class="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input type="text" id="number" v-model="form.number"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="complement" class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input type="text" id="complement" v-model="form.complement"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50">
                </div>

                <div>
                  <label for="neighborhood" class="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input type="text" id="neighborhood" v-model="form.neighborhood"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input type="text" id="city" v-model="form.city"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <select id="state" v-model="form.state"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                  <input type="password" id="password" v-model="form.password"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>

                <div>
                  <label for="password-confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirmar
                    Senha *</label>
                  <input type="password" id="password-confirmation" v-model="form.passwordConfirmation"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    required>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input type="checkbox" id="terms" v-model="form.termsAccepted"
                  class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" required>
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  Eu concordo com os <a href="#" class="text-primary-600 hover:text-primary-800">Termos de Uso</a> e <a
                    href="#" class="text-primary-600 hover:text-primary-800">Política de Privacidade</a> *
                </label>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input type="checkbox" id="newsletter" v-model="form.newsletterSubscribed"
                  class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
              </div>
              <div class="ml-3 text-sm">
                <label for="newsletter" class="font-medium text-gray-700">
                  Desejo receber ofertas e novidades por e-mail
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button type="submit"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition"
                :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Processando...
                </span>
                <span v-else>Criar Conta</span>
              </button>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Já tem uma conta?
                <router-link to="/login" class="text-primary-600 hover:text-primary-800 font-medium">
                  Faça login
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification' // ou outra lib de toast que estiver usando

const router = useRouter()
const toast = useToast()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cpf: '',
  birthDate: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  password: '',
  passwordConfirmation: '',
  termsAccepted: false,
  newsletterSubscribed: false
})

const isSubmitting = ref(false)

function searchZipCode() {
  if (!form.zipCode || form.zipCode.length < 8) {
    toast.error('Por favor, insira um CEP válido.')
    return
  }

  isSubmitting.value = true

  // Simulação de chamada API para busca de endereço por CEP
  setTimeout(() => {
    if (form.zipCode === '01310100') {
      form.street = 'Avenida Paulista'
      form.neighborhood = 'Bela Vista'
      form.city = 'São Paulo'
      form.state = 'SP'
    } else {
      toast.error('CEP não encontrado. Por favor, verifique o CEP informado.')
    }
    isSubmitting.value = false
  }, 1000)
}

function registerUser() {
  if (form.password !== form.passwordConfirmation) {
    toast.error('As senhas não coincidem.')
    return
  }

  isSubmitting.value = true

  // Simulação de chamada API para cadastro
  setTimeout(() => {
    toast.success('Conta criada com sucesso!')
    router.push('/login')
    isSubmitting.value = false
  }, 2000)
}
</script>