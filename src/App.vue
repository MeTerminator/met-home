<script setup lang="ts">
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Cursor from './components/Cursor.vue';
import HeaderNavigation from './components/HeaderNavigation.vue';
import HeroSection from './components/HeroSection/HeroSection.vue';
import AboutSection from './components/AboutSection/AboutSection.vue';
import ShowSection from './components/ShowSection/ShowSection.vue';

gsap.registerPlugin(CustomEase);

const options = {
  licenseKey: 'gplv3-license',
  autoScrolling: true,
  scrollOverflow: false,
  scrollHorizontally: false,
  navigation: false,
  navigationPosition: 'left',
  scrollingSpeed: 1300,
  easingcss3: 'cubic-bezier(.70,0,.30,1)',
  anchors: ['hero', 'about', 'contact'],
  lockAnchors: true,
  credits: { enabled: false },
  afterLoad: (_origin: any, destination: any, _direction: string) => {
    if (destination.anchor === 'about') {
      window.dispatchEvent(new Event('replayContactAnimation'));
    }
    if (destination.anchor === 'hero') {
      // Snap back to hidden state first, then play enter animation
      window.dispatchEvent(new Event('resetHeroAnimation'));
      setTimeout(() => {
        window.dispatchEvent(new Event('replayHeroAnimation'));
      }, 50);
    }
  },
  onLeave: (origin: any, destination: any, direction: string) => {
    // Play exit animation for Hero AnimatedContent elements
    if (origin.anchor === 'hero') {
      window.dispatchEvent(new Event('leaveHeroAnimation'));
    }

    // Patches border that comes when snapping between dark/light
    if (destination.anchor === 'about') {
      document.body.classList.add('darkGradient');
      window.dispatchEvent(new Event('resetContactAnimation'));
    } else {
      document.body.classList.remove('darkGradient');
    }

    const flex = window.innerWidth > 540 ? 17 : 5;
    const ease = CustomEase.create('custom', 'M0,0 C0.52,0.01 0.16,1 1,1');

    if (direction === 'down') {
      gsap.timeline().from(`.${destination.anchor} .rounded__div__down`, { duration: 0.1 })
        .fromTo(`.${destination.anchor} .rounded__div__down`, { height: `${flex}vh` }, { height: '0vh', duration: 1.2, ease });

      gsap.timeline().from(`.${destination.anchor} .anime`, { duration: 0.3 })
        .fromTo(`.${destination.anchor} .anime`, { y: '30vh' }, { y: '0vh', duration: 1.1, stagger: 0.1, ease });
    } else {
      gsap.timeline().from(`.${destination.anchor} .rounded__div__up`, { duration: 0.1 })
        .fromTo(`.${destination.anchor} .rounded__div__up`, { height: `${flex}vh` }, { height: '0vh', duration: 1.2, ease });

      gsap.timeline().from(`.${destination.anchor} .anime`, { duration: 0.3 })
        .fromTo(`.${destination.anchor} .anime`, { y: '-30vh' }, { y: '0vh', duration: 1.1, stagger: -0.08, ease });
    }
  }
};
</script>

<template>
  <Cursor />
  <HeaderNavigation />

  <full-page ref="fullpage" :options="options" id="fullpage">
    <HeroSection data-anchor="hero" class="hero" />
    <ShowSection data-anchor="show" class="show" />
    <AboutSection data-anchor="about" class="about" />
  </full-page>
</template>

<style>
/* Base imports for tailwind in style.css */
</style>