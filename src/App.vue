<script setup lang="ts">
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { onMounted } from 'vue';
import GlobalLoading from './components/GlobalLoading.vue';
import Cursor from './components/Cursor.vue';
import HeaderNavigation from './components/HeaderNavigation.vue';
import HeroSection from './components/HeroSection/HeroSection.vue';
import AboutSection from './components/AboutSection/AboutSection.vue';
import ShowSection from './components/ShowSection/ShowSection.vue';
import MusicSection from './components/MusicSection/MusicSection.vue';
import ContactSection from './components/ContactSection/ContactSection.vue';
import ReloadPrompt from './components/ReloadPrompt.vue';

gsap.registerPlugin(CustomEase);

const ANCHORS = ['hero', 'show', 'about', 'music', 'contact'];

const dispatchSectionEvent = (anchor: string, action: 'enter' | 'reset' | 'exit') => {
  window.dispatchEvent(new Event(`section:${anchor}:${action}`));
};


const options = {
  licenseKey: 'gplv3-license',
  autoScrolling: true,
  scrollOverflow: false,
  scrollHorizontally: false,
  navigation: false,
  navigationPosition: 'left',
  scrollingSpeed: 1300,
  easingcss3: 'cubic-bezier(.70,0,.30,1)',
  anchors: ANCHORS,
  lockAnchors: true,
  credits: { enabled: false },
  afterLoad: (origin: any, destination: any, _direction: string) => {
    // 1. Reset the previous section so it's ready for next entry
    if (origin && origin.anchor) {
      dispatchSectionEvent(origin.anchor, 'reset');
    }

    // 2. Staggered entrance: reset current then enter (safety for first load)
    dispatchSectionEvent(destination.anchor, 'reset');
    setTimeout(() => {
      dispatchSectionEvent(destination.anchor, 'enter');
    }, 50);
  },
  onLeave: (origin: any, destination: any, direction: string) => {
    // 1. Dispatch standardized exit animation
    dispatchSectionEvent(origin.anchor, 'exit');

    // 2. Handle Dark/Light theme switching
    const isDark = ['about', 'contact'].includes(destination.anchor);
    document.body.classList.toggle('darkGradient', isDark);

    // 3. Trigger geometric ripple and stagger animations

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

onMounted(() => {
  // 控制台输出
  const styleTitle1 = "font-size: 20px;font-weight: 600;color: rgb(244,167,89);";
  const styleTitle2 = "font-size:12px;color: rgb(244,167,89);";
  const styleContent = "color: rgb(30,152,255);";
  const title1 = "Home of MeTerminator";
  const title2 = `
  __  __   _______                  _             _             
 |  \\/  | |__   __|                (_)           | |            
 | \\  / | ___| | ___ _ __ _ __ ___  _ _ __   __ _| |_ ___  _ __ 
 | |\\/| |/ _ \\ |/ _ \\ '__| '_ \` _ \\| | \'_ \\ / _\` | __/ _ \\| '__|
 | |  | |  __/ |  __/ |  | | | | | | | | | | (_| | || (_) | |   
 |_|  |_|\___|_|\___|_|  |_| |_| |_|_|_| |_|\__,_|\__\___/|_|   

`;
  const content = `\n\n主页: https://www.met6.top:444/\nGitHub: https://github.com/MeTerminator\nQQ号: 3532095196\nEmail: 13290003080@163.com\n`;
  console.info(`%c${title1} %c${title2} %c${content}`, styleTitle1, styleTitle2, styleContent);
});
</script>

<template>
  <GlobalLoading />
  <Cursor />
  <HeaderNavigation />
  <ReloadPrompt />

  <full-page ref="fullpage" :options="options" id="fullpage">
    <HeroSection data-anchor="hero" class="hero" />
    <ShowSection data-anchor="show" class="show" />
    <AboutSection data-anchor="about" class="about" />
    <MusicSection data-anchor="music" class="music" />
    <ContactSection data-anchor="contact" class="contact" />
  </full-page>
</template>

<style>
/* Base imports for tailwind in style.css */
</style>