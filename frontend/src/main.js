import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import axios from "axios"
import "./assets/css/tailwind.css"
import { useAuthStore } from "./store/modules/useAuthStore"
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Ícones que você deseja usar
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faShoppingCart, faHeart, faGithub)

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
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(Toast)
app.use(pinia)
app.use(router)
app.mount("#app")
