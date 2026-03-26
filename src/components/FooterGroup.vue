<script setup lang="ts">
import Magentic from './ui/Magentic.vue';

withDefaults(defineProps<{
  title: string;
  links: { href: string; target?: string; text: string }[];
  isMagnetic?: boolean;
  className?: string;
  layout?: 'col' | 'row';
}>(), {
  isMagnetic: false,
  layout: 'col',
});
</script>

<template>
  <div :class="['flex flex-col', className]">
    <h3 class="mb-1 text-xs text-[#a3a3a3]">{{ title }}</h3>
    <ul :class="['flex gap-4', layout === 'row' ? 'flex-row' : 'flex-col']">
      <li v-for="(link, index) in links" :key="index">
        <template v-if="isMagnetic">
          <Magentic :href="link.href" :target="link.target" class="w-fit" hoverUnderline>
            {{ link.text }}
          </Magentic>
        </template>
        <template v-else>
          <a :href="link.href" class="flex w-fit items-center relative hover:text-white transition-colors">
            {{ link.text }}
          </a>
        </template>
      </li>
    </ul>
  </div>
</template>
