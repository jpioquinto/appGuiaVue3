<script setup lang="ts">
import logoGobierno from '@/assets/images/logos/gob-mx.png'
</script>
<template>
  <footer class="footer is-sedatu-1 mt-6">
    <div class="container">
      <div class="columns is-desktop is-mobile">
        <div class="column">
          <figure class="image is-128x128">
            <img :src="logoGobierno" alt="Gobierno de México" class="logo_footer" />
          </figure>
        </div>
        <div class="column is-four-fifths">
          <p class="pt-2">
            &copy; 2025 Guía para la Intregación de Proyectos | Dirección General de Inventarios y
            Modernización Registral y Catastral.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
