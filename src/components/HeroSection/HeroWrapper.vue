<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeroMarquee from './HeroMarquee.vue';
import Magentic from '../ui/Magentic.vue';
import HeroButton from './HeroButton.vue';
import ScrambleText from '../ui/ScrambleText.vue';

const activeTextRef = ref<HTMLDivElement | null>(null);
const badgeScrambleRef = ref<InstanceType<typeof ScrambleText> | null>(null);

const slogan1 = ["Stay Hungry", "Stay Foolish"];
const slogan2 = ["Dream it", "Chase it", "Code it"];

let scrambleInterval: any = null;
let loopInterval: any = null;

onMounted(() => {
  if (!activeTextRef.value) return;
  const el = activeTextRef.value;
  let currentIsSlogan1 = true;

  const runTransition = () => {
    const targetLines = currentIsSlogan1 ? slogan2 : slogan1;
    currentIsSlogan1 = !currentIsSlogan1;

    let totalChars = targetLines.reduce((acc, line) => acc + line.length, 0);
    let charsRevealed = 0;

    scrambleInterval = setInterval(() => {
      charsRevealed += 1; // Reveal 1 char per tick
      if (charsRevealed >= totalChars) {
        charsRevealed = totalChars;
        clearInterval(scrambleInterval);
      }

      const scrambleChars = '-x_=+<>?/';
      let charsSoFar = 0;
      let htmlLines = [];

      for (let lineIndex = 0; lineIndex < targetLines.length; lineIndex++) {
        const line = targetLines[lineIndex];
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
    }, 40);
  };

  el.innerHTML = slogan1.map(line => `<div>${line}<span class="text-blue-500">.</span></div>`).join('');

  loopInterval = setInterval(() => {
    runTransition();
  }, 2000);
});

onUnmounted(() => {
  if (scrambleInterval) clearInterval(scrambleInterval);
  if (loopInterval) clearInterval(loopInterval);
});
</script>

<template>
  <main class="section1__wrapper relative grow w-full">
    <!-- Left Side Content -->
    <div class="absolute left-0 top-1/2 -translate-y-2/3 z-20 flex flex-col items-start gap-8">
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
    </div>

    <!-- Right Side Content -->
    <div class="absolute right-0 top-1/2 -translate-y-2/3 z-20 flex flex-col items-end pointer-events-none">
      <h2
        class="text-7xl font-bold leading-[1.1] md:leading-none text-right flex flex-col justify-center max-w-full pointer-events-auto">
        <div ref="activeTextRef" class="h-full flex flex-col gap-10 justify-around items-end w-full tracking-tighter">
        </div>
      </h2>
    </div>

    <HeroMarquee />
  </main>
</template>
