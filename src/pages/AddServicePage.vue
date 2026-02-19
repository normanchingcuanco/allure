<template>
  <div class="add-service-page">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" @click="router.push('/profile')">
          ← Back to Profile
        </button>

        <h1>{{ editMode ? 'Edit Service' : 'Add Service' }}</h1>
        <p class="page-sub">
          {{ editMode ? 'Update your service details' : 'Add a new service to your profile' }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <form @submit.prevent="submitService">

          <!-- Service Type -->
          <div v-if="!editMode" class="form-group">
            <label>Service Type <span class="required">*</span></label>
            <select v-model="form.serviceTypeId" required>
              <option value="" disabled>Select a service type…</option>
              <option
                v-for="type in availableServiceTypes"
                :key="type._id"
                :value="type._id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div v-else class="form-group">
            <label>Service Type</label>
            <input :value="existingService?.serviceTypeId?.name" disabled class="input-disabled" />
          </div>

          <!-- Price -->
          <div class="form-group">
            <label>Price ($) <span class="required">*</span></label>
            <input
              v-model.number="form.price"
              type="number"
              min="1"
              step="0.01"
              required
            />
          </div>

          <!-- Duration -->
          <div v-if="!isRevealService" class="form-group">
            <label>Duration <span class="form-hint">(optional)</span></label>
            <input v-model.number="form.duration" type="number" min="1" />
          </div>

          <!-- Description -->
          <div v-if="!isRevealService" class="form-group">
            <label>Your Description <span class="form-hint">(optional)</span></label>
            <textarea v-model="form.customDescription" rows="4"></textarea>
          </div>

          <!-- Availability -->
          <div v-if="!isRevealService" class="form-group">
            <label>Availability <span class="form-hint">(optional)</span></label>
            <input v-model="form.availabilityNotes" type="text" />
          </div>

          <!-- Icon -->
          <div class="form-group">
            <label>Icon <span class="form-hint">(optional emoji or image URL)</span></label>
            <input v-model="form.icon" type="text" />
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="router.push('/profile')">
              Cancel
            </button>

            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? "Saving..." : (editMode ? "Save Changes" : "Add Service") }}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";

const router = useRouter();
const route = useRoute();
const notyf = new Notyf();

const submitting = ref(false);

const editMode = computed(() => !!route.query.edit);
const existingService = ref(null);

const allServiceTypes = ref([]);

const form = ref({
  serviceTypeId: "",
  price: null,
  duration: null,
  customDescription: "",
  availabilityNotes: "",
  icon: ""
});

/* ================= COMPUTED ================= */

const availableServiceTypes = computed(() => {
  return allServiceTypes.value || [];
});

const isRevealService = computed(() => {
  if (!form.value.serviceTypeId) return false;
  const selected = allServiceTypes.value.find(t => t._id === form.value.serviceTypeId);
  return selected?.name?.toLowerCase().includes("reveal");
});

watch(isRevealService, (val) => {
  if (val) {
    form.value.duration = null;
    form.value.customDescription = "";
    form.value.availabilityNotes = "";
  }
});

/* ================= FETCH ================= */

const fetchServiceTypes = async () => {
  try {
    const { data } = await api.get("/products/active");
    allServiceTypes.value = data || [];
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load service types");
  }
};

// ✅ FIX: fetch your OWN services, then find the one to edit
const fetchExistingService = async () => {
  try {
    const editId = route.query.edit;

    const { data } = await api.get("/services/me/services");
    const mine = data || [];

    const found = mine.find(s => s._id === editId);

    if (!found) {
      notyf.error("Service not found in your profile");
      router.push("/profile");
      return;
    }

    existingService.value = found;

    form.value = {
      serviceTypeId: found.serviceTypeId?._id || "",
      price: Number(found.price) || null,
      duration: found.duration || null,
      customDescription: found.customDescription || "",
      availabilityNotes: found.availabilityNotes || "",
      icon: found.icon || ""
    };
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load service");
    router.push("/profile");
  }
};

/* ================= SUBMIT ================= */

const submitService = async () => {
  try {
    if (!form.value.serviceTypeId && !editMode.value) {
      notyf.error("Please select a service type");
      return;
    }

    if (!form.value.price || form.value.price <= 0) {
      notyf.error("Price must be greater than 0");
      return;
    }

    submitting.value = true;

    if (editMode.value) {
      await api.patch(`/services/me/${route.query.edit}`, form.value);
      notyf.success("Service updated successfully");
    } else {
      await api.post("/services/me", form.value);
      notyf.success("Service added successfully");
    }

    router.push("/profile");
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    notyf.error(err.response?.data?.message || "Request failed");
  } finally {
    submitting.value = false;
  }
};

/* ================= INIT ================= */

onMounted(async () => {
  await fetchServiceTypes();
  if (editMode.value) {
    await fetchExistingService();
  }
});
</script>

<style scoped>
.add-service-page {
  min-height: 100vh;
  background: var(--bg);
  padding: 40px 20px;
}

.page-container {
  max-width: 560px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-sub {
  color: var(--text-secondary);
  font-size: 14px;
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-bottom: 16px;
  cursor: pointer;
}

.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-primary);
  font-size: 14px;
}


.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
  padding-top: 24px;
}


.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px 24px;
  font-weight: 700;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 11px 24px;
  font-weight: 700;
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.required {
  color: #ef4444;
}

.form-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.input-disabled {
  opacity: 0.6;
}
</style>
