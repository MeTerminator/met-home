<template>
  <div :class="cardClass" class="tilted" ref="cardRef" @mousemove="throttledHandleMouse" @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave" :style="cardStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const props = defineProps<{
  width: string;
  height: string;
  rotateAmplitude: number;
  cardClass: string;
  scale: boolean;
}>()

const cardRef = ref<HTMLElement | null>(null);

const state = reactive({
  rotateX: 0,
  rotateY: 0,
  scale: 1,
});

const rotateAmplitude = props.rotateAmplitude;

// Custom throttle implementation with cancel to avoid lodash dependency
function createThrottle(func: Function, limit: number) {
  let inThrottle = false;
  let timeoutId: any = null;

  const throttled = function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };

  throttled.cancel = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    inThrottle = false;
  };

  return throttled;
}

const throttledHandleMouse = createThrottle(handleMouse, 32);

const cardStyle = computed(() => ({
  transform: `perspective(800px) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) scale(${state.scale})`,
  transition: state.scale === 1 ? 'transform 0.5s ease' : 'transform 0.2s ease',
  height: props.height,
  width: props.width
}));

function handleMouse(e: MouseEvent) {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - rect.width / 2;
  const offsetY = e.clientY - rect.top - rect.height / 2;

  state.rotateX = (-offsetY / (rect.height / 2)) * rotateAmplitude;
  state.rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;
}

function handleMouseEnter() {
  state.scale = 1.02;
}

function handleMouseLeave() {
  throttledHandleMouse.cancel();
  state.rotateX = 0;
  state.rotateY = 0;
  state.scale = 1;
}
</script>

<style scoped>
.tilted {
  will-change: transform;
  cursor: pointer;
}
</style>
