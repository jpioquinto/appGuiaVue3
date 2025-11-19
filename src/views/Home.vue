<template>
  <div class="home-page">
    <div class="card hero mt-5">
      <div class="card-content">
        <p class="title">Bienvenido a la Guía para la Integración de Proyectos de Modernización</p>
        <p class="subtitle mt-5">
          ¡Llega el nuevo aplicativo para la Integración de Proyectos de Modernización!
        </p>
        <div class="content">
          <div class="hero-buttons">
            <router-link to="/login" class="btn btn-primary"
              ><span class="icon is-small"> <i class="fa fa-key"></i></span> Iniciar
              Sesión</router-link
            >
            <router-link to="/about" class="btn btn-secondary"
              ><span class="icon is-small"> <i class="fa fa-info-circle"></i></span> Más
              Información</router-link
            >
          </div>
        </div>
      </div>
    </div>

    <section class="features">
      <h2 class="has-text-weight-semibold">Características</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3 class="has-text-weight-semibold">Responsive</h3>
          <p>Diseño adaptable a cualquier dispositivo</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="has-text-weight-semibold">Rápido</h3>
          <p>Rendimiento optimizado con Vite</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="has-text-weight-semibold">Moderno</h3>
          <p>Interfaz moderna y atractiva</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="has-text-weight-semibold">Seguro</h3>
          <p>Con autenticación y autorización</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.home-page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 10px;
  margin-bottom: 4rem;
}

.hero p.subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background-color: #667eea;
  color: white;
}

.features {
  margin-bottom: 4rem;
}

.features h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin: 1rem 0;
}

.feature-card p {
  color: #718096;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }

  .features h2 {
    font-size: 1.5rem;
  }
}
</style>
