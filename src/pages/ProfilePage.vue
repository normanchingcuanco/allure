<template>
  <div class="profile-page">

    <!-- PROFILE HEADER -->
    <section class="profile-header">
      <div class="profile-header-inner">

        <div class="avatar-wrap">
          <img
            :src="user.profileImage || 'https://placehold.co/120x120?text=?'"
            class="avatar"
          />
        </div>

        <div class="profile-meta">
          <h1 class="profile-name">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="profile-email">{{ user.email }}</p>

          <div class="profile-tags">
            <span class="tag">{{ user.gender }}</span>
            <span class="tag">{{ user.age }}</span>
            <span class="tag">{{ user.status }}</span>
            <span class="tag">{{ user.lookingFor }}</span>
          </div>
        </div>

      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section class="services-section">

      <div class="section-header">
        <h2>My Services</h2>

        <button
          class="btn-add"
          @click="$router.push('/profile/add-service')"
        >
          + Add Service
        </button>
      </div>

      <div
        v-for="service in services"
        :key="service._id"
        class="service-card"
      >
        <div class="service-icon-wrap" v-if="service.icon">
          <span class="service-icon">{{ service.icon }}</span>
        </div>

        <div class="service-body">
          <div class="service-content-wrapper">
            <div class="service-text">
              <div class="service-title-row">
                <p class="service-price">${{ service.price }}</p>
                <h3 class="service-name">{{ service.serviceTypeId?.name }}</h3>
              </div>

              <div class="service-details">
                <span class="detail-item"><strong>Duration:</strong> {{ service.duration }} min</span>
                <span class="detail-item"><strong>Availability:</strong> {{ service.availability }}</span>
                <p class="service-description">{{ service.customDescription }}</p>
              </div>
            </div>
            
            <div class="service-actions">
              <button class="btn-action edit" @click="$router.push(`/profile/add-service?edit=${service._id}`)">Edit</button>
              <button class="btn-action delete" @click="openDeleteModal(service)">Remove</button>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- DELETE MODAL -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="modal-overlay"
        @click.self="closeDeleteModal"
      >
        <div class="modal-container" @click.stop>

          <h3>Remove Service?</h3>

          <p class="delete-msg">
            Remove
            <strong>
              {{ deletingService?.serviceTypeId?.name }}
            </strong>?
          </p>

          <div class="modal-actions">
            <button class="btn-secondary" @click="closeDeleteModal">
              Cancel
            </button>

            <button
              class="btn-danger"
              :disabled="submitting"
              @click="deleteService"
            >
              Confirm Remove
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useGlobalStore } from "../stores/global"
import api from "../api"
import { Notyf } from "notyf"

const globalStore = useGlobalStore()
const { user } = globalStore

const notyf = new Notyf()

const services = ref([])
const showDeleteConfirm = ref(false)
const deletingService = ref(null)
const submitting = ref(false)

const fetchMyServices = async () => {
  const { data } = await api.get("/services/me/services")
  console.log(data)
  services.value = data || []
}

const openDeleteModal = (service) => {
  deletingService.value = service
  showDeleteConfirm.value = true
}

const closeDeleteModal = () => {
  showDeleteConfirm.value = false
  deletingService.value = null
}

const deleteService = async () => {
  try {
    submitting.value = true

    const id = deletingService.value._id

    await api.delete(`/services/me/${id}`)

    services.value = services.value.filter(
      s => s._id !== id
    )

    notyf.success("Service removed")
    closeDeleteModal()

  } catch (err) {
    notyf.error("Delete failed")
  } finally {
    submitting.value = false
  }
}

onMounted(fetchMyServices)
</script>

<style scoped>

/* PAGE */
.profile-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 60px;
}

/* HEADER */
.profile-header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  padding: 40px 20px;
}

.profile-header-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border);
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.profile-email {
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.profile-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: var(--hover-bg);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid var(--border);
}

/* SERVICES */
.services-section {
  max-width: 860px;
  margin: 40px auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-add {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
}

/* SERVICE CARD */
.service-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.service-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; 
}

.service-title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.service-name {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
}

.service-body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  justify-content: center;
}

.service-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.service-icon {
  font-size: 48px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hover-bg);
  border-right: 1px solid var(--border);
  padding: 0 20px;
}

.service-details {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.detail-item {
  font-size: 13px;
  color: var(--text-secondary);
}

.service-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.3;
}

.service-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.btn-action.edit {
  background: var(--hover-bg);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-action.edit:hover {
  background: var(--border);
}

.btn-action.edit,
.btn-action.delete {
  width: 90px; 
  padding: 6px 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-price {
  font-weight: 700;
  font-size: 16px;
  color: var(--accent);
}

.service-content-wrapper {
  display: flex;
  width: 100%;
  align-items: center; 
  justify-content: space-between;
  gap: 20px;
}

/* DELETE BUTTON */
.btn-action.delete {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-action.delete:hover {
  background: rgba(239, 68, 68, 0.15);
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
}

.btn-secondary {
  background: var(--hover-bg);
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn-secondary:hover {
  background: var(--card-bg);
}


</style>
