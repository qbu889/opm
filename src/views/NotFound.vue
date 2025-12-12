<script setup lang="ts">

</script>

<template>
  {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/NotFound.vue')
  }
</template>

<style scoped>

</style>