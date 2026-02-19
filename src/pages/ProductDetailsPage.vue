<template>
  <div class="service-page">
    <div class="container py-5">

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!service" class="empty-state">
        <i class="bi bi-exclamation-circle fs-1"></i>
        <h4 class="mt-3">Service not found.</h4>
        <button class="btn-back mt-3" @click="goBack">
          Back to Services
        </button>
      </div>

      <!-- Content -->
      <div v-else>

        <!-- Back Button -->
        <button class="btn-back mb-4" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>
          Back to Services
        </button>

        <div class="row g-4">

          <!-- LEFT COLUMN -->
          <div class="col-lg-8">
            <div class="detail-card">

              <span class="service-category">
                {{ service.serviceTypeId?.category }}
              </span>

              <h1 class="service-title mt-1">
                {{ service.serviceTypeId?.name }}
              </h1>

              <p class="service-type-desc">
                {{ service.serviceTypeId?.description }}
              </p>

              <hr class="divider" />

              <div v-if="service.customDescription" class="mb-4">
                <h6 class="section-label">About this offering</h6>
                <p class="service-desc">
                  "{{ service.customDescription }}"
                </p>
              </div>

              <div class="details-row">
                <div class="detail-item">
                  <i class="bi bi-tag"></i>
                  <div>
                    <p class="detail-label">Price</p>
                    <p class="detail-value">${{ service.price }}</p>
                  </div>
                </div>

                <div v-if="service.duration" class="detail-item">
                  <i class="bi bi-clock"></i>
                  <div>
                    <p class="detail-label">Duration</p>
                    <p class="detail-value">
                      {{ service.duration }} minutes
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-lg-4">
            <div class="provider-card">

              <h6 class="section-label mb-3">Offered by</h6>

              <img
                :src="service.providerId?.profileImage || 'https://placehold.co/400x400?text=User'"
                class="provider-avatar"
                alt="Provider"
              />

              <div class="provider-text mt-3">
                <p class="provider-name">
                  {{ service.providerId?.firstName }}
                  {{ service.providerId?.lastName }}
                </p>
                <p class="provider-sub">
                  {{ service.providerId?.age }} yrs ·
                  {{ service.providerId?.gender }}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "../api"

const route = useRoute()
const router = useRouter()

const service = ref(null)
const loading = ref(true)

const goBack = () => {
  router.push("/products")
}

const fetchService = async () => {
  try {
    const { data } = await api.get(`/services/${route.params.id}`)
    service.value = data
  } catch (error) {
    console.error("Error fetching service:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchService)
</script>

<style scoped>

/* Page */
.service-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 60px;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Back */
.btn-back {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
}

.btn-back:hover {
  color: var(--text-primary);
}

/* Cards */
.detail-card,
.provider-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

/* Provider Image Standardization */
.provider-avatar {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--accent);
  display: block;
}

/* Text */
.service-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.service-category {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
}

.detail-value,
.provider-name {
  font-weight: 700;
  color: var(--text-primary);
}

.provider-sub {
  color: var(--text-secondary);
}

</style>
