<template>
  <div class="container py-5" style="max-width: 500px;">
    <h1 class="mb-4 text-center">Login</h1>

    <form @submit.prevent="handleLogin">

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <button
        type="submit"
        class="btn btn-dark w-100"
      >
        Login
      </button>

    </form>
  </div>
</template>

<script setup>


import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { useGlobalStore } from "../stores/global";
import { Notyf } from 'notyf';


const email = ref("");
const password = ref("");
const error = ref("");

const notyf = new Notyf();

const router = useRouter();

const { getUserDetails, user } = useGlobalStore();


const handleLogin = async () => {
  error.value = "";
  try {
    const res = await api.post("/users/login", {
      email: email.value,
      password: password.value
    });

    if (res.data.access) {
      notyf.success("Login Successful");
      localStorage.setItem("token", res.data.access);
      await getUserDetails(res.data.access);
      email.value = "";
      password.value = "";

      if (user.isAdmin) {
        router.push("/products/");
      } else {
        router.push("/products/");
      }

    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    if (err.response && err.response.data && err.response.data.message) {
      notyf.error(err.response.data.message);
      error.value = err.response.data.message;

    } else {
      notyf.error("Login Failed. Please contact administrator.");
      error.value = "Login Failed. Please contact administrator.";

    }

  }

};

</script>
