<template>
  <div class="admin-page">

    <!-- Header -->
    <header class="admin-header">
      <div class="container header-content">
        <div>
          <h1 class="page-title">Orders</h1>
          <p class="page-subtitle">View all customer orders</p>
        </div>

        <div class="header-actions">
          <button class="btn-secondary" @click="goBack">
            <i class="bi bi-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
    </header>

    <div class="container">
      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ orders.length }}</h3>
          <p>Total Orders</p>
        </div>

        <div class="stat-card">
          <h3>{{ pendingCount }}</h3>
          <p>Pending</p>
        </div>

        <div class="stat-card">
          <h3>{{ completedCount }}</h3>
          <p>Completed</p>
        </div>

        <div class="stat-card">
          <h3>₱{{ totalRevenue }}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <!-- Table -->
      <div class="table-section">
        <div class="table-header">
          <h2 class="section-title">All Orders</h2>

          <div class="table-actions">
            <input
              v-model="search"
              class="search-input"
              type="text"
              placeholder="Search by User ID / Status / Payment..."
            />

            <button class="btn-secondary" @click="fetchOrders" :disabled="loading">
              <i class="bi bi-arrow-clockwise"></i>
              {{ loading ? "Refreshing..." : "Refresh" }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading orders...</p>
        </div>

        <div v-else-if="filteredOrders.length > 0" class="table-responsive">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="order in filteredOrders" :key="order._id">
                <td class="mono">{{ order._id }}</td>
                <td class="mono">{{ order.userId }}</td>
                <td>₱{{ order.totalPrice }}</td>
                <td class="capitalize">{{ order.paymentMethod || "mock" }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="statusClass(order.status)"
                  >
                    {{ order.status || "Pending" }}
                  </span>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-state">
          <p>No orders found.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();

const orders = ref([]);
const loading = ref(true);
const search = ref("");

const fetchOrders = async () => {
  try {
    loading.value = true;

    // ✅ Matches your backend route: /orders/all-orders
    const res = await api.get("/orders/all-orders");

    orders.value = res.data.orders || res.data || [];
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);

    // If token expired / unauthorized, send to login
    router.push("/login");
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/admin");
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
};

const statusClass = (status) => {
  const s = (status || "Pending").toLowerCase();
  if (s.includes("complete")) return "completed";
  if (s.includes("cancel")) return "cancelled";
  return "pending";
};

const filteredOrders = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return orders.value;

  return orders.value.filter((o) => {
    const id = (o._id || "").toLowerCase();
    const userId = (o.userId || "").toLowerCase();
    const status = (o.status || "").toLowerCase();
    const payment = (o.paymentMethod || "").toLowerCase();

    return (
      id.includes(q) ||
      userId.includes(q) ||
      status.includes(q) ||
      payment.includes(q)
    );
  });
});

const pendingCount = computed(() =>
  orders.value.filter(o => (o.status || "Pending").toLowerCase().includes("pending")).length
);

const completedCount = computed(() =>
  orders.value.filter(o => (o.status || "").toLowerCase().includes("complete")).length
);

const totalRevenue = computed(() => {
  const sum = orders.value.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
  return sum.toLocaleString();
});

onMounted(fetchOrders);
</script>

<style scoped>
/* Page */
.admin-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 60px;
}

/* Header */
.admin-header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  padding: 30px 0;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.page-subtitle {
  color: var(--text-secondary);
}

/* Buttons */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.stat-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-card p {
  color: var(--text-secondary);
}

/* Table */
.table-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.section-title {
  margin: 0;
  color: var(--text-primary);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: min(380px, 60vw);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.table-responsive {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
  font-weight: 600;
}

.orders-table td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  vertical-align: middle;
}

.orders-table tbody tr:hover {
  background: var(--hover-bg);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.capitalize {
  text-transform: capitalize;
}

/* Status badges */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.14);
  color: #f59e0b;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
}

/* Spinner */
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
