<script setup lang="ts">
import HeaderApp from './partial/HeaderDefault.vue'
import FooterApp from './partial/FooterDefault.vue'
</script>
<template>
  <div class="default-layout">
    <HeaderApp />
    <main>
      <router-view />
    </main>
    <FooterApp />
  </div>
</template>
