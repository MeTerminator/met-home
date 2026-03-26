<script setup lang="ts">
defineProps<{
  total: number;
  item: {
    id: number;
    imgLink: string;
    title: string;
    subtitle: string;
  };
  index: number;
}>();
</script>

<template>
  <div :style="{
    filter: 'brightness(85%)',
    zIndex: Math.floor(total / 2) === index ? 520 : Math.floor(Math.random() * 10)
  }"
    class="bgImages drop-shadow-smd absolute h-[80px] w-[80px] origin-[center_center] translate-x-[-50%] translate-y-[0%] overflow-visible rounded-3xl md:h-[250px] md:w-[250px]">
    <img :src="item.imgLink" alt="" class="h-full w-auto! min-w-full max-w-none object-cover" />
  </div>
</template>
