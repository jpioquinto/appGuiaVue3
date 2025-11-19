<script setup lang="ts">
import logoGobierno from '@/assets/images/logos/gob-mx.png'
</script>
<template>
  <footer class="footer is-sedatu-1 mt-6">
    <div class="container">
      <div class="columns is-desktop is-mobile">
        <div class="column">
          <img
            :src="logoGobierno"
            href="/"
            alt="Gobierno de México"
            class="logo_footer"
            style="max-width: 50%; margin-left: -27px; margin-top: 12px"
          />
        </div>
        <div class="column">
          <h4 class="has-text-weight-semibold">Enlaces</h4>
          <div class="mt-5">
            <ul>
              <li><a href="#">Datos</a></li>
              <li><a href="#">Sistema de Portales de Obligaciones de Transparencia (SIPOT)</a></li>
              <li><a href="#">Transparencia</a></li>
              <li>
                <a href="#"
                  >Instituto Nacional de Transparencia, Acceso a la Información y Protección de
                  Datos Personales (INAI)</a
                >
              </li>
              <li><a href="#">Alerta</a></li>
              <li><a href="#">Denuncia</a></li>
            </ul>
          </div>
        </div>
        <div class="column">
          <h4 class="has-text-weight-semibold">¿Qué es gob.mx?</h4>
          <div class="mt-5">
            <ul>
              <li><a href="#">Declaración de Accesibilidad</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>
        <div class="column">
          <a class="has-text-weight-semibold is-underlined" href="#"
            >Denuncia contra servidores públicos</a
          >
          <h4 class="my-5">Contacto</h4>
          <a href="mailto:controlgestion@sedatu.gob.mx">
            Dudas e información a <span class="is-underlined">controlgestion@sedatu.gob.mx</span></a
          >
          <p class="has-text-weight-semibold my-3">Síguenos en</p>
        </div>
      </div>
    </div>
  </footer>
</template>
