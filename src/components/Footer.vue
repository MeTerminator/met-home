<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import FooterGroup from './FooterGroup.vue';
import { links } from '../data/data';

defineProps<{
  className?: string;
}>();

const currentTime = ref('');
let interval: ReturnType<typeof setInterval>;

const getJoinedDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
};

onMounted(() => {
  currentTime.value = getJoinedDate();
  interval = setInterval(() => {
    currentTime.value = getJoinedDate();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <footer
    :class="['footer__links mb-10 md:mb-2 absolute flex w-full flex-wrap px-paddingX mix-blend-difference', className]">
    <div class="mx-auto flex flex-col md:flex-row w-full max-w-maxWidth gap-6 md:gap-12 items-start md:items-end">
      <div class="flex flex-row gap-8 md:gap-12">
        <FooterGroup title="LOCAL TIME" :links="[{ href: '#', text: currentTime }]" />
        <FooterGroup title="OPEN SOURCE" :isMagnetic="true"
          :links="[{ href: links.sourceCode, target: '_blank', text: 'View on GitHub' }]" />
      </div>

      <FooterGroup title="SOCIALS" class="md:ml-auto" :isMagnetic="true" layout="row" :links="[
        { href: links.qqMain, target: '_blank', text: 'QQ Main' },
        { href: links.qqFurry, target: '_blank', text: 'QQ Furry' },
        { href: links.x, target: '_blank', text: 'X' },
        { href: links.email, target: '_blank', text: 'Email' },
        { href: links.github, target: '_blank', text: 'Github' },
        { href: links.bilibili, target: '_blank', text: 'Bilibili' },
        { href: links.steam, target: '_blank', text: 'Steam' },
      ]" />
    </div>
  </footer>
</template>
