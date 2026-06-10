<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeroMarquee from './HeroMarquee.vue';
import Magentic from '../ui/Magentic.vue';
import HeroButton from './HeroButton.vue';
import ScrambleText from '../ui/ScrambleText.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import MagicRings from '../ui/MagicRings.vue';

const activeTextRef = ref<HTMLDivElement | null>(null);
const badgeScrambleRef = ref<InstanceType<typeof ScrambleText> | null>(null);
const isMobile = ref(typeof window !== 'undefined' && window.innerWidth <= 768);

const updateSize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const slogan1 = ["Stay Hungry", "Stay Foolish"];
const slogan2 = ["Dream it", "Chase it", "Code it"];

let scrambleInterval: any = null;
let loopTimeout: any = null;
let isTransitioning = false;

onMounted(() => {
  updateSize();
  window.addEventListener('resize', updateSize);

  if (!activeTextRef.value) return;
  const el = activeTextRef.value;
  let currentIsSlogan1 = true;

  const renderLines = (lines: string[], charsRevealed: number) => {
    const scrambleChars = '-x_=+<>?/';
    let charsSoFar = 0;
    const htmlLines: string[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      let lineOut = '';
      let lineStarted = false;

      for (let i = 0; i < line.length; i++) {
        if (charsSoFar < Math.floor(charsRevealed)) {
          lineOut += line[i];
          lineStarted = true;
        } else if (charsSoFar === Math.floor(charsRevealed)) {
          lineOut += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          lineStarted = true;
        }
        charsSoFar++;
      }

      const lineEndCharIndex = charsSoFar;
      if (lineStarted) {
        if (charsRevealed >= lineEndCharIndex) {
          htmlLines.push(`<div>${lineOut}<span class="text-blue-500">.</span></div>`);
        } else {
          htmlLines.push(`<div>${lineOut}</div>`);
        }
      } else {
        htmlLines.push(`<div class="opacity-0">${line}</div>`);
      }
    }

    el.innerHTML = htmlLines.join('');
  };

  const runTransition = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    const targetLines = currentIsSlogan1 ? slogan2 : slogan1;
    currentIsSlogan1 = !currentIsSlogan1;
    const totalChars = targetLines.reduce((acc, line) => acc + line.length, 0);
    let charsRevealed = 0;

    // Clear any previous scramble interval
    if (scrambleInterval) clearInterval(scrambleInterval);

    scrambleInterval = setInterval(() => {
      charsRevealed += 1;
      if (charsRevealed >= totalChars) {
        charsRevealed = totalChars;
        clearInterval(scrambleInterval);
        scrambleInterval = null;
        isTransitioning = false;
        // Schedule next transition after a pause
        loopTimeout = setTimeout(runTransition, 2500);
      }
      renderLines(targetLines, charsRevealed);
    }, 40);
  };

  el.innerHTML = slogan1.map(line => `<div>${line}<span class="text-blue-500">.</span></div>`).join('');

  // Start the first transition after initial display delay
  loopTimeout = setTimeout(runTransition, 2500);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
  if (scrambleInterval) clearInterval(scrambleInterval);
  if (loopTimeout) clearTimeout(loopTimeout);
});
</script>

<template>
  <!-- MagicRings background -->
  <div class="absolute inset-0 z-0 pointer-events-none">
    <MagicRings color="#2600ff" colorTwo="#ff0000" :ringCount="10" :speed="1" :attenuation="10" :lineThickness="2"
      :baseRadius="0.35" :radiusStep="0.1" :scaleRate="0.1" :opacity="1" :blur="0" :noiseAmount="0.1" :rotation="0"
      :ringGap="1" :fadeIn="0.7" :fadeOut="0.5" :mouseInfluence="0.2" :hoverScale="1.2" :parallax="0.05"
      :followMouse="false" :clickBurst="false" />
  </div>
  <main class="section1__wrapper relative grow w-full">
    <!-- Left Side Content (Badge & Button) -->
    <div
      class="absolute left-0 right-0 bottom-[10%] md:bottom-auto md:left-0 md:right-auto md:top-1/2 md:-translate-y-2/3 z-30 flex flex-col items-center md:items-start gap-6 md:gap-8 px-6">
      <AnimatedContent :direction="isMobile ? 'vertical' : 'horizontal'" :reverse="true" :distance="80" :delay="0.2"
        className="flex flex-col items-center md:items-start w-full md:w-fit" sectionAnchor="hero">
        <div class="free anime flex flex-col items-center md:items-start gap-6 md:gap-8">
          <Magentic :strength="50"
            className="group anime isolate z-20 cursor-default rounded-full text-2xl md:text-3xl font-bold relative"
            @mouseenter="badgeScrambleRef?.triggerScramble()">
            <!-- 3D Background Layer -->
            <div
              class="shapka-bg absolute inset-0 rounded-4xl bg-white/10 backdrop-blur-md border border-white/20 transition-colors duration-300 group-hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] -z-10">
            </div>
            <!-- 3D Text Layer -->
            <div class="shapka flex items-center justify-center px-8 md:px-10 py-4 md:py-6">
              <ScrambleText ref="badgeScrambleRef" text="MeTerminator"
                className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
          </Magentic>
          <HeroButton />
        </div>
      </AnimatedContent>
    </div>

    <!-- Right Side Content (Slogan Text) -->
    <div
      class="absolute left-0 right-0 top-[16%] md:top-1/2 md:left-auto md:right-0 md:-translate-y-2/3 z-20 flex flex-col items-center md:items-end px-6 pointer-events-none">
      <AnimatedContent :direction="isMobile ? 'vertical' : 'horizontal'" :distance="80" :delay="0.35"
        className="flex flex-col items-center md:items-end w-full md:w-fit" sectionAnchor="hero">
        <h2
          class="text-3xl sm:text-4xl md:text-7xl font-bold leading-[1.1] md:leading-none text-center md:text-right flex flex-col justify-center max-w-full pointer-events-auto">
          <div ref="activeTextRef"
            class="h-full flex flex-row flex-wrap md:flex-col gap-x-4 gap-y-2 md:gap-10 justify-center md:justify-around items-center md:items-end w-full tracking-tighter">
          </div>
        </h2>
      </AnimatedContent>
    </div>

    <HeroMarquee />
  </main>
</template>
