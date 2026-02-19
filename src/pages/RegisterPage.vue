<template>
  <div class="container py-5" style="max-width: 600px;">
    <h1 class="mb-4 text-center">Create Your Profile</h1>

    <form @submit.prevent="handleRegister">

      <!-- First Name -->
      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input type="text" class="form-control" v-model="form.firstName" required />
      </div>

      <!-- Last Name -->
      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input type="text" class="form-control" v-model="form.lastName" required />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="form.email" required />
      </div>

      <!-- Mobile -->
      <div class="mb-3">
        <label class="form-label">Mobile Number</label>
        <input type="text" class="form-control" v-model="form.mobileNo" required />
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="form.password" required />
      </div>

      <!-- Gender -->
      <div class="mb-3">
        <label class="form-label">Gender</label>
        <select class="form-select" v-model="form.gender" required>
          <option disabled value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <!-- Age -->
      <div class="mb-3">
        <label class="form-label">Age</label>
        <input type="number" class="form-control" v-model="form.age" required />
      </div>

      <!-- Status -->
      <div class="mb-3">
        <label class="form-label">Relationship Status</label>
        <select class="form-select" v-model="form.status" required>
          <option disabled value="">Select Status</option>
          <option>Single</option>
          <option>Divorced</option>
          <option>Widowed</option>
        </select>
      </div>

      <!-- Hobbies -->
      <div class="mb-3">
        <label class="form-label">Hobbies</label>
        <input type="text" class="form-control" v-model="form.hobbies" required />
      </div>

      <!-- Looking For -->
      <div class="mb-3">
        <label class="form-label">What Are You Looking For?</label>
        <textarea class="form-control" v-model="form.lookingFor" rows="3" required></textarea>
      </div>

      <!-- Profile Image URL -->
      <div class="mb-3">
        <label class="form-label">Profile Image URL</label>
        <input type="text" class="form-control" v-model="form.profileImage" required />
      </div>

      <!-- Error -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Success -->
      <div v-if="success" class="alert alert-success">
        Registration successful! Redirecting to login...
      </div>

      <button type="submit" class="btn btn-warning w-100" :disabled="loading">
        {{ loading ? "Registering..." : "Register" }}
      </button>

    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  mobileNo: "",
  password: "",
  gender: "",
  age: "",
  status: "",
  hobbies: "",
  lookingFor: "",
  profileImage: ""
});

const error = ref("");
const success = ref(false);
const loading = ref(false);

const handleRegister = async () => {
  error.value = "";
  success.value = false;
  loading.value = true;

  try {
    await api.post("/users/register", form);

    success.value = true;

    Object.keys(form).forEach(key => form[key] = "");

    setTimeout(() => {
      router.push({ name: "Login" }); // safer than hardcoding path
    }, 1200);

  } catch (err) {
    error.value = err.response?.data?.error || "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
h1 {
  color: var(--accent);
}
</style>
