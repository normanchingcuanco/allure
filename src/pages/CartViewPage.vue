<template>
  <div class="container py-5">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning"></div>
    </div>

    <div v-else>
      <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 class="page-title mb-1">Your Cart</h1>
          <p class="text-muted mb-0">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }}</p>
        </div>
            <div class="clear-wrap">
                <button
                    v-if="!showClearConfirm"
                    class="btn-clear"
                    :disabled="clearing"
                    @click="showClearConfirm = true"
                >
                    <i class="bi bi-trash me-2"></i>Clear Cart
                </button>

                <!-- Confirmation Prompt -->
                <Transition name="fade">
                    <div v-if="showClearConfirm" class="confirm-inline">
                    <span>Remove all items?</span>
                    <button class="confirm-yes" :disabled="clearing" @click="clearCart">
                        <span v-if="clearing" class="btn-spinner"></span>
                        <span v-else>Yes, clear</span>
                    </button>
                    <button class="confirm-no" @click="showClearConfirm = false">
                        Cancel
                    </button>
                    </div>
                </Transition>
            </div>
      </div>

      <!-- Empty State -->
      <div v-if="cartItems.length === 0" class="empty-state">
        <i class="bi bi-cart-x"></i>
        <h4>Your cart is empty</h4>
        <p>Browse services and add something you like!</p>
        <router-link to="/products" class="btn btn-warning mt-2">
          Browse Services
        </router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="row g-4">

        <!-- ── Cart Items ── -->
        <div class="col-lg-8">
          <div class="cart-items-list">
            <div v-for="group in groupedItems" :key="group.provider?._id" class="cart-item">
              <div class="cart-item-inner">

                <!-- Provider Header Row (once per provider) -->
                <div class="provider-header">
                  <img
                    :src="group.provider?.profileImage || 'https://placehold.co/24x24?text=?'"
                    class="provider-header-img"
                    alt="Provider"
                  />
                  <span class="provider-header-name">
                    {{ group.provider?.firstName }} {{ group.provider?.lastName }}
                  </span>
                  <router-link
                    :to="`/profile/${group.provider?._id}`"
                    class="btn-profile"
                  >
                    <i class="bi bi-chevron-right"></i>
                  </router-link>
                </div>
                <hr class="provider-divider" />

                <!-- One body row per item under this provider -->
                <div
                  v-for="item in group.items"
                  :key="item._id"
                  class="cart-item-body"
                >
                  <!-- Icon -->
                  <div v-if="item.productId?.icon" class="service-icon-box">
                    {{ item.productId.icon }}
                  </div>

                  <!-- Right side -->
                  <div class="item-body-right">
                    <div class="item-info">
                      <p class="item-service-name mb-0">{{ item.productId?.serviceTypeId?.name }}</p>
                      <p v-if="item.productId?.customDescription" class="item-desc mb-1">
                        "{{ item.productId.customDescription }}"
                      </p>
                      <div class="item-meta">
                        <span v-if="item.productId?.duration">
                          <i class="bi bi-clock me-1"></i>{{ item.productId.duration }} min
                        </span>
                        <span v-if="item.productId?.availabilityNotes">
                          <i class="bi bi-calendar3 me-1"></i>{{ item.productId.availabilityNotes }}
                        </span>
                      </div>
                      <p class="item-unit-price mb-0">${{ (item.subtotal / item.quantity).toFixed(2) }} per session</p>
                    </div>

                    <div class="controls">
                      <div class="quantity-controls">
                        <button class="qty-btn" :disabled="item.quantity <= 1 || updatingId === item._id" @click="updateQuantity(item, item.quantity - 1)">
                          <i class="bi bi-dash"></i>
                        </button>
                        <span class="qty-value">{{ item.quantity }}</span>
                        <button class="qty-btn" :disabled="updatingId === item._id" @click="updateQuantity(item, item.quantity + 1)">
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                      <div class="item-right">
                        <p class="item-subtotal">${{ item.subtotal.toFixed(2) }}</p>
                        <button class="btn-remove" :disabled="removingId === item.productId?._id" @click="removeItem(item.productId?._id)">
                          <span v-if="removingId === item.productId?._id" class="btn-spinner"></span>
                          <i v-else class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
                <!-- end item loop -->

              </div>
            </div>
          </div>
          
        </div>

        <!-- ── Order Summary ── -->
        <div class="col-lg-4">
            <div class="summary-card">
                <h5 class="summary-title">Order Summary</h5>

                <div class="summary-row">
                <span>Subtotal ({{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }})</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                <span>
                    Service Fee
                    <span class="fee-badge">10%</span>
                </span>
                <span>${{ serviceFee.toFixed(2) }}</span>
                </div>

                <hr class="summary-divider" />

                <div class="summary-row total">
                <span>Total</span>
                <span>${{ grandTotal.toFixed(2) }}</span>
                </div>

                <button
                  class="btn-checkout"
                  @click="checkout"
                >
                  <i class="bi bi-bag-check me-2"></i>
                  Checkout · ${{ grandTotal.toFixed(2) }}         
                </button>

                <router-link to="/products" class="btn-continue">
                <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                </router-link>
            </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";
import { useGlobalStore } from '../stores/global'

const router  = useRouter();
const notyf   = new Notyf();

