<script setup lang="ts">
import { reactive, computed } from 'vue'
import FormLogin from '../login/FormLogin.vue'

const config = reactive({ logo: '' })

const logoSedatu = computed(() => {
  /*if (config.logo == '') {
    config.logo = 'efdfd' //document.getElementById('logos').getAttribute('logo')!
  }*/
  return config.logo
})
</script>
<template>
  <FormLogin :logo="logoSedatu" />
</template>
