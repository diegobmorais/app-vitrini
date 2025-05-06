import { createRouter, createWebHistory } from "vue-router"
import store from "../store"

// Importação de componentes de página
import HomePage from "../pages/HomePage.vue"
import ProductsPage from "../pages/ProductsPage.vue"
import ProductDetailPage from "../pages/ProductDetailPage.vue"
import CartPage from "../pages/CartPage.vue"
import CheckoutPage from "../pages/CheckoutPage.vue"
import RegisterPage from "../pages/RegisterPage.vue"
import LoginPage from "../pages/LoginPage.vue"
import ContactPage from "../pages/ContactPage.vue"
import AboutPage from "../pages/AboutPage.vue"
import AccountPage from "../pages/AccountPage.vue"
import NotFoundPage from "../pages/NotFoundPage.vue"
import AdminLayout from "../pages/admin/AdminLayout.vue"
import ProductForm from "../pages/admin/ProductForm.vue"
import Products from "../pages/admin/Products.vue"
import Dashboard from "../pages/admin/Dashboard.vue"
import Customers from "../pages/admin/Customers.vue"
import Suppliers from "../pages/admin/Suppliers.vue"
import Settings from "../pages/admin/Settings.vue"
import CustomerForm from "../pages/admin/CustomerForm.vue"
import SupplierForm from "../pages/admin/SupplierForm.vue"
import Inventory from "../pages/admin/Inventory.vue"
import Orders from "../pages/admin/Orders.vue"
import Services from "../pages/admin/Services.vue"
import ServicePage from "../pages/ServicePage.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { title: "Início" },
  },
  {
    path: "/produtos",
    name: "products",
    component: ProductsPage,
    meta: { title: "Produtos" },
  },
  {
    path: "/servicos",
    name: 'services',
    component: ServicePage
  },
  {
    path: "/produto/:slug",
    name: "product-detail",
    component: ProductDetailPage,
    props: true,
    meta: { title: "Detalhes do Produto" },
  },
  {
    path: "/categoria/:slug",
    name: "category",
    component: ProductsPage,
    props: true,
    meta: { title: "Categoria" },
  },
  {
    path: "/carrinho",
    name: "cart",
    component: CartPage,
    meta: { title: "Carrinho de Compras" },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutPage,
    meta: { title: "Finalizar Compra", requiresAuth: true },
  },
  {
    path: "/cadastro",
    name: "register",
    component: RegisterPage,
    meta: { title: "Criar Conta", guestOnly: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { title: "Entrar", guestOnly: true },
  },
  {
    path: "/contato",
    name: "contact",
    component: ContactPage,
    meta: { title: "Contato" },
  },
  {
    path: "/sobre",
    name: "about",
    component: AboutPage,
    meta: { title: "Sobre Nós" },
  },
  {
    path: "/minha-conta",
    name: "account",
    component: AccountPage,
    meta: { title: "Minha Conta" /*, requiresAuth: true*/ },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: { title: "Página não encontrada" },
  },
  {
    path: "/painel-administrador",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/admin/produto/criar-produto",
        name: "create-product",
        component: ProductForm,
      },
      {
        path: "/painel-administrador/produtos",
        name: "admin-products",
        component: Products,
      },      
      {
        path: "/painel-administrador/clientes",
        name: "admin-customers",
        component: Customers,
      },
      {
        path: "/painel-administrador/cliente/create",
        name: "admin-customer-create",
        component: CustomerForm,
      },
      {
        path: "/painel-administrador/cliente/:id/edit",
        name: "admin-customer-edit",
        component: CustomerForm,
        props: true,
      },
      {
        path: "/painel-administrador/fornecedores",
        name: "admin-suppliers",
        component: Suppliers,
      },
      {
        path: "/painel-administrador/fornecedor/create",
        name: "admin-supplier-create",
        component: SupplierForm,
      },
      {
        path: "/painel-administrador/fornecedor/:id/edit",
        name: "admin-supplier-edit",
        component: SupplierForm,
        props: true,
      },
      {
        path: "/painel-administrador/estoque",
        name: "admin-inventory",
        component: Inventory,
      },
      {
        path: "/painel-administrador/pedidos",
        name: "admin-orders",
        component: Orders,
      },
      {
        path: "/painel-administrador/configuracoes",
        name: "admin-settings",
        component: Settings,
      },
      {
        path: "/painel-administrador/servicos",
        name: "admin-services",
        component: Services,
      },
    ]
  } 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navegação global
router.beforeEach((to, from, next) => {
  // Atualizar título da página
  document.title = `${to.meta.title} | Pet Shop`

  // Verificar autenticação para rotas protegidas
  const isAuthenticated = store.getters["auth/isAuthenticated"]

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: "home" })
  } else {
    next()
  }
})

export default router