const cart       = ref(null);
const loading    = ref(true);
const clearing   = ref(false);
const checkingOut = ref(false);
const updatingId = ref(null);
const removingId = ref(null);
const globalStore = useGlobalStore();
const refreshCartCount = () => globalStore.fetchCartCount();


// Compute
const cartItems = computed(() => cart.value?.cartItems || []);
const totalPrice = computed(() => cart.value?.totalPrice || 0);
const SERVICE_FEE_RATE = 0.10
const serviceFee = computed(() => totalPrice.value * SERVICE_FEE_RATE)
const grandTotal = computed(() => totalPrice.value + serviceFee.value)

// Fetch Cart
const fetchCart = async () => {
  if (!cart.value) loading.value = true;
  try {
    const { data } = await api.get("/cart/get-cart");
    cart.value = data.cartItems ? data : null;
    globalStore.fetchCartCount()
  } catch (err) {
    console.error("Error fetching cart:", err);
    notyf.error("Failed to load cart");
  } finally {
    loading.value = false;
  }
  
};

// Group Items
const groupedItems = computed(() => {
  const groups = {};
  cartItems.value.forEach(item => {
    const providerId = item.productId?.providerId?._id;
    if (!groups[providerId]) {
      groups[providerId] = {
        provider: item.productId?.providerId,
        items: []
      };
    }
    groups[providerId].items.push(item);
  });
  return Object.values(groups);
});

// Update Quantity 
const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  updatingId.value = item._id;
  try {
    const { data } = await api.patch("/cart/update-cart-quantity", {
      productId: item.productId._id,
      newQuantity
    });
    await fetchCart();
    notyf.success("Quantity updated");
  } catch (err) {
    notyf.error(err.response?.data?.message || "Failed to update quantity");
  } finally {
    updatingId.value = null;
  }
};

// Remove Item 
const removeItem = async (productId) => {
  removingId.value = productId;
  try {
    const { data } = await api.patch(`/cart/${productId}/remove-from-cart`);
    await fetchCart();
    notyf.success("Item removed");
    globalStore.fetchCartCount()
  } catch (err) {
    notyf.error(err.response?.data?.message || "Failed to remove item");
  } finally {
    removingId.value = null;
  }
  
};

// Clear Cart 
const showClearConfirm = ref(false)

const clearCart = async () => {
  showClearConfirm.value = false
  clearing.value = true
  try {
    const { data } = await api.put("/cart/clear-cart");
    await fetchCart();
    notyf.success("Cart cleared");
    globalStore.fetchCartCount()
  } catch (err) {
    notyf.error(err.response?.data?.message || "Failed to clear cart");
  } finally {
    clearing.value = false;
  }
};

// Checkout
const checkout = () => {
  router.push('/checkout')
}

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 56px;
  display: block;
  margin-bottom: 16px;
  color: var(--text-muted);
}

.empty-state h4 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* ── Cart Items ── */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: block;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-id {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-product-id {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
}

.provider-avatar {
  border-radius: 8px; 
  object-fit: cover;
  border: 2px solid var(--accent);
  flex-shrink: 0;
  align-self: stretch;
}

.provider-header-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
  flex-shrink: 0;

}

.provider-header-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.provider-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 0;
}

.btn-profile {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-profile:hover {
  background: rgba(212, 175, 55, 0.08);
  color: var(--accent);
  border-color: rgba(212, 175, 55, 0.3);
}

.provider-divider {
  border-color: var(--border);
  margin: 8px 0 0 0;
}

.item-service-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.service-icon-box {
  font-size: 36px;
  width: 2.4em;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hover-bg);
  border: 2px solid var(--accent);
  border-radius: 8px;
  flex-shrink: 0;
  align-self: stretch;
}

.item-body-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  min-width: 0;
}

.item-desc {
  font-size: 12px;
  color: var(--text-secondary);
  font-style: italic;
}

.item-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  margin-bottom: 4px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1em;

}

.cart-item-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.cart-item-body {
  display: flex;
  align-items: stretch;
  gap: 20px;
}

.cart-item-body + .cart-item-body {
  border-top: 1px solid var(--border);
  padding-top: 20px;
  margin-top: 20px;
}

/* ── Quantity Controls ── */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
}

.qty-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  font-size: 16px;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-btn:hover:not(:disabled) {
  color: var(--accent);
}

.qty-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 20px;
  text-align: center;
}

/* ── Item Right ── */
.item-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-subtotal {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-remove:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Clear Button ── */
.btn-clear {
  display: inline-flex;
  align-items: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Summary Card ── */
.summary-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  position: sticky;
  top: 90px;
}

.summary-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.summary-row.total {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0;
}

.summary-divider {
  border-color: var(--border);
  margin: 16px 0;
}

.item-unit-price {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.fee-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 6px;
  color: var(--text-muted);
  vertical-align: middle;
}

/* ── Clear Confirm ── */
.clear-wrap {
  display: flex;
  align-items: center;
}

.confirm-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text-secondary);
}

.confirm-yes {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.confirm-yes:hover:not(:disabled) {
  background: #dc2626;
}

.confirm-yes:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-no {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-no:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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

.btn-checkout:hover:not(:disabled) {
  background: var(--accent);
  transform: translateY(-1px);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-checkout:active {
  transform: translateY(0);
}

/* ── Continue Shopping ── */
.btn-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-continue:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: transparent;
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

/* ── Responsive ── */
@media (max-width: 576px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>