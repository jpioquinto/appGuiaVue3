<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import gobierno from '@/assets/images/logos/gob-mx.png'
const { logout } = useAuth()
</script>
<template>
  <header class="hero is-sedatu-1">
    <div class="hero-head">
      <div class="container">
        <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item">
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
          <div class="navbar-menu">
            <div class="navbar-end">
              <a @click.preventDefault="logout" class="navbar-item has-text-weight-semibold">
                <span class="icon is-small"> <i class="fa fa-lock"></i></span>
                Cerrar sesión
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
