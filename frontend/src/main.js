import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "@/store"
import axios from "axios"
import "./assets/css/tailwind.css"

// Configuração global do AxiosAdd commentMore actions
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/'

// Interceptor para tratamento de erros
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    const isAuth = store.getters['auth/isAuthenticated'];

    if (isAuth) {
      store.dispatch('auth/logout');
    }

    if (router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' });
    }
  }
  return Promise.reject(error);
});
export default axios;

const app = createApp(App)

app.use(router)
app.use(store)

app.mount("#app")
