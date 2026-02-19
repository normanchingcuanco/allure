<template>
    <button :class="buttonClass" class="btn" @click="toggleProducttatus" :disabled="loading">
        {{ loading ? "Processing..." : buttonText }}
    </button>
</template>

<script setup>
import { ref, computed } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import api from "@/api"; // Axios instance

// Props
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

// Emit for parent refresh
const emit = defineEmits(["status-updated"]);

const loading = ref(false);
const notyf = new Notyf();

const buttonText = computed(() => (props.product.isActive ? "Archive" : "Activate"));

const buttonClass = computed(() => (props.product.isActive ? "btn-danger" : "btn-success"));

const toggleProductStatus = async () => {
    loading.value = true;

    const endpoint = props.product.isActive
        ? `/products/${props.product._id}/archive`
        : `/products/${props.product._id}/activate`;

    try {
        const token = localStorage.getItem("token");

        await api.patch(
            endpoint,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        notyf.success(
            props.product.isActive
                ? "Product archived successfully!"
                : "Product activated successfully!"
        );

        emit("status-updated"); 
    } catch (err) {
        console.error(err);
        notyf.error("Action failed. Please try again.");
    } finally {
        loading.value = false;
    }
};
</script>
