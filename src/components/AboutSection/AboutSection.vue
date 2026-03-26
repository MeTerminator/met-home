<script setup lang="ts">
import { ref } from 'vue';
import BgImagesContainer from './BgImagesContainer.vue';
import Footer from '../Footer.vue';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import AboutCard from './AboutCard.vue';

const bgImagesSharedRef = ref<{ current: any | null }>({ current: null });

const onMouseEnter = () => {
  bgImagesSharedRef.value.current?.restart(true);
};

const onMouseLeave = () => {
  bgImagesSharedRef.value.current?.reverse();
};
</script>

<template>
  <section class="section section__5 third darkGradient h-full w-full relative isolation">
    <Bulge type="Light" />
    <Header color="Light" />

    <div class="relative z-50 flex items-center justify-center w-full max-w-[1200px] mx-auto">
      <AboutCard class="w-full max-w-[850px] backdrop-blur-md" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" />
    </div>

    <BgImagesContainer :bgImagesSharedRef="bgImagesSharedRef" />
    <Footer />
  </section>
</template>
