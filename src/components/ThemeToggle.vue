<template>
  <button class="theme-toggle" @click="toggleTheme">
    <span class="dot" :class="{ on: isLight }"></span>
    <span class="label">
      {{ isLight ? "Light Mode" : "Dark Mode" }}
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLight = ref(false);

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  isLight.value = theme === "light";
};

const toggleTheme = () => {
  applyTheme(isLight.value ? "dark" : "light");
};

onMounted(() => {
  const saved = localStorage.getItem("theme");

  if (saved) {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }
});
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 600;
}

.dot {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--bg);
  position: relative;
  border: 1px solid var(--border);
}

.dot::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--text-secondary);
  border-radius: 50%;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  transition: 0.2s ease;
}

.dot.on::after {
  left: 18px;
  background: var(--accent);
}
</style>
