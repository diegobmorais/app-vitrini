import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "@/store"
import axios from "axios"
import "./assets/css/tailwind.css"

// Configuração global do AxiosAdd commentMore actions
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
axios.defaults.headers.common["Accept"] = "application/json"

// Adiciona o token CSRF para requisições
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
  axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content
}
// Interceptor para tratamento de erros
axios.interceptors.request.use(async (config) => {
  // Verifica se é uma requisição que precisa de CSRF
  const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase());

  if (requiresCsrf) {
    try {
      // Obtém o cookie CSRF
      await axios.get('sanctum/csrf-cookie', {
        withCredentials: true
      });

      // Extrai o token do cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      // Adiciona o token ao header se existir
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
      }
    } catch (error) {
      console.error('Erro ao obter CSRF token:', error);
    }
  }
  return config;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    store.dispatch('auth/logout');
    router.push('/login');
  }
  return Promise.reject(error);
});
export default axios;

const app = createApp(App)

app.use(router)
app.use(store)

app.mount("#app")
