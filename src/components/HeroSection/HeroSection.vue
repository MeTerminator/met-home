<script setup lang="ts">
import { ref } from 'vue';
import HeroWrapper from './HeroWrapper.vue';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import ImageSequence from './ImageSequence.vue';

const sectionRef = ref<HTMLDivElement | null>(null);
</script>

<template>
  <section ref="sectionRef"
    class="section section__1 darkGradient first relative z-0 text-(--colorLight) h-full w-full">
    <Bulge type="Light" />
    <Header color="Light" />
    <HeroWrapper />
    <ImageSequence :sectionElement="sectionRef" />
  </section>
</template>
