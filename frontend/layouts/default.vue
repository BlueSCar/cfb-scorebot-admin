<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <AppShell :current-year="currentYear">
    <slot />
  </AppShell>
</template>
