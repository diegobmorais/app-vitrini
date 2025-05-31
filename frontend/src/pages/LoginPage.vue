<template>
  <div class="login-page min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isRegisterMode ? 'Criar uma conta' : 'Entrar na sua conta' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isRegisterMode ? 'Preencha os dados abaixo para se cadastrar' : 'Entre com seu e-mail e senha' }}
        </p>
      </div>

      <!-- Login/Register Form -->
      <form class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Name Field (Register only) -->
          <div v-if="isRegisterMode">
            <label for="name" class="sr-only">Nome completo</label>
            <input id="name" name="name" type="text" v-model="form.name" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nome completo" />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email-address" class="sr-only">Endereço de e-mail</label>
            <input id="email-address" name="email" type="email" v-model="form.email" autocomplete="email" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Endereço de e-mail" />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div class="relative">
            <label for="password" class="sr-only">Senha</label>
            <input id="password" name="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
              autocomplete="current-password" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="isRegisterMode ? 'Crie uma senha' : 'Senha'" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd" />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password Field (Register only) -->
          <div v-if="isRegisterMode" class="relative">
            <label for="password-confirm" class="sr-only">Confirmar senha</label>
            <input id="password-confirm" name="password_confirmation" :type="showPassword ? 'text' : 'password'"
              v-model="form.passwordConfirmation" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirme sua senha" />
            <p v-if="errors.passwordConfirmation" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirmation }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" v-model="form.rememberMe"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Lembrar de mim
            </label>
          </div>

          <div v-if="!isRegisterMode" class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="isLoading">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!isLoading" class="h-5 w-5 text-primary-dark group-hover:text-primary-light"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ isRegisterMode ? 'Cadastrar' : 'Entrar' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="mt-2 text-sm text-gray-600">
          {{ isRegisterMode ? 'Já tem uma conta?' : 'Ainda não tem uma conta?' }}
          <button type="button" @click="toggleMode" class="font-medium text-primary hover:text-primary-dark">
            {{ isRegisterMode ? 'Entrar' : 'Cadastre-se' }}
          </button>
        </p>
      </div>

      <!-- Social Login -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">
              Ou continue com
            </span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <div>
            <a href="#"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>

          <div>
            <a href="#"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'


export default {
  name: 'LoginPage',
  metaInfo() {
    return {
      title: this.isRegisterMode ? 'Cadastro' : 'Login'
    }
  },
  setup() {
    const router = useRouter()
    const isRegisterMode = ref(false)
    const showPassword = ref(false)
    const isLoading = ref(false)

    const form = reactive({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      rememberMe: false
    })

    const errors = reactive({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    })

    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value

      // Limpar formulário e erros
      Object.keys(form).forEach(key => {
        form[key] = key === 'rememberMe' ? false : ''
      })

      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    const validateForm = () => {
      let isValid = true

      // Limpar erros anteriores
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      // Validar nome (apenas no modo de registro)
      if (isRegisterMode.value && !form.name.trim()) {
        errors.name = 'O nome é obrigatório'
        isValid = false
      }

      // Validar email
      if (!form.email.trim()) {
        errors.email = 'O e-mail é obrigatório'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Digite um e-mail válido'
        isValid = false
      }

      // Validar senha
      if (!form.password) {
        errors.password = 'A senha é obrigatória'
        isValid = false
      } else if (isRegisterMode.value && form.password.length < 8) {
        errors.password = 'A senha deve ter pelo menos 8 caracteres'
        isValid = false
      }

      // Validar confirmação de senha (apenas no modo de registro)
      if (isRegisterMode.value && form.password !== form.passwordConfirmation) {
        errors.passwordConfirmation = 'As senhas não coincidem'
        isValid = false
      }

      return isValid
    }
    const submitForm = async () => {
      if (!validateForm()) return

      isLoading.value = true

      try {
        const url = isRegisterMode.value ? 'register' : 'login'
        const payload = isRegisterMode.value
          ? {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation
          }
          : {
            email: form.email,
            password: form.password,
          }

        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        store.dispatch('auth/login', {
          user: response.data.user,
          token: response.data.token
        })

        // Redireciona após sucesso
        router.push('/minha-conta')
      } catch (error) {
        console.error('Erro:', error)
        if (error.response && error.response.data && error.response.data.errors) {
          const validationErrors = error.response.data.errors
          Object.keys(validationErrors).forEach(key => {
            errors[key] = validationErrors[key][0]
          })
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      isRegisterMode,
      showPassword,
      isLoading,
      form,
      errors,
      toggleMode,
      submitForm
    }
  }
}
</script>