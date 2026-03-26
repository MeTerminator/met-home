<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const props = withDefaults(defineProps<{
  strength?: number;
  hoverUnderline?: boolean;
  href?: string;
  target?: string;
  className?: string;
}>(), {
  strength: 100,
  hoverUnderline: false,
});

const isDesktop = () => {
  return typeof window !== 'undefined' && window.innerWidth > 768; // simple fallback
};

const magnet = ref<HTMLAnchorElement | null>(null);

onMounted(() => {
  if (!magnet.value) return;
  const magnetButton = magnet.value!;
  const shapka = magnetButton.querySelector('.shapka');
  const shapkaBg = magnetButton.querySelector('.shapka-bg');

  if (isDesktop()) {
    magnetButton.addEventListener('mousemove', handleMagnetMove);
    magnetButton.addEventListener('mouseout', handleMagnetOut);
  }

  function handleMagnetOut() {
    gsap.to([magnetButton, shapka, shapkaBg], {
      x: 0,
      y: 0,
      ease: 'elastic.out(1,0.4)',
      duration: 1.5,
    });
  }

  function handleMagnetMove(event: MouseEvent) {
    const bounding = magnetButton.getBoundingClientRect();
    const magneticWidth = (event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5;
    const magneticHeight = (event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5;

    gsap.to(magnetButton, {
      x: magneticWidth * props.strength,
      y: magneticHeight * props.strength,
      ease: 'power2.out',
      duration: 1,
    });

    if (shapka) {
      gsap.to(shapka, {
        x: magneticWidth * (props.strength / 2),
        y: magneticHeight * (props.strength / 2),
        ease: 'power2.out',
        duration: 1,
      });
    }

    if (shapkaBg) {
      gsap.to(shapkaBg, {
        x: -magneticWidth * (props.strength / 2),
        y: -magneticHeight * (props.strength / 2),
        ease: 'power2.out',
        duration: 1,
      });
    }
  }
});

onUnmounted(() => {
  if (magnet.value) {
    magnet.value.removeEventListener('mousemove', () => { });
    magnet.value.removeEventListener('mouseout', () => { });
  }
});
</script>

<template>
  <a ref="magnet" :href="href" :target="target" :class="[
    'flex justify-center *:pointer-events-none',
    hoverUnderline ? 'before:absolute before:bottom-0 before:h-0.5 before:w-0 before:origin-center before:bg-[#a3a3a3] before:transition-all before:duration-300 hover:before:w-full' : '',
    className
  ]">
    <slot />
  </a>
</template>
