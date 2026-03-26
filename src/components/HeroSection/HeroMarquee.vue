<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import AnimatedContent from '../ui/AnimatedContent.vue';

onMounted(() => {
  function roll(targets: string, vars: gsap.TweenVars = {}, reverse?: boolean) {
    vars.ease = vars.ease || 'none';
    const elements = gsap.utils.toArray(targets) as HTMLElement[];
    const tl = gsap.timeline({
      repeat: -1,
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 10);
      },
    });

    const clones = elements.map((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      el.parentNode?.appendChild(clone);
      return clone;
    });

    const positionClones = () => {
      elements.forEach((el, i) => {
        gsap.set(clones[i], {
          position: 'absolute',
          overwrite: false,
          top: el.offsetTop,
          left: '100%',
        });
      });
    };

    positionClones();

    elements.forEach((el, i) => {
      tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0);
    });

    const onResize = () => {
      const time = tl.totalTime();
      tl.totalTime(0);
      positionClones();
      tl.totalTime(time);
    };

    window.addEventListener('resize', onResize);

    return { tl, onResize };
  }

  let rollup: any;
  setTimeout(() => {
    rollup = roll('.rollingText', { duration: 15 });
  }, 100);

  onUnmounted(() => {
    gsap.killTweensOf('.rollingText');
    if (rollup) {
      window.removeEventListener('resize', rollup.onResize);
    }
  });
});
</script>

<template>
  <div class="wrapperRollingText anime pointer-events-none z-5 select-none rounded-3xl -tracking-widest">
    <AnimatedContent direction="vertical" :distance="80" :delay="0.5" triggerEvent="replayHeroAnimation"
      resetEvent="resetHeroAnimation" leaveEvent="leaveHeroAnimation">
      <div class="rollingText md:text-[100px]!">
        MeTerminator&nbsp;<span class="text-gray-500">//</span>&nbsp;Dreaming<span
          class="text-blue-500">.</span>&nbsp;<span class="text-gray-500">\\</span>&nbsp;Exploring<span
          class="text-blue-500">.</span>&nbsp;<span class="text-gray-500">//</span>&nbsp;Designing<span
          class="text-blue-500">.</span>&nbsp;<span class="text-gray-500">\\</span>&nbsp;Developing<span
          class="text-blue-500">.</span>&nbsp;<span class="text-gray-500">//</span>&nbsp;Exploiting<span
          class="text-blue-500">.</span>&nbsp;<span class="text-gray-500">\\</span>&nbsp;
      </div>
    </AnimatedContent>
  </div>
</template>

<style scoped>
.wrapperRollingText {
  /* Fades the marquee at the edges and slightly in the center to create depth with ImageSequence */
  mask-image: linear-gradient(90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 15%,
      rgba(0, 0, 0, 0.7) 35%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.7) 65%,
      rgba(0, 0, 0, 1) 85%,
      rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 15%,
      rgba(0, 0, 0, 0.7) 35%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.7) 65%,
      rgba(0, 0, 0, 1) 85%,
      rgba(0, 0, 0, 0) 100%);
}
</style>
