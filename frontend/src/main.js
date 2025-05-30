import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"
import "./assets/css/tailwind.css"

// Configuração global do Axios
axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
axios.defaults.headers.common["Accept"] = "application/json"

// Adiciona o token CSRF para requisições
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
  axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content
}

// Interceptor para tratamento de erros
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch("auth/logout")
      router.push({ name: "login" })
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)

app.use(router)
app.use(store)

app.mount("#app")
