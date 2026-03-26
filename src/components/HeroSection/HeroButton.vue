<script setup lang="ts">
import { ref } from 'vue';
import Magentic from '../ui/Magentic.vue';
import ScrambleText from '../ui/ScrambleText.vue';
import { links } from '../../data/data';

const baseTextRef = ref<InstanceType<typeof ScrambleText> | null>(null);
const hoverTextRef = ref<InstanceType<typeof ScrambleText> | null>(null);
</script>

<template>
  <div class="anime mt-4">
    <Magentic :strength="30" :href="links.blog" target="_blank"
      className="group relative isolate z-20 flex items-center justify-center px-8 py-3 rounded-full border-2 border-red-600 font-extrabold text-lg overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      @mouseenter="baseTextRef?.triggerScramble(); hoverTextRef?.triggerScramble()">

      <!-- Background File: Left to Right Red Fill -->
      <div
        class="absolute inset-0 bg-red-600 origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover:scale-x-100 -z-10">
      </div>

      <!-- Default Text & Arrow (Red) -->
      <div class="flex items-center gap-2 text-red-600 transition-colors duration-500">
        <ScrambleText ref="baseTextRef" text="Visit Blog" className="whitespace-nowrap" />
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19L19 5M19 5H8M19 5V16" />
        </svg>
      </div>

      <!-- Hover Text & Arrow (White), revealed Right to Left -->
      <div
        class="absolute inset-0 flex items-center justify-center gap-2 text-(--colorWhite) pointer-events-none transition-[clip-path] duration-500 ease-in-out [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)] z-10">
        <ScrambleText ref="hoverTextRef" text="Visit Blog" className="whitespace-nowrap" />
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19L19 5M19 5H8M19 5V16" />
        </svg>
      </div>

    </Magentic>
  </div>
</template>
