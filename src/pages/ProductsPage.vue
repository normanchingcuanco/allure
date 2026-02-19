<template>
  <AdminDashboardPage v-if="isAdmin" />

  <div v-else class="container py-5">
    <h1 class="mb-2 text-center">Browse Services</h1>
    <p class="text-center text-muted mb-5">Explore what people are offering</p>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-warning"></div>
    </div>

    <!-- Services Grid -->
    <div v-else class="row">
      <div
        v-for="service in services"
        :key="service._id"
        class="col-md-4 mb-4"
      >
        <div class="card service-card h-100 p-3">

          <!-- Provider Info -->
          <div class="d-flex align-items-center gap-3 mb-3">
            <img
              :src="service.providerId?.profileImage || 'https://placehold.co/48x48?text=?'"
              class="provider-img"
              alt="Provider"
            />
            <div>
              <p class="provider-name mb-0">
                {{ service.providerId?.firstName }} {{ service.providerId?.lastName }}
              </p>
              <p class="provider-sub mb-0">
                {{ service.providerId?.age }} yrs · {{ service.providerId?.gender }}
              </p>
            </div>
          </div>

          <!-- Service Type -->
          <span class="service-category mb-2">
            {{ service.serviceTypeId?.category }}
          </span>
          <h5 class="service-name mb-1">{{ service.serviceTypeId?.name }}</h5>

          <!-- Custom Description -->
          <p v-if="service.customDescription" class="service-desc mb-2">
            "{{ service.customDescription }}"
          </p>

          <!-- Price & Duration -->
          <div class="d-flex align-items-center gap-3 mt-auto pt-3">
            <span class="service-price">${{ service.price }}</span>
            <span v-if="service.duration" class="service-duration">
              <i class="bi bi-clock me-1"></i>{{ service.duration }} min
            </span>
          </div>

          <!-- Availability -->
          <p v-if="service.availabilityNotes" class="service-availability mt-2 mb-3">
            <i class="bi bi-calendar3 me-1"></i>{{ service.availabilityNotes }}
          </p>

          <!-- Action -->
          <router-link
            :to="`/products/${service._id}`"
            class="btn btn-outline-warning mt-2"
          >
            View Details
          </router-link>

        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!loading && services.length === 0" class="text-center py-5">
      <i class="bi bi-briefcase fs-1 text-muted"></i>
      <p class="mt-3 text-muted">No services available yet.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import api from "../api";
import AdminDashboardPage from "./AdminDashboardPage.vue";


const router      = useRouter();
const globalStore = useGlobalStore();

const allServices = ref([]);  
const loading     = ref(true);
const isAdmin = computed(() => globalStore.isAdmin);


const services = computed(() => {
  const myId = globalStore.user._id;
  return allServices.value.filter(s => s.providerId?._id !== myId);
});

const fetchServices = async () => {
  try {
    const { data } = await api.get("/services");
    allServices.value = data; 
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  if (!isAdmin.value) {
    fetchServices();
  } else {
    loading.value = false; 
  }
});
</script>

<style scoped>
.service-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 15px;
  transition: 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
}

.provider-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
  flex-shrink: 0;
}

.provider-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.provider-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.service-category {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
}

.service-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.service-desc {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
}

.service-price {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.service-duration {
  font-size: 13px;
  color: var(--text-secondary);
}

.service-availability {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>