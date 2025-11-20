<script setup lang="ts">
import HeaderApp from './partial/HeaderAdmin.vue'
import FooterApp from './partial/FooterAdmin.vue'
</script>
<template>
  <div class="default-layout">
    <HeaderApp />
    <main class="container py-6">
      <router-view />
    </main>
    <FooterApp />
  </div>
</template>
