<script setup>
import { ref, onMounted, computed } from "vue";
import { useGlobalStore } from "../stores/global";
import { useRoute } from "vue-router";
import ThemeToggle from "./ThemeToggle.vue";

const globalStore = useGlobalStore();
const { user } = globalStore;

const route = useRoute();

const logoSrc = ref("/allure-logo-dark.svg");

const updateLogo = () => {
  const theme = localStorage.getItem("theme");
  logoSrc.value =
    theme === "light"
      ? "/allure-logo-light.svg"
      : "/allure-logo-dark.svg";
};

onMounted(() => {
  updateLogo();
  window.addEventListener("storage", updateLogo);
});

// ✅ Hide navbar completely on landing page
const hideNavbar = computed(() => {
  return route.name === "Home";
});

// ✅ Only show authenticated navigation
const isAuthenticated = computed(() => {
  return !!user.email;
});
</script>

<template>
  <nav
    v-if="!hideNavbar"
    class="navbar navbar-expand-lg sticky-top shadow-sm custom-navbar"
  >
    <div class="container">

      <router-link :to="{ name: 'Home' }" class="navbar-brand logo-wrapper">
        <img :src="logoSrc" alt="Logo" class="logo-img" />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto">

          <!-- ✅ ONLY WHEN LOGGED IN -->
          <template v-if="isAuthenticated">

            <router-link
              :to="{ name: 'Products' }"
              class="nav-link"
            >
              {{ user.isAdmin ? "Dashboard" : "Products" }}
            </router-link>

            <router-link
              :to="{ name: 'Profile' }"
              class="nav-link"
            >
              Profile
            </router-link>

            <router-link
              :to="{ name: 'Logout' }"
              class="nav-link"
            >
              Logout
            </router-link>

          </template>

          <!-- ✅ PUBLIC USERS -->
          <template v-else>

            <router-link
              v-if="route.name !== 'Login'"
              :to="{ name: 'Login' }"
              class="nav-link"
            >
              Login
            </router-link>

            <router-link
              v-if="route.name !== 'Register'"
              :to="{ name: 'Register' }"
              class="nav-link"
            >
              Register
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
}

.logo-img {
  height: 60px;
}

.nav-link {
  color: var(--text-primary) !important;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--accent) !important;
}

.navbar-toggler {
  border: 1px solid var(--border);
}

.navbar-toggler-icon {
  filter: invert(1);
}
</style>