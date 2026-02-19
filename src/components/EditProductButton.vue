<template>
  <button class="btn-action update" @click="goToEdit">
    <i class="bi bi-pencil-square"></i>
    Update
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const goToEdit = () => {
  router.push(`/products/edit/${props.product._id}`);
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

.btn-action.update:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
