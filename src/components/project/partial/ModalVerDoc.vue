<script setup lang="ts">
const props = defineProps(['activa', 'url'])
</script>
<template>
  <div class="modal" :class="{ 'is-active': activa }">
    <div class="modal-background" @click="() => $emit('cerrar')"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <embed :src="url" type="application/pdf" width="100%" height="600" class="is-4by3" />
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="() => $emit('cerrar')"></button>
  </div>
</template>
