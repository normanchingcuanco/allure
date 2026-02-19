<template>
  <div class="confirmation-page">
    <div class="confirmation-container">

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning"></div>
      </div>

      <div v-else-if="order">

        <!-- Success Banner -->
        <div class="success-banner">
          <div class="success-icon">✓</div>
          <div>
            <h1 class="success-title">Booking Confirmed!</h1>
            <p class="success-sub">Thank you for your order. Here's your booking summary.</p>
          </div>
        </div>

        <!-- Order Meta -->
        <div class="meta-strip">
          <div class="meta-item">
            <span class="meta-label">Order ID</span>
            <span class="meta-value mono">{{ order._id }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">{{ formatDate(order.orderedOn) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Payment</span>
            <span class="meta-value payment-chip" :class="order.paymentMethod">
              {{ paymentLabel(order.paymentMethod) }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Status</span>
            <span class="meta-value status-chip">{{ order.status || 'Confirmed' }}</span>
          </div>
        </div>

        <div class="confirmation-grid">

          <!-- ── Left: Items ── -->
          <div class="confirmation-left">

            <!-- Items grouped by provider -->
            <div class="section-card">
              <h3 class="section-title">Items Ordered</h3>

              <div v-for="group in groupedItems" :key="group.provider?._id" class="provider-group">

                <!-- Provider -->
                <div class="provider-row">
                  <img
                    :src="group.provider?.profileImage || 'https://placehold.co/36x36?text=?'"
                    class="provider-img"
                    alt="Provider"
                  />
                  <div>
                    <p class="provider-name">{{ group.provider?.firstName }} {{ group.provider?.lastName }}</p>
                    <p class="provider-sub">{{ group.provider?.age }} yrs · {{ group.provider?.gender }}</p>
                  </div>
                </div>

                <!-- Items -->
                <div v-for="item in group.items" :key="item._id" class="order-item">
                  <div class="order-item-icon" v-if="item.productId?.icon">
                    {{ item.productId.icon }}
                  </div>
                  <div class="order-item-info">
                    <p class="order-item-name">{{ item.productId?.serviceTypeId?.name }}</p>
                    <div class="order-item-meta">
                      <span v-if="item.productId?.duration">
                        <i class="bi bi-clock me-1"></i>{{ item.productId.duration }} min
                      </span>
                      <span v-if="item.productId?.availabilityNotes">
                        <i class="bi bi-calendar3 me-1"></i>{{ item.productId.availabilityNotes }}
                      </span>
                    </div>
                    <p v-if="item.productId?.customDescription" class="order-item-desc">
                      "{{ item.productId.customDescription }}"
                    </p>
                  </div>
                  <div class="order-item-right">
                    <p class="order-item-qty">x{{ item.quantity }}</p>
                    <p class="order-item-price">${{ item.subtotal.toFixed(2) }}</p>
                  </div>
                </div>

              </div>
            </div>

            <!-- Next Steps -->
            <div class="section-card next-steps">
              <h3 class="section-title">What to Expect</h3>
              <div class="steps-list">
                <div class="step">
                  <div class="step-num">1</div>
                  <div>
                    <p class="step-title">Booking Received</p>
                    <p class="step-desc">Your order has been placed and is now visible to your provider.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-num">2</div>
                  <div>
                    <p class="step-title">Provider Confirmation</p>
                    <p class="step-desc">Your provider will reach out to confirm the schedule and details.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-num">3</div>
                  <div>
                    <p class="step-title">Enjoy the Service</p>
                    <p class="step-desc">Meet your provider and enjoy the experience!</p>
                  </div>
                </div>
                <div class="step" v-if="order.paymentMethod === 'mock'">
                  <div class="step-num">4</div>
                  <div>
                    <p class="step-title">Payment</p>
                    <p class="step-desc">Payment is due when the service is rendered.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ── Right: Summary ── -->
          <div class="confirmation-right">
            <div class="section-card">
              <h3 class="section-title">Payment Summary</h3>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ order.totalPrice?.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Service Fee <span class="fee-badge">10%</span></span>
                <span>${{ serviceFee.toFixed(2) }}</span>
              </div>

              <hr class="summary-divider" />

              <div class="summary-row total">
                <span>Total Paid</span>
                <span>${{ grandTotal.toFixed(2) }}</span>
              </div>

              <div class="payment-method-box">
                <span class="payment-method-label">Paid via</span>
                <span class="payment-method-value">{{ paymentLabel(order.paymentMethod) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="action-buttons">
              <router-link to="/products" class="btn-primary">
                <i class="bi bi-grid me-2"></i>Browse More
              </router-link>
              <router-link to="/profile" class="btn-secondary">
                <i class="bi bi-person me-2"></i>My Profile
              </router-link>
            </div>
          </div>

        </div>
      </div>

      <!-- No order found -->
      <div v-else class="empty-state">
        <i class="bi bi-receipt fs-1 text-muted"></i>
        <h4>No order found</h4>
        <p>We couldn't find your order details.</p>
        <router-link to="/products" class="btn-primary mt-3">Browse Services</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api'

const router = useRouter()
const route = useRoute()

const order = ref(null)
const loading = ref(true)

// Compute
const SERVICE_FEE_RATE = 0.10
const serviceFee = computed(() => (order.value?.totalPrice || 0) * SERVICE_FEE_RATE)
const grandTotal = computed(() => (order.value?.totalPrice || 0) + serviceFee.value)

const groupedItems = computed(() => {
  const groups = {}
  const items = order.value?.productsOrdered || []
  items.forEach(item => {
    const providerId = item.productId?.providerId?._id
    if (!groups[providerId]) {
      groups[providerId] = {
        provider: item.productId?.providerId,
        items: []
      }
    }
    groups[providerId].items.push(item)
  })
  return Object.values(groups)
})

// Helpers 
const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const paymentLabel = (method) => {
  const map = { mock: 'Pay Later', gcash: 'GCash', paymaya: 'Maya' }
  return map[method] || method || '—'
}

// Fetch Order 
const fetchOrder = async () => {
  loading.value = true
  try {
    const orderId = route.params.id
    const { data } = await api.get(`/orders/${orderId}`)
    order.value = data
  } catch (err) {
    console.error('Failed to load order:', err)
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  background: var(--bg);
  padding: 40px 20px 80px;
}

.confirmation-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ── Success Banner ── */
.success-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.12);
  color: var(--success);
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--success);
  flex-shrink: 0;
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.success-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Meta Strip ── */
.meta-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.meta-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 140px;
}

.meta-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.meta-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.meta-value.mono {
  font-family: monospace;
  font-size: 11px;
  word-break: break-all;
}

.payment-chip {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: var(--hover-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.payment-chip.gcash { background: rgba(0, 104, 255, 0.08); color: #0068ff; border-color: rgba(0, 104, 255, 0.2); }
.payment-chip.paymaya { background: rgba(0, 180, 80, 0.08); color: #00b450; border-color: rgba(0, 180, 80, 0.2); }

.status-chip {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* ── Grid ── */
.confirmation-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .confirmation-grid { grid-template-columns: 1fr; }
  .meta-strip { flex-direction: column; }
}

/* ── Section Cards ── */
.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* ── Provider Group ── */
.provider-group {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.provider-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.provider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.provider-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
  flex-shrink: 0;
}

.provider-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.provider-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Order Items ── */
.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid var(--border);
}

.order-item-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.order-item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.order-item-desc {
  font-size: 12px;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

.order-item-right {
  text-align: right;
  flex-shrink: 0;
}

.order-item-qty {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.order-item-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

/* ── Next Steps ── */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 2px;
}

.step-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ── Summary ── */
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0;
}

.summary-divider {
  border-color: var(--border);
  margin: 14px 0;
}

.fee-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 4px;
  color: var(--text-muted);
  vertical-align: middle;
}

.payment-method-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  margin-top: 16px;
}

.payment-method-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.payment-method-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

/* ── Actions ── */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s;
}

.btn-primary:hover { background: var(--accent-hover); }

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s;
}

.btn-secondary:hover { background: var(--hover-bg); }

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-state h4 {
  color: var(--text-primary);
  margin: 16px 0 8px;
}
</style>