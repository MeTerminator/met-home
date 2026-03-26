<script setup lang="ts">
defineProps<{
  type: 'Dark' | 'Light';
}>();
</script>

<template>
  <template v-if="type === 'Dark'">
    <div class="rounded__div__down darkGradient">
      <div class="round__bg__down lightGradient"></div>
    </div>
    <div class="rounded__div__up darkGradient">
      <div class="round__bg__up lightGradient"></div>
    </div>
  </template>
  <template v-else>
    <div class="rounded__div__down lightGradient">
      <div class="round__bg__down darkGradient"></div>
    </div>
    <div class="rounded__div__up lightGradient">
      <div class="round__bg__up darkGradient"></div>
    </div>
  </template>
</template>
