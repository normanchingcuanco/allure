<script setup>
import { ref, onMounted } from "vue";
import { useGlobalStore } from "../stores/global";
import ThemeToggle from "./ThemeToggle.vue";

const globalStore = useGlobalStore();
const { user } = globalStore;

const logoSrc = ref("/allure-logo-dark.svg");

const updateLogo = () => {
  const theme = localStorage.getItem("theme");

  if (theme === "light") {
    logoSrc.value = "/allure-logo-light.svg";
  } else {
    logoSrc.value = "/allure-logo-dark.svg";
  }
};

onMounted(() => {
  updateLogo();

  // Listen for theme changes
  window.addEventListener("storage", updateLogo);
});
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top shadow-sm custom-navbar">
    <div class="container">

      <!-- 🔥 Dynamic Logo -->
      <router-link :to="{ name: 'Home' }" class="navbar-brand logo-wrapper">
        <img :src="logoSrc" alt="Logo" class="logo-img" />
      </router-link>

      <!-- ✅ FIXED TOGGLE BUTTON -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- ✅ FIXED ID (must match data-bs-target) -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto">

          <!-- Products Link or Dashboard for admins -->
          <router-link :to="{ name: 'Products' }" class="nav-link">
            {{ user.isAdmin ? 'Dashboard' : 'Products' }}
          </router-link>

          <!-- Not Logged In -->
          <template v-if="!user.email">
            <router-link :to="{ name: 'Register' }" class="nav-link">
              Register
            </router-link>
            <router-link :to="{ name: 'Login' }" class="nav-link">
              Login
            </router-link>
          </template>

          <!-- Logged In -->
          <template v-else>
            <router-link :to="{ name: 'Profile' }" class="nav-link">
              Profile
            </router-link>

            <router-link :to="{ name: 'Logout' }" class="nav-link">
              Logout
            </router-link>

            <router-link to="/cart" class="nav-link cart-link">
              <i class="bi bi-cart3 fs-5"></i>
              <span v-if="globalStore.cartCount > 0" class="cart-badge">
                {{ globalStore.cartCount > 99 ? '99+' : globalStore.cartCount }}
              </span>
            </router-link>
          </template>

          <ThemeToggle />
        </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s ease;
}

/* Make toggler visible in dark theme */
.navbar-toggler {
  border: 1px solid var(--border);
}

.navbar-toggler-icon {
  filter: invert(1);
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 60px;
  object-fit: contain;
  transition: 0.3s ease;
}

.nav-link {
  color: var(--text-primary) !important;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--accent) !important;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>