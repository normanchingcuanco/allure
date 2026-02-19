<script setup>
import { ref, onMounted } from "vue";
import ThemeToggle from "../components/ThemeToggle.vue";

const logoSrc = ref("/allure-logo-dark.svg");

const updateLogo = () => {
  const theme = localStorage.getItem("theme");
  logoSrc.value =
    theme === "light"
      ? "/allure-logo-light.svg"
      : "/allure-logo-dark.svg";
};

onMounted(() => {
  updateLogo();
  window.addEventListener("storage", updateLogo);
});
</script>

<template>
  <div class="landing">

    <!-- TOP BAR -->
    <div class="landing-topbar">
      <img :src="logoSrc" alt="Allure Logo" class="landing-logo" />
      <ThemeToggle />
    </div>

    <!-- HERO -->
    <section class="hero container">

      <h1 class="hero-title">
        Where Filipino Connections Meet the World.
      </h1>

      <p class="hero-subtitle">
        Allure is where Filipino singles connect globally — intentional,
        authentic, and built for real connections beyond borders.
      </p>

      <div class="hero-buttons">
        <router-link to="/login" class="btn-primary">
          Explore Profiles
        </router-link>

        <router-link to="/register" class="btn-outline">
          Register
        </router-link>
      </div>
    </section>

    <!-- WHAT IS ALLURE -->
    <section class="section container">
      <h2 class="section-title">A New Way to Connect Globally</h2>

      <p class="section-text">
        Allure is a modern connection marketplace designed to spotlight Filipino singles and introduce them to the world.
      </p>

      <p class="section-text">
        It’s not about endless swiping. It’s about intentional matches, real conversations, and meaningful connections.
      </p>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section alt-bg">
      <div class="container">
        <h2 class="section-title">How It Works</h2>

        <div class="steps">
          <div class="step-card">
            <h3 class="step-title">Build Your Presence</h3>
            <p class="step-text">
              Create a profile that reflects who you are — your interests, values, and what you're looking for.
            </p>
          </div>

          <div class="step-card">
            <h3 class="step-title">Discover & Show Interest</h3>
            <p class="step-text">
              Browse profiles and connect with people who align with your goals.
            </p>
          </div>

          <div class="step-card">
            <h3 class="step-title">Unlock the Conversation</h3>
            <p class="step-text">
              Activate chat and premium features to explore deeper compatibility.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section container">
      <h2>Ready to Connect Differently?</h2>

      <p>
        Join Allure and experience a more intentional way to meet.
      </p>

      <router-link to="/register" class="btn-primary">
        Join Allure
      </router-link>
    </section>

  </div>
</template>

<style scoped>

/* TOPBAR */
.landing-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
}

.landing-logo {
  width: 160px;
}

/* HERO */
.hero {
  text-align: center;
  padding: 100px 20px 80px;
}

.hero-title {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 40px;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* SECTIONS */
.section {
  padding: 100px 20px;
  text-align: center;
}

.alt-bg {
  background: var(--card-bg);
}

.section-title {
  font-size: 32px;
  margin-bottom: 30px;
}

.section-text {
  max-width: 700px;
  margin: 0 auto 20px;
  color: var(--text-secondary);
  font-size: 16px;
}

/* HOW IT WORKS */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.step-card {
  padding: 30px;
  border-radius: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  transition: 0.3s ease;
}

.step-card:hover {
  border-color: var(--accent);
  transform: translateY(-5px);
}

/* 🔥 GOLD BOLD TITLES */
.step-title {
  color: var(--accent);
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
}

.step-text {
  color: var(--text-secondary);
  font-size: 15px;
}

/* CTA */
.cta-section {
  text-align: center;
  padding: 120px 20px;
}

.cta-section h2 {
  font-size: 32px;
  margin-bottom: 20px;
}

.cta-section p {
  color: var(--text-secondary);
  margin-bottom: 30px;
}

/* BUTTONS */
.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-soft));
  color: #000;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s ease;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s ease;
}

.btn-outline:hover {
  background: var(--accent);
  color: #000;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-title {
    font-size: 34px;
  }

  .section-title {
    font-size: 26px;
  }

  .landing-topbar {
    padding: 20px;
  }
}
</style>