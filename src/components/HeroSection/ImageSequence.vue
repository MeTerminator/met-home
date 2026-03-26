<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  sectionElement: HTMLElement | null;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const context = canvas.getContext('2d');

  const frameCount = 121;
  const currentFrame = (index: number) => `/met-hero-modal/${index.toString().padStart(3, '0')}.avif`;

  const images: HTMLImageElement[] = [];
  const state = { frame: 60 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  images[60].onload = render;

  function render() {
    if (!context || !canvas) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[state.frame], 0, 0);
  }

  let handleMouseMove: (event: MouseEvent) => void;

  const initEvents = () => {
    if (!props.sectionElement) return;

    handleMouseMove = (event: MouseEvent) => {
      const mousePositionX = event.clientX;
      const mappedX = gsap.utils.mapRange(
        0,
        props.sectionElement!.offsetWidth,
        1,
        frameCount - 1,
        mousePositionX
      );

      gsap.to(state, {
        frame: Math.round(mappedX - 1),
        snap: 'frame',
        ease: 'none',
        duration: 0.2,
        onUpdate: render,
      });
    };

    props.sectionElement.addEventListener('mousemove', handleMouseMove);
  };

  // Need to ensure sectionElement is available, using a slight timeout if needed or watch
  setTimeout(initEvents, 50);

  onUnmounted(() => {
    gsap.killTweensOf(state);
    if (props.sectionElement && handleMouseMove) {
      props.sectionElement.removeEventListener('mousemove', handleMouseMove);
    }
  });
});
</script>

<template>
  <div class="contrast-110 absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-hidden">
    <canvas ref="canvasRef" width="1024" height="1024" id="hero-lightpass"
      class="max-w-full max-h-[85dvh] w-auto h-auto object-contain"></canvas>
  </div>
</template>
