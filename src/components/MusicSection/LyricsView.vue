<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { LyricPlayer } from "@applemusic-like-lyrics/vue";
import { musicStore } from '../../store/music';
import { registerScrollChaining } from '../../lib/scrollHelper';
import "@applemusic-like-lyrics/core/style.css";

const { state, seek: seekStore } = musicStore;

// No unused refs
const lyricsContainerRef = ref<HTMLElement | null>(null);
let cleanupScroll: (() => void) | undefined;

onMounted(() => {
    if (lyricsContainerRef.value) {
        cleanupScroll = registerScrollChaining(lyricsContainerRef.value);
    }
});

onUnmounted(() => {
    if (cleanupScroll) {
        cleanupScroll();
    }
});

const lyricPlayerStyles = computed(() => ({
    '--amll-lp-font-size': '2rem',
    '--amll-lp-color': 'rgba(0, 0, 0, 0.95)',
    'font-family': 'Inter, system-ui, sans-serif',
    'font-weight': '700',
}));

// Clean lyrics data for AMLL to avoid cloning issues with Vue proxies
const amLyricsData = computed(() => {
    if (!state.lyrics || state.lyrics.length === 0) return [];
    // Deep clone to provide a "clean" non-reactive object to the library
    return JSON.parse(JSON.stringify(state.lyrics));
});

const handleLineClick = (line: any) => {
    const startTime = line?.line?.lyricLine?.startTime;
    if (startTime !== undefined) {
        seekStore(startTime);
    }
};
</script>

<template>
    <div ref="lyricsContainerRef" class="lyrics-container w-full h-[75vh] md:h-[640px] relative overflow-hidden">
        <div v-if="state.isLoadingLyrics"
            class="absolute inset-0 flex items-center justify-center text-black/20 italic text-xl">
            Loading lyrics...
        </div>
        <div v-else-if="amLyricsData.length > 0" class="w-full h-full">
            <LyricPlayer :lyric-lines="amLyricsData" :current-time="state.currentTime"
                :playing="state.isPlaying" :enableSpring="true" :enableScale="true" :alignPosition="0.25"
                :enableBlur="true" :style="lyricPlayerStyles" class="am-lyric" @line-click="handleLineClick" />
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center text-black/20 italic text-xl">
            No lyrics found
        </div>
    </div>
</template>

<style scoped>
.lyrics-container {
    mask-image: linear-gradient(to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%);
}

:deep(.am-lyric) {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
</style>
