<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  text: string;
  className?: string;
}>(), {
  className: ''
});

const displayText = ref(props.text);
let interval: ReturnType<typeof setInterval> | null = null;
const scrambleChars = '-x_=+<>?/';

const triggerScramble = () => {
  if (interval) clearInterval(interval);

  let frame = 0;
  const maxFrames = 12; // Controls duration of the scramble

  interval = setInterval(() => {
    frame++;

    const progress = frame / maxFrames;
    if (progress >= 1) {
      if (interval) clearInterval(interval);
      displayText.value = props.text;
      return;
    }

    let scrambled = '';
    const revealCount = Math.floor(props.text.length * progress);

    for (let i = 0; i < props.text.length; i++) {
      if (props.text[i] === ' ') {
        scrambled += ' ';
        continue;
      }
      if (i < revealCount) {
        scrambled += props.text[i];
      } else {
        scrambled += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
    }

    displayText.value = scrambled;
  }, 30); // Speed of each frame
};

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

defineExpose({
  triggerScramble
});
</script>

<template>
  <span :class="className" @mouseenter="triggerScramble">
    {{ displayText }}
  </span>
</template>
