<template>
  <div class="add-product-page">
    <div class="form-container">
      <h1 class="page-title">
        {{ editMode ? "Edit Product" : "Add New Product" }}
      </h1>

      <form @submit.prevent="submitProduct">

        <div class="form-group">
          <label>Product Name</label>
          <input
            type="text"
            v-model="form.name"
            required
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Price</label>
          <input
            type="number"
            v-model.number="form.price"
            required
          />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select v-model="form.category" required>
            <option disabled value="">Select category</option>
            <option>In-Person</option>
            <option>Virtual</option>
            <option>Activity</option>
            <option>Meal</option>
            <option>Other</option>
          </select>
        </div>

        <button
          type="submit"
          class="btn-theme"
          :disabled="loading"
        >
          {{ loading
              ? (editMode ? "Updating..." : "Creating...")
              : (editMode ? "Update Product" : "Create Product")
          }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";

const route = useRoute();
const router = useRouter();

const editMode = computed(() => !!route.params.id);

const form = ref({
  name: "",
  description: "",
  price: 0,
  category: ""
});

const loading = ref(false);

const fetchProduct = async () => {
  try {
    const { data } = await api.get(`/products/${route.params.id}`);

    form.value = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category
    };

  } catch (err) {
    console.error("❌ Product not found:", err);
    router.push("/admin");
  }
};

const submitProduct = async () => {
  try {
    loading.value = true;

    if (editMode.value) {
      await api.patch(`/products/${route.params.id}/update`, form.value);
    } else {
      await api.post("/products", form.value);
    }

    router.push("/admin");

  } catch (err) {
    console.error("❌ Submit error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (editMode.value) {
    fetchProduct();
  }
});
</script>

<style scoped>

/* Page */
.add-product-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* Card */
.form-container {
  width: 100%;
  max-width: 520px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}

/* Title */
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Form */
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-primary);
  outline: none;
  transition: 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--accent);
}

/* THEME BUTTON */
.btn-theme {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
  background: var(--accent);
  color: white;
}

.btn-theme:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-theme:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>
