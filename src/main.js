// ===============================
// Router Setup
// ===============================

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { useGlobalStore } from "./stores/global";

// Global Styles
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/main.css";
import "notyf/notyf.min.css";

import App from "./App.vue";

// ===============================
// Import Pages
// ===============================
import LandingPage from "./pages/LandingPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailsPage from "./pages/ProductDetailsPage.vue";
import AdminDashboardPage from "./pages/AdminDashboardPage.vue";
import AdminOrdersPage from "./pages/AdminOrdersPage.vue";
import LogoutPage from "./pages/LogoutPage.vue";
import AddProductPage from "./pages/AddProductPage.vue";
import EditProductPage from "./pages/EditProductPage.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import AddServicePage from "./pages/AddServicePage.vue";
import CartViewPage from "./pages/CartViewPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.vue";

// ===============================
// Define Routes
// ===============================
const routes = [

  // ✅ Landing Page
  { path: "/", name: "Home", component: LandingPage },

  { path: "/register", name: "Register", component: RegisterPage },

  { path: "/login", name: "Login", component: LoginPage },

  { path: "/logout", name: "Logout", component: LogoutPage },

  // 🔒 Protected Routes
  { path: "/products", name: "Products", component: ProductsPage, meta: { requiresAuth: true } },

  { path: "/products/create", name: "AddProduct", component: AddProductPage, meta: { requiresAuth: true } },

  { path: "/products/edit/:id", name: "EditProduct", component: EditProductPage, meta: { requiresAuth: true } },

  { path: "/products/:id", name: "ProductDetails", component: ProductDetailsPage, meta: { requiresAuth: true } },

  { path: "/admin", name: "AdminDashboard", component: AdminDashboardPage, meta: { requiresAuth: true } },

  { path: "/admin/orders", name: "AdminOrders", component: AdminOrdersPage, meta: { requiresAuth: true } },

  { path: "/profile", name: "Profile", component: ProfilePage, meta: { requiresAuth: true } },

  { path: "/profile/add-service", name: "AddService", component: AddServicePage, meta: { requiresAuth: true } },

  { path: "/cart", name: "Cart", component: CartViewPage, meta: { requiresAuth: true } },

  { path: "/checkout", name: "Checkout", component: CheckoutPage, meta: { requiresAuth: true } },

  { path: "/orders/:id", name: "OrderConfirmation", component: OrderConfirmationPage, meta: { requiresAuth: true } },
];

// ===============================
// Create Router
// ===============================
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===============================
// Router Guard
// ===============================
router.beforeEach(async (to, from, next) => {

  const globalStore = useGlobalStore();
  const token = localStorage.getItem("token");

  // Load user if token exists
  if (token && !globalStore.user.email) {
    try {
      await globalStore.getUserDetails(token);
    } catch (err) {
      console.error("User load failed:", err);
    }
  }

  // 🔒 Only block protected routes
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  next();
});

// ===============================
// Create App
// ===============================
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");