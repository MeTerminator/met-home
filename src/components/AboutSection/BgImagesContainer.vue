<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import BgImage from './BgImage.vue';
import { getRandValues, shuffle } from '../../lib/utils';

gsap.registerPlugin(CustomEase);

const props = defineProps<{
  bgImagesSharedRef: { current: gsap.core.Tween | null };
}>();

const bgImagesDataRaw = [
  { id: 1, imgLink: "/tech-logo/dart.svg" },
  { id: 2, imgLink: "/tech-logo/flutter.svg" },
  { id: 3, imgLink: "/tech-logo/kotlin-icon.svg" },
  { id: 4, imgLink: "/tech-logo/nextjs.svg" },
  { id: 5, imgLink: "/tech-logo/intellij-idea.svg" },
  { id: 6, imgLink: "/tech-logo/java.svg" },
  { id: 7, imgLink: "/tech-logo/javascript.svg" },
  { id: 8, imgLink: "/tech-logo/php.svg" },
  { id: 9, imgLink: "/tech-logo/react.svg" },
  { id: 10, imgLink: "/tech-logo/swift.svg" },
  { id: 11, imgLink: "/tech-logo/tailwind.svg" },
  { id: 12, imgLink: "/tech-logo/typescript.svg" },
  { id: 13, imgLink: "/tech-logo/visual-studio-code.svg" },
  { id: 14, imgLink: "/tech-logo/vue.svg" },
  { id: 15, imgLink: "/tech-logo/python.svg" },
  { id: 16, imgLink: "/tech-logo/yakitlogo.png" },
].map(item => ({ ...item, title: '', subtitle: '' }));

const bgImagesData = shuffle([...bgImagesDataRaw]);

function getRandDistrubutedTop(index: number, totalLen: number) {
  const mid = Math.floor(totalLen / 2);
  if (index === 0) return 65;
  if (index === totalLen - 1) return 35;
  if (index === mid) return 50;
  if (index < mid) return getRandValues(30, 60);
  if (index > mid) return getRandValues(40, 70);
  return getRandValues(30, 70);
}

const bgImagesTween = ref<gsap.core.Tween | null>(null);
const GAP = 6;

const replayAnimation = () => {
  bgImagesTween.value?.restart();
};

const resetAnimation = () => {
  bgImagesTween.value?.progress(0).pause();
};

onMounted(async () => {
  await nextTick();
  bgImagesTween.value = gsap.fromTo(
    ".bgImages",
    {
      y: "200%",
      x: "0%",
      left: "50%",
      rotate: 0,
      top: "50%",
    },
    {
      y: "-50%",
      x: "0%",
      left: (index: number) => {
        return 90 + index * -GAP + "%";
      },
      top: (index: number, _target: any, targets: any[]) => {
        return getRandDistrubutedTop(index, targets.length) + "%";
      },
      rotate: () => {
        return getRandValues(-30, 30);
      },
      delay: 0,
      stagger: 0.08,
      duration: 1,
      paused: true,
      ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
    }
  );

  props.bgImagesSharedRef.current = gsap.fromTo(
    ".footer__img_wrapper",
    {
      minWidth: "100%",
      minHeight: "100%",
    },
    {
      minWidth: "110%",
      minHeight: "150%",
      paused: true,
      delay: 0.1,
      duration: 0.6,
      ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
    }
  );

  window.addEventListener('section:about:enter', replayAnimation);
  window.addEventListener('section:about:reset', resetAnimation);
});

onUnmounted(() => {
  window.removeEventListener('section:about:enter', replayAnimation);
  window.removeEventListener('section:about:reset', resetAnimation);
  bgImagesTween.value?.kill();
  if (props.bgImagesSharedRef.current) {
    props.bgImagesSharedRef.current.kill();
  }
});
</script>

<template>
  <div
    class="footer__img_wrapper bg-transparent-foreground absolute! flex h-full w-full items-center justify-center overflow-visible">
    <BgImage v-for="(item, i) in bgImagesData" :key="item.id" :total="bgImagesData.length" :item="item" :index="i" />
  </div>
</template>
