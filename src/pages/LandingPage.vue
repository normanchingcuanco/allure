<template>
  <div class="landing">

    <!-- HERO SECTION -->
    <section class="hero container">
      <h1 class="hero-title">
        Where Filipino Connections Meet the World.
      </h1>

      <p class="hero-subtitle">
        Allure is where Filipino singles connect globally — intentional,
        authentic, and built for real connections beyond borders.
      </p>

      <div class="hero-buttons">
        <router-link to="/profiles" class="btn-primary">
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
          <div class="step-card card">
            <h3>Build Your Presence</h3>
            <p>Create a profile that reflects who you are — your interests, values, and what you're looking for.</p>
          </div>

          <div class="step-card card">
            <h3>Discover & Show Interest</h3>
            <p>Browse profiles and connect with people who align with your goals.</p>
          </div>

          <div class="step-card card">
            <h3>Unlock the Conversation</h3>
            <p>Activate chat and premium features to explore deeper compatibility.</p>
          </div>
        </div>
      </div>
    </section>


    <!-- INTENTIONAL DESIGN -->
    <section class="section container">
      <h2 class="section-title">Connection, But Curated</h2>

      <p class="section-text">
        Allure is built for people who are serious about meaningful relationships.
      </p>

      <p class="section-text">
        Profiles are intentional. Interactions are respectful. And members control what they share.
      </p>

      <p class="section-text highlight">
        No noise. Just real connections.
      </p>
    </section>


    <!-- GLOBAL -->
    <section class="section alt-bg">
      <div class="container">
        <h2 class="section-title">From the Philippines to the World</h2>

        <p class="section-text">
          Distance shouldn’t limit connection.
        </p>

        <p class="section-text">
          Whether you're across the city or across the globe, Allure brings Filipino singles and international users together in one refined space.
        </p>
      </div>
    </section>


    <!-- FINAL CTA -->
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


<script setup>
// No logic needed for now
</script>


<style scoped>

/* ===============================
   HERO
================================ */

.hero {
  text-align: center;
  padding: 120px 20px 100px;
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


/* ===============================
   SECTIONS
================================ */

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

.highlight {
  color: var(--accent);
  font-weight: 600;
}


/* ===============================
   STEPS
================================ */

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


/* ===============================
   CTA
================================ */

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


/* ===============================
   BUTTONS
================================ */

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


/* ===============================
   RESPONSIVE
================================ */

@media (max-width: 768px) {
  .hero-title {
    font-size: 34px;
  }

  .section-title {
    font-size: 26px;
  }
}

</style>