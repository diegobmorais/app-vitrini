import { createStore } from "vuex"
import auth from "./modules/auth"
import cart from "./modules/cart"
import products from "./modules/products"
import categories from "./modules/categories"
import notifications from "./modules/notifications"
import suppliers from "./modules/suppliers"
import customers from "./modules/customers"
import inventory from "./modules/inventory"
import orders from "./modules/orders"
import tags from "./modules/tags"
import brands from "./modules/brands"

export default createStore({
  modules: {
    auth,
    cart,
    products,
    categories,
    tags,
    brands,
    notifications,
    suppliers,
    customers,
    inventory,
    orders,
  },
})
