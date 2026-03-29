<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const progress = ref(0);
const isVisible = ref(true);
const loadingText = ref('Loading...');

// Professional dark theme colors reflecting test/test.vue defaults
// We use these as curtain layers. The last one (#0d0d0d) acts as the base background.
const staggeredColors = ['#1a1a1a', '#FC5A8A', '#2ABFC5'];

onMounted(() => {
  // Simple resource loading tracking
  const images = Array.from(document.querySelectorAll('img'));
  // Images + Fonts + arbitrary delay to ensure smooth start
  const totalResources = images.length + 1;
  let loadedCount = 0;

  const updateProgress = () => {
    loadedCount++;
    const targetProgress = Math.min((loadedCount / totalResources) * 100, 100);

    gsap.to(progress, {
      value: targetProgress,
      duration: 0.5,
      ease: 'power2.out'
    });

    if (loadedCount >= totalResources) {
      setTimeout(finishLoading, 600);
    }
  };

  // Initial reveal of loader text
  gsap.from('.loading-content .anime', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.2
  });

  if (images.length === 0) {
    document.fonts.ready.then(() => {
      progress.value = 100;
      setTimeout(finishLoading, 1000);
    });
  } else {
    images.forEach((img) => {
      if (img.complete) {
        updateProgress();
      } else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress);
      }
    });

    document.fonts.ready.then(() => {
      updateProgress();
    });
  }

  // Safety backup
  const timeoutId = setTimeout(() => {
    if (isVisible.value) {
      progress.value = 100;
      finishLoading();
    }
  }, 10000);

  onUnmounted(() => clearTimeout(timeoutId));
});

const finishLoading = () => {
  const tl = gsap.timeline({
    onComplete: () => {
      isVisible.value = false;
      window.dispatchEvent(new Event('app-loaded'));
    }
  });

  // 1. Fade out the text content first
  tl.to('.loading-content', {
    opacity: 0,
    y: -20,
    duration: 0.6,
    ease: 'power2.in'
  });

  // 2. The layers (curtains) slide away to reveal the actual page content
  // Reference: test/test.vue staggered xPercent movement
  tl.to('.staggered-layer', {
    xPercent: 100,
    duration: 1.2,
    stagger: 0.15,
    ease: 'expo.inOut'
  }, '-=0.2');

  // 3. Fade out the bottom progress bar
  tl.to('.progress-bar-container', {
    opacity: 0,
    duration: 0.4
  }, '-=1.0');

  // Disable pointer events early so user can interact with page as it reveals
  tl.set('.loading-overlay', { pointerEvents: 'none' }, '-=0.8');
};
</script>

<template>
  <div v-if="isVisible" class="loading-overlay">
    <!-- Staggered Layers (The actual curtains) -->
    <div v-for="(color, index) in staggeredColors" :key="index" class="staggered-layer"
      :style="{ backgroundColor: color, zIndex: 100 - index }"></div>

    <div class="loading-content">
      <h1 class="title anime">MeT-Home</h1>
      <p class="subtitle anime">{{ loadingText }}</p>
    </div>

    <!-- Progress Bar at bottom -->
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color is transparent because 'staggered-layer's provide the background */
  background-color: transparent;
  color: white;
  overflow: hidden;
}

.staggered-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(0);
  will-change: transform;
}

.loading-content {
  position: relative;
  z-index: 110;
  text-align: center;
}

.title {
  font-size: clamp(2.5rem, 10vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.9rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  opacity: 0.4;
  font-weight: 400;
}

.progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 120;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color, #f97316);
  transition: width 0.4s cubic-bezier(0.1, 0, 0, 1);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.3);
}

:global(body.loading) {
  overflow: hidden;
}
</style>
