<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Magentic from './ui/Magentic.vue';
import { menuStore } from '../store/menu';

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create('custom', 'M0,0 C0.52,0.01 0.16,1 1,1');

const props = withDefaults(defineProps<{
  color: 'Dark' | 'Light';
  className?: string;
  mode?: 'hamburger' | 'cross';
}>(), {
  mode: 'hamburger',
});

const logoAnimationTl = ref<gsap.core.Timeline | null>(null);

onMounted(() => {
  logoAnimationTl.value = gsap.timeline({ paused: true }).fromTo(
    '.logo__rotate',
    { rotate: 0, transformOrigin: 'center' },
    { rotate: -360, transformOrigin: 'center', duration: 0.6, ease },
  );
});

onUnmounted(() => {
  logoAnimationTl.value?.kill();
});

const onMenuToggle = () => {
  if (props.mode === 'cross') {
    menuStore.toggleMenu({ isMenuOpen: false });
  } else {
    menuStore.toggleMenu({ isMenuOpen: true, color: props.color });
  }
};
</script>

<template>
  <header :class="['nav__container anime', className]">
    <nav class="nav__bar">
      <div class="max-w-maxWidth flex justify-between w-full relative">
        <Magentic href="#" :strength="50" :className="['nav__item text-xl font-bold hover:cursor-pointer'].join(' ')"
          :style="{ color: color === 'Dark' ? 'var(--colorDark)' : 'var(--colorLight)' }"
          @mouseenter="logoAnimationTl?.play()" @mouseleave="logoAnimationTl?.reverse()">
          <p class="mask logo__anim flex items-center justify-center font-semibold">
            MeT-Home
          </p>
        </Magentic>
        <Magentic :strength="50" :className="['nav__item h-8 w-8 cursor-pointer items-center'].join(' ')"
          :style="{ color: color === 'Dark' ? 'var(--colorDark)' : 'var(--colorLight)' }" @click="onMenuToggle">
          <div
            :class="['flex h-[0.9rem] w-full flex-col justify-between', mode === 'cross' ? 'scale-[.90] justify-center' : '']">
            <div :class="['h-[0.15rem] w-full', mode === 'cross' ? 'absolute rotate-45' : '']"
              :style="{ backgroundColor: color === 'Dark' ? 'var(--colorDark)' : 'var(--colorLight)' }">
            </div>
            <div :class="['h-[0.15rem] w-full', mode === 'cross' ? 'absolute -rotate-45' : '']"
              :style="{ backgroundColor: color === 'Dark' ? 'var(--colorDark)' : 'var(--colorLight)' }">
            </div>
          </div>
        </Magentic>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav__container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: var(--paddingX);
  right: var(--paddingX);
  z-index: 5000;
}

.nav__bar {
  width: 100%;
}
</style>
