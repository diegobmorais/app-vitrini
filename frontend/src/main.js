import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"
import "./assets/css/tailwind.css"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

api.interceptors.request.use(async (config) => {
  // Verifica se é uma requisição que precisa de CSRF
  const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase());

  if (requiresCsrf) {
    try {
      // Obtém o cookie CSRF
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}sanctum/csrf-cookie`, {
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
api.interceptors.response.use(response => {
  // Verifica se é a resposta de login
  if (response.config.url.includes('/login') && response.status === 200) {
    // Armazena os dados do usuário e sessão
    store.dispatch('auth/setUser', response.data.user);
    localStorage.setItem('session_id', response.data.session_id);
  }
  return response;
}, error => {
  if (error.response?.status === 401) {
    store.dispatch('auth/logout');
    router.push('/login');
  }
  return Promise.reject(error);
});

export { api };
export default api;

const app = createApp(App)

app.use(router)
app.use(store)

app.mount("#app")
