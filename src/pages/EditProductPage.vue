<template>
  <div class="page-container">
    <h1>Edit Product</h1>

    <div v-if="loading">Loading product...</div>

    <form v-else @submit.prevent="handleUpdate">

      <!-- Product Name -->
      <div class="form-group">
        <label>Product Name</label>
        <input v-model="name" type="text" required />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" required></textarea>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label>Category</label>
        <input v-model="category" type="text" />
      </div>

      <!-- Icon -->
      <div class="form-group">
        <label>Icon</label>
        <input v-model="icon" type="text" />
      </div>

      <!-- Price -->
      <div class="form-group">
        <label>Price</label>
        <input v-model="price" type="number" />
      </div>

      <!-- Duration -->
      <div class="form-group">
        <label>Duration</label>
        <input v-model="duration" type="text" />
      </div>

      <button type="submit" class="btn-primary">
        Update Product
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Notyf } from "notyf"
import api from "../api"

const route = useRoute()
const router = useRouter()
const notyf = new Notyf()

const loading = ref(true)

const name = ref("")
const description = ref("")
const category = ref("")
const icon = ref("")
const price = ref("")
const duration = ref("")

// ===============================
// Fetch product on mount
// ===============================
onMounted(async () => {
  try {
    const res = await api.get(`/products/${route.params.id}`)
    const product = res.data

    if (!product) {
      notyf.error("Product not found")
      return router.push("/admin")
    }

    name.value = product.name
    description.value = product.description
    category.value = product.category
    icon.value = product.icon
    price.value = product.price
    duration.value = product.duration

  } catch (err) {
    console.error(err)
    notyf.error("Failed to load product")
    router.push("/admin")
  } finally {
    loading.value = false
  }
})

// ===============================
// Update Product
// ===============================
const handleUpdate = async () => {
  try {
    await api.patch(`/products/${route.params.id}/update`, {
      name: name.value,
      description: description.value,
      category: category.value,
      icon: icon.value,
      price: price.value,
      duration: duration.value
    })

    notyf.success("Product updated successfully")

    // Small delay so user sees success message
    setTimeout(() => {
      router.push("/admin")
    }, 800)

  } catch (err) {
    console.error(err)
    notyf.error("Update failed")
  }
}
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: auto;
  padding: 40px 20px;
}

.form-group {
  margin-bottom: 20px;
}

input, textarea {
  width: 100%;
  padding: 8px;
}

.btn-primary {
  background: var(--accent);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
}
</style>
