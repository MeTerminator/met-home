<script setup lang="ts">
import { computed } from 'vue';
import { musicStore } from '../../store/music';

const { state, togglePlay, next, prev, seek } = musicStore;

const currentSong = computed(() => state.playlist[state.currentSongIndex]);

const progress = computed(() => {
    if (state.duration === 0) return 0;
    return (state.currentTime / state.duration) * 100;
});

const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${minutes}:${s.toString().padStart(2, '0')}`;
};

const handleSeek = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const timeMs = (Number(target.value) / 100) * state.duration;
    seek(timeMs);
};
</script>

<template>
    <div v-if="currentSong" class="player-controls flex flex-col items-center gap-6 w-full max-w-md">
        <!-- Cover Art -->
        <div class="relative group">
            <div class="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img :src="currentSong.pic" :alt="currentSong.title" class="w-full h-full object-cover">
            </div>
            <!-- Glow Effect -->
            <div class="absolute inset-0 -z-10 bg-red-500/20 blur-3xl rounded-full scale-110"></div>
        </div>

        <!-- Song Info -->
        <div class="text-center">
            <h2 class="text-3xl font-bold text-white mb-2">{{ currentSong.title }}</h2>
            <p class="text-white/60 text-lg">{{ currentSong.author }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full space-y-2">
            <div class="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <input type="range" :value="progress" @input="handleSeek"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                <div class="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100"
                    :style="{ width: `${progress}%` }"></div>
            </div>
            <div class="flex justify-between text-xs text-white/40 font-medium">
                <span>{{ formatTime(state.currentTime) }}</span>
                <span>{{ formatTime(state.duration) }}</span>
            </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-8">
            <button @click="prev" class="p-3 text-white/60 hover:text-white transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                </svg>
            </button>
            <button @click="togglePlay" 
                class="w-16 h-16 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-xl">
                <svg v-if="!state.isPlaying" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
            </button>
            <button @click="next" class="p-3 text-white/60 hover:text-white transition-colors">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
            </button>
        </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center p-12 text-white/20 italic">
        Select a song to start playing
    </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
}
</style>
