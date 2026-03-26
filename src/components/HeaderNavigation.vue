<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Header from './Header.vue';
import Magentic from './ui/Magentic.vue';
import Footer from './Footer.vue';
import ScrambleText from './ui/ScrambleText.vue';
import { menuStore } from '../store/menu';
import { links } from '../data/data';

gsap.registerPlugin(CustomEase);

const ease = CustomEase.create('custom', 'M0,0 C0.52,0.01 0.16,1 1,1');
const headerAnimation = ref<gsap.core.Timeline | null>(null);
const scrambleRefs = ref<Array<InstanceType<typeof ScrambleText> | null>>([]);

const headerData = [
  { name: 'Home', href: '#home' },
  { name: 'Navigation', href: links.navigation, target: '_blank' },
  { name: 'Blog', href: links.blog, target: '_blank' },
  { name: 'About', href: links.about, target: '_blank' },
  { name: 'Links', href: links.links, target: '_blank' },
];

onMounted(() => {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
  const flexHeight = isDesktop ? '20vh' : '7vh';

  headerAnimation.value = gsap
    .timeline({ paused: true })
    .set('#headerNavigation', { display: 'flex' })
    .to('#headerNavigation', { duration: 1, y: '0%', ease })
    .fromTo(
      '#headerNavigation .rounded__div__up',
      { height: flexHeight },
      { height: '0vh', duration: 1, ease },
      '-=0.9',
    )
    .fromTo(
      '.headerAnimate',
      { y: '-20vh' },
      { y: '0vh', duration: 1, stagger: -0.08, ease },
      '-=1.2',
    );
});

onUnmounted(() => {
  headerAnimation.value?.kill();
});

watch(
  () => menuStore.state.isMenuOpen,
  (isOpen) => {
    if (isOpen) {
      headerAnimation.value?.play();
    } else {
      headerAnimation.value?.reverse();
    }
  }
);
</script>

<template>
  <div id="headerNavigation"
    class="fixed left-0 top-0 z-6000 hidden h-full w-full -translate-y-full flex-col items-center justify-center p-paddingX">
    <Header mode="cross" class="headerAnimate" :color="menuStore.state.color === 'Light' ? 'Dark' : 'Light'" />
    <nav>
      <ul class="mask flex flex-col items-center justify-center px-8 py-[10vh]">
        <li v-for="(data, index) in headerData" :key="data.name" class="headerAnimate">
          <Magentic :class="[
            'text-[clamp(32px,3.3vw+32px,88px)] font-bold drop-shadow-sm',
          ]" :style="{ color: menuStore.state.color === 'Light' ? 'var(--colorDark)' : 'var(--colorLight)' }" :href="data.href" :target="data.target"
            @click="menuStore.toggleMenu({ isMenuOpen: data.target == '_blank' })"
            @mouseenter="scrambleRefs[index]?.triggerScramble()">
            <ScrambleText :ref="(el: any) => { if (el) scrambleRefs[index] = el }" :text="data.name" />
          </Magentic>
        </li>
      </ul>
    </nav>

    <div class="absolute left-0 top-0 -z-40 flex h-full w-full flex-col">
      <div :class="[
        menuStore.state.color === 'Light' ? 'lightGradient' : 'darkGradient',
        'h-full w-full grow'
      ]"></div>
      <div class="rounded__div__up relative! z-50">
        <div :class="[
          'round__bg__up',
          menuStore.state.color === 'Light' ? 'lightGradient' : 'darkGradient'
        ]"></div>
      </div>
    </div>
    <Footer class="headerAnimate bottom-2 z-10 w-full" />
  </div>
</template>
