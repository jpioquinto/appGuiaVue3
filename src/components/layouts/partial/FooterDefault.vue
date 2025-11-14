<template>
  <footer class="default-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Mi Aplicación</h3>
        <p>Ejemplo de aplicación Vue 3 con múltiples layouts</p>
      </div>
      <div class="footer-section">
        <h3>Enlaces</h3>
        <ul>
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/about">Acerca de</router-link></li>
          <li><router-link to="/contact">Contacto</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Redes Sociales</h3>
        <div class="social-links">
          <a href="#" target="_blank">Twitter</a>
          <a href="#" target="_blank">GitHub</a>
          <a href="#" target="_blank">LinkedIn</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Mi Aplicación. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>
