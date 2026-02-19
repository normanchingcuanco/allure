<template>
  <div class="admin-page">

    <!-- Header -->
    <header class="admin-header">
      <div class="container header-content">
        <div>
          <h1 class="page-title">Admin Dashboard</h1>
          <p class="page-subtitle">Manage your products</p>
        </div>

        <div class="header-actions">
          <!-- Orders Button -->
          <button class="btn-secondary" @click="goToOrders">
            <i class="bi bi-receipt"></i>
            Orders
          </button>

          <!-- Add Product -->
          <button class="btn-primary" @click="handleCreateProduct">
            <i class="bi bi-plus-circle"></i>
            Add Product
          </button>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <div class="container">
      <div class="stats-grid">

        <div class="stat-card">
          <h3>{{ products.length }}</h3>
          <p>Total Products</p>
        </div>

        <div class="stat-card">
          <h3>{{ activeProducts }}</h3>
          <p>Active</p>
        </div>

        <div class="stat-card">
          <h3>{{ inactiveProducts }}</h3>
          <p>Inactive</p>
        </div>

        <div class="stat-card">
          <h3>{{ uniqueCategories }}</h3>
          <p>Categories</p>
        </div>

      </div>

      <!-- Table -->
      <div class="table-section">

        <h2 class="section-title">All Products</h2>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <div v-else-if="products.length > 0" class="table-responsive">
          <table class="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="product in products" :key="product._id">
                <td class="name-cell">{{ product.name }}</td>

                <td>
                  <span class="category-badge">
                    {{ product.category }}
                  </span>
                </td>

                <td>
                  <span
                    class="status-badge"
                    :class="product.isActive ? 'active' : 'inactive'"
                  >
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="text-end">
                  <div class="action-buttons">
                    <UpdateProductButton
                      :product="product"
                      @status-updated="fetchProducts"
                    />

                    <UpdateProductStatusButton
                      :product="product"
                      @status-updated="fetchProducts"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-state">
          <p>No products found.</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

import UpdateProductButton from "../components/EditProductButton.vue";
import UpdateProductStatusButton from "../components/UpdateProductStatusButton.vue";

const router = useRouter();
const products = ref([]);
const loading = ref(true);

const activeProducts = computed(() =>
  products.value.filter(p => p.isActive).length
);

const inactiveProducts = computed(() =>
  products.value.filter(p => !p.isActive).length
);

const uniqueCategories = computed(() => {
  return new Set(products.value.map(p => p.category)).size;
});

const fetchProducts = async () => {
  try {
    loading.value = true;
    const res = await api.get("/products/all");
    products.value = res.data.products || res.data || [];
  } catch (err) {
    console.error("❌ Fetch products failed:", err);
    router.push("/login");
  } finally {
    loading.value = false;
  }
};

const handleCreateProduct = () => {
  router.push("/products/create");
};

const goToOrders = () => {
  router.push("/admin/orders");
};

onMounted(fetchProducts);
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
.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 12px;
  transition: 0.2s;
}

.btn-secondary:hover {
  background: var(--hover-bg);
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

.section-title {
  margin-bottom: 20px;
  color: var(--text-primary);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
}

.products-table td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.products-table tbody tr:hover {
  background: var(--hover-bg);
}

.category-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--hover-bg);
  color: var(--text-secondary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

</style>
