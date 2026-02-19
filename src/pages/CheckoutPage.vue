<template>
  <div class="checkout-page">
    <div class="checkout-container">

      <!-- Header -->
      <div class="checkout-header">
        <button class="btn-back" @click="router.push('/cart')">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h1 class="checkout-title">Checkout</h1>
          <p class="checkout-sub">Complete your booking</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="orderPlaced" class="success-state">
        <div class="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Your booking has been confirmed. We'll be in touch shortly.</p>
        <button class="btn-primary mt-4" @click="router.push('/products')">
          Browse More Services
        </button>
      </div>

      <div v-else class="checkout-grid">

        <!-- ── Left: Form ── -->
        <div class="checkout-form-col">

          <!-- Contact Info -->
          <div class="form-section">
            <h3 class="form-section-title">
              <span class="section-num">01</span> Contact Info
            </h3>

            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.fullName" type="text" placeholder="Juan dela Cruz" />
              <span v-if="errors.fullName" class="field-error">{{ errors.fullName }}</span>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="juan@email.com" />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-section">
            <h3 class="form-section-title">
              <span class="section-num">02</span> Payment Method
            </h3>

            <div class="payment-options">

              <!-- Mock / Cash -->
              <label class="payment-option" :class="{ selected: form.paymentMethod === 'mock' }">
                <input type="radio" v-model="form.paymentMethod" value="mock" hidden />
                <div class="payment-option-inner">
                  <span class="payment-icon">💵</span>
                  <div>
                    <p class="payment-name">Pay Later</p>
                    <p class="payment-desc">Confirm now, pay when service is rendered</p>
                  </div>
                  <div class="payment-check" :class="{ active: form.paymentMethod === 'mock' }">
                    <i class="bi bi-check"></i>
                  </div>
                </div>
              </label>

              <!-- GCash -->
              <label class="payment-option" :class="{ selected: form.paymentMethod === 'gcash' }">
                <input type="radio" v-model="form.paymentMethod" value="gcash" hidden />
                <div class="payment-option-inner">
                  <img src="../assets/gcash.png" class="payment-logo" alt="GCash" />
                  <div>
                    <p class="payment-name">GCash</p>
                    <p class="payment-desc">Pay via GCash e-wallet</p>
                  </div>
                  <div class="payment-check" :class="{ active: form.paymentMethod === 'gcash' }">
                    <i class="bi bi-check"></i>
                  </div>
                </div>
              </label>

              <!-- PayMaya -->
              <label class="payment-option" :class="{ selected: form.paymentMethod === 'paymaya' }">
                <input type="radio" v-model="form.paymentMethod" value="paymaya" hidden />
                <div class="payment-option-inner">
                  <img src="../assets/maya.png" class="payment-logo" alt="Maya" />
                  <div>
                    <p class="payment-name">Maya</p>
                    <p class="payment-desc">Pay via Maya (formerly PayMaya)</p>
                  </div>
                  <div class="payment-check" :class="{ active: form.paymentMethod === 'paymaya' }">
                    <i class="bi bi-check"></i>
                  </div>
                </div>
              </label>

            </div>
            <span v-if="errors.paymentMethod" class="field-error">{{ errors.paymentMethod }}</span>

            <!-- GCash mock input -->
            <div v-if="form.paymentMethod === 'gcash'" class="ewallet-form">
              <div class="ewallet-notice">
                <i class="bi bi-info-circle me-2"></i>
                GCash integration via PayMongo coming soon. For now this is a simulation.
              </div>
              <div class="form-group">
                <label>GCash Number</label>
                <input v-model="form.ewalletNumber" type="tel" placeholder="09XXXXXXXXX" maxlength="11" />
                <span v-if="errors.ewalletNumber" class="field-error">{{ errors.ewalletNumber }}</span>   
              </div>
            </div>

            <!-- Maya mock input -->
            <div v-if="form.paymentMethod === 'paymaya'" class="ewallet-form">
              <div class="ewallet-notice">
                <i class="bi bi-info-circle me-2"></i>
                Maya integration via PayMongo coming soon. For now this is a simulation.
              </div>
              <div class="form-group">
                <label>Maya Number</label>
                <input v-model="form.ewalletNumber" type="tel" placeholder="09XXXXXXXXX" maxlength="11" />
                <span v-if="errors.ewalletNumber" class="field-error">{{ errors.ewalletNumber }}</span>  
              </div>
            </div>

          </div>

        </div>

        <!-- ── Right: Order Summary ── -->
        <div class="checkout-summary-col">
          <div class="summary-card">
            <h3 class="summary-title">Order Summary</h3>

            <div v-if="loadingCart" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-warning"></div>
            </div>

            <div v-else class="summary-items">
              <div v-for="group in groupedItems" :key="group.provider?._id" class="summary-group">
                <p class="summary-provider">
                  <img
                    :src="group.provider?.profileImage || 'https://placehold.co/20x20?text=?'"
                    class="summary-provider-img"
                  />
                  {{ group.provider?.firstName }} {{ group.provider?.lastName }}
                </p>
                <div v-for="item in group.items" :key="item._id" class="summary-item">
                  <span class="summary-item-icon" v-if="item.productId?.icon">{{ item.productId.icon }}</span>
                  <div class="summary-item-info">
                    <p class="summary-item-name">{{ item.productId?.serviceTypeId?.name }}</p>
                    <p class="summary-item-qty">x{{ item.quantity }}</p>
                  </div>
                  <p class="summary-item-price">${{ item.subtotal.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <hr class="summary-divider" />

            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Service Fee <span class="fee-badge">10%</span></span>
              <span>${{ serviceFee.toFixed(2) }}</span>
            </div>

            <hr class="summary-divider" />

            <div class="summary-row total">
              <span>Total</span>
              <span>${{ grandTotal.toFixed(2) }}</span>
            </div>

            <button
              class="btn-checkout"
              :disabled="submitting || loadingCart"
              @click="placeOrder"
            >
              <span v-if="submitting" class="btn-spinner me-2"></span>
              <i v-else class="bi bi-bag-check me-2"></i>
              {{ submitting ? 'Processing...' : `Place Order · $${grandTotal.toFixed(2)}` }}
            </button>

            
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'
import { useGlobalStore } from '../stores/global'

const router = useRouter()
const notyf = new Notyf()
const globalStore = useGlobalStore()

const cart = ref(null)
const loadingCart = ref(true)
const submitting = ref(false)
const orderPlaced = ref(false)

const form = ref({
  fullName: '',
  email: '',
  paymentMethod: '',
  ewalletNumber: ''
})

const errors = ref({})

// Computed
const cartItems = computed(() => cart.value?.cartItems || [])
const totalPrice = computed(() => cart.value?.totalPrice || 0)
const SERVICE_FEE_RATE = 0.10
const serviceFee = computed(() => totalPrice.value * SERVICE_FEE_RATE)
const grandTotal = computed(() => totalPrice.value + serviceFee.value)

const groupedItems = computed(() => {
  const groups = {}
  cartItems.value.forEach(item => {
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

// Fetch Cart
const fetchCart = async () => {
  loadingCart.value = true
  try {
    const { data } = await api.get('/cart/get-cart')
    cart.value = data.cartItems ? data : null
    form.value.fullName = `${globalStore.user.firstName || ''} ${globalStore.user.lastName || ''}`.trim()
    form.value.email = globalStore.user.email || ''
  } catch (err) {
    console.error(err)
    notyf.error('Failed to load cart')
  } finally {
    loadingCart.value = false
  }
}

// Validate 
const validate = () => {
  errors.value = {}
  if (!form.value.fullName.trim()) errors.value.fullName = 'Full name is required'
  if (!form.value.email.trim()) errors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Enter a valid email'
  if (!form.value.paymentMethod) errors.value.paymentMethod = 'Please select a payment method'

  if (['gcash', 'paymaya'].includes(form.value.paymentMethod) && !form.value.ewalletNumber.trim()) {
    errors.value.ewalletNumber = 'Please enter your e-wallet number'
  }

  return Object.keys(errors.value).length === 0
}

// Place Order 
const placeOrder = async () => {
  if (!validate()) return
  submitting.value = true
  try {
    const { data } = await api.post('/orders/checkout', {
      fullName: form.value.fullName,
      email: form.value.email,
      paymentMethod: form.value.paymentMethod,
      status: ['gcash', 'paymaya'].includes(form.value.paymentMethod) ? 'Confirmed' : 'Pending' 
    })
    globalStore.fetchCartCount()
    router.push(`/orders/${data.order._id}`)
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Checkout failed')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: var(--bg);
  padding: 40px 20px 80px;
}

.checkout-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ── Header ── */
.checkout-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-back {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-back:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.checkout-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.checkout-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ── Grid ── */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Form Sections ── */
.form-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}

.form-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-num {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent);
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  padding: 2px 7px;
  letter-spacing: 1px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input {
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.field-error {
  font-size: 12px;
  color: #ef4444;
}

/* ── Payment Options ── */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.payment-option {
  cursor: pointer;
}

.payment-option-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  transition: all 0.15s;
}

.payment-option.selected .payment-option-inner {
  border-color: var(--accent);
  background: rgba(212, 175, 55, 0.06);
}

.payment-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.payment-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.payment-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.payment-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border);
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: transparent;
  transition: all 0.15s;
  flex-shrink: 0;
}

.payment-check.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.payment-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
  flex-shrink: 0;
}

/* ── E-wallet form ── */
.ewallet-form {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.ewallet-notice {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
}

/* ── Summary Card ── */
.summary-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  position: sticky;
  top: 90px;
}

.summary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.summary-group {
  margin-bottom: 16px;
}

.summary-provider {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-provider-img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--accent);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.summary-item-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.summary-item-info {
  flex: 1;
  min-width: 0;
}

.summary-item-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-item-qty {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.summary-item-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.summary-divider {
  border-color: var(--border);
  margin: 14px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0;
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

/* ── Checkout Button ── */
.btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  padding: 13px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-checkout:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.3);
}


.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}



/* ── Success State ── */
.success-state {
  text-align: center;
  padding: 80px 20px;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.12);
  color: var(--success);
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 2px solid var(--success);
}

.success-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.success-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* ── Primary Button ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

/* ── Spinner ── */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>