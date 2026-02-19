<template>
  <button
    class="btn-action"
    :class="product.isActive ? 'deactivate' : 'activate'"
    :disabled="loading"
    @click="toggleStatus"
  >
    <i
      :class="product.isActive ? 'bi bi-slash-circle' : 'bi bi-check-circle'"
    ></i>

    {{ loading ? "Updating..." : (product.isActive ? "Disable" : "Enable") }}
  </button>
</template>

<script setup>
import { ref } from "vue";
import api from "../api";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["status-updated"]);

const loading = ref(false);

const toggleStatus = async () => {
  try {
    loading.value = true;

    const id = props.product._id;

    if (props.product.isActive) {
      // 🔴 Disable product (formerly archive)
      await api.patch(`/products/${id}/archive`);
    } else {
      // 🟢 Enable product (formerly activate)
      await api.patch(`/products/${id}/activate`);
    }

    emit("status-updated");

  } catch (error) {
    console.error("❌ Product status toggle error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Enable button hover */
.btn-action.activate:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.08);
  border-color: #10b981;
  color: #10b981;
}

/* Disable button hover */
.btn-action.deactivate:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
  color: #ef4444;
}
</style>
