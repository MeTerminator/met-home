<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const handleMove = (e: MouseEvent) => {
  gsap.to('.cursor', {
    x: e.clientX,
    y: e.clientY,
    stagger: 0.05,
  });
};

onMounted(() => {
  document.addEventListener('mousemove', handleMove);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMove);
});
</script>

<template>
  <div class="cursor cursor1"></div>
  <div class="cursor cursor2"></div>
</template>
