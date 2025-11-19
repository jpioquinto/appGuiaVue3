<script setup lang="ts">
import HeaderApp from './partial/HeaderDefault.vue'
import FooterApp from './partial/FooterDefault.vue'
</script>
<template>
  <div class="default-layout">
    <HeaderApp />
    <main class="container">
      <router-view />
    </main>
    <FooterApp />
  </div>
</template>
