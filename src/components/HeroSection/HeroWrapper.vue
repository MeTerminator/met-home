<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeroMarquee from './HeroMarquee.vue';
import Magentic from '../ui/Magentic.vue';
import HeroButton from './HeroButton.vue';
import ScrambleText from '../ui/ScrambleText.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';

const activeTextRef = ref<HTMLDivElement | null>(null);
const badgeScrambleRef = ref<InstanceType<typeof ScrambleText> | null>(null);

const slogan1 = ["Stay Hungry", "Stay Foolish"];
const slogan2 = ["Dream it", "Chase it", "Code it"];

let scrambleInterval: any = null;
let loopTimeout: any = null;
let isTransitioning = false;

onMounted(() => {
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
  if (scrambleInterval) clearInterval(scrambleInterval);
  if (loopTimeout) clearTimeout(loopTimeout);
});
</script>

<template>
  <main class="section1__wrapper relative grow w-full">
    <!-- Left Side Content -->
    <div class="absolute left-0 top-1/2 -translate-y-2/3 z-20 flex flex-col items-start gap-8">
      <AnimatedContent 
        direction="horizontal" 
        :reverse="true" 
        :distance="150" 
        :delay="0.2"
        triggerEvent="replayHeroAnimation"
        resetEvent="resetHeroAnimation"
        leaveEvent="leaveHeroAnimation"
      >
        <div class="free anime">
          <Magentic :strength="50"
            className="group anime isolate z-20 cursor-default rounded-full text-3xl font-bold relative"
            @mouseenter="badgeScrambleRef?.triggerScramble()">
            <!-- 3D Background Layer -->
            <div
              class="shapka-bg absolute inset-0 rounded-4xl bg-white/10 backdrop-blur-md border border-white/20 transition-colors duration-300 group-hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] -z-10">
            </div>
            <!-- 3D Text Layer -->
            <div class="shapka flex items-center justify-center px-10 py-6">
              <ScrambleText ref="badgeScrambleRef" text="MeTerminator"
                className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
          </Magentic>
        </div>
        <HeroButton />
      </AnimatedContent>
    </div>

    <!-- Right Side Content -->
    <div class="absolute right-0 top-1/2 -translate-y-2/3 z-20 flex flex-col items-end pointer-events-none">
      <AnimatedContent 
        direction="horizontal" 
        :distance="150" 
        :delay="0.35"
        triggerEvent="replayHeroAnimation"
        resetEvent="resetHeroAnimation"
        leaveEvent="leaveHeroAnimation"
      >
        <h2
          class="text-7xl font-bold leading-[1.1] md:leading-none text-right flex flex-col justify-center max-w-full pointer-events-auto">
          <div ref="activeTextRef" class="h-full flex flex-col gap-10 justify-around items-end w-full tracking-tighter">
          </div>
        </h2>
      </AnimatedContent>
    </div>

    <HeroMarquee />
  </main>
</template>
