import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import axios from "axios"
import "./assets/css/tailwind.css"
import { useAuthStore } from "./store/modules/useAuthStore"
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'


// Configuração global do Axios
axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost/"
let isLoggingOut = false
// Interceptor para tratamento de erros
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()

      if (!isLoggingOut && authStore.isAuthenticated) {
        isLoggingOut = true

        authStore.clearSession()

        const currentRoute = router.currentRoute.value
        if (currentRoute.meta.requiresAuth && currentRoute.name !== "login") {
          router.push({ name: "login", query: { redirect: currentRoute.fullPath } })
        }

        isLoggingOut = false
      }
    }

    return Promise.reject(error)
  }
)
export default axios

// Criação do app
const app = createApp(App)
const pinia = createPinia()

app.use(Toast)
app.use(pinia)
app.use(router)
app.mount("#app")
