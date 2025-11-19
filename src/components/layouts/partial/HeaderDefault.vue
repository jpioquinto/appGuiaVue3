<script setup lang="ts">
import gobierno from '@/assets/images/logos/gob-mx.png'
</script>
<template>
  <header class="hero is-sedatu-1">
    <div class="hero-head">
      <div class="container">
        <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a
              class="image is-128x128 py-6"
              href="https://www.gob.mx"
              target="_blank"
              rel="noopener"
            >
              <img class="navbar-brand-logo" :src="gobierno" alt="SEDATU" />
            </a>
            <a
              role="button"
              class="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navMenuGuia"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div class="navbar-menu" id="navMenuGuia">
            <div class="navbar-end">
              <a class="navbar-item has-text-weight-semibold"> Trámites </a>
              <a class="navbar-item has-text-weight-semibold"> Gobierno </a>
              <a class="navbar-item has-text-weight-semibold">
                <span class="icon is-small"> <i class="fa fa-key"></i></span>
                Iniciar sesión
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
