<script setup lang="ts">
import { computed } from 'vue';
import { musicStore } from '../../store/music';
import Tilted from "../ui/Tilted.vue";

defineProps<{
    isMobile: boolean;
}>();

const { state, togglePlay, next, prev, seek, setVolume, togglePlaybackMode } = musicStore;

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
const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setVolume(Number(target.value));
};
</script>

<template>
    <div v-if="currentSong" class="player-controls flex flex-col items-center gap-6 w-full max-w-md">
        <!-- Cover Art -->
        <div class="relative group">
            <Tilted width="24rem" height="24rem" :rotateAmplitude="15" cardClass="rounded-2xl shadow-2xl" :scale="true" :disabled="isMobile">
                <div class="w-full h-full relative z-10 overflow-hidden bg-black/5 rounded-2xl">
                    <Transition name="cover-fade" mode="out-in">
                        <img 
                            :key="currentSong.pic" 
                            :src="currentSong.pic" 
                            :alt="currentSong.title" 
                            class="w-full h-full object-cover rounded-2xl"
                            loading="lazy"
                            decoding="async"
                            @load="(e) => (e.target as HTMLImageElement).classList.add('loaded')"
                        >
                    </Transition>
                    <!-- Loading Placeholder -->
                    <div class="absolute inset-0 flex items-center justify-center -z-10 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse">
                        <svg class="w-12 h-12 text-black/5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                        </svg>
                    </div>
                </div>
            </Tilted>
            <!-- Dynamic Glow Effect -->
            <Transition name="glow-fade">
                <div :key="currentSong.pic" class="absolute inset-0 -z-10 bg-red-500/10 blur-3xl rounded-full scale-110"></div>
            </Transition>
        </div>

        <!-- Song Info -->
        <div class="text-center">
            <h2 class="text-3xl font-bold text-black mb-2">{{ currentSong.title }}</h2>
            <p class="text-black/60 text-lg">{{ currentSong.author }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full space-y-2">
            <div class="relative w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                <input type="range" :value="progress" @input="handleSeek"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                <div class="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100"
                    :style="{ width: `${progress}%` }"></div>
            </div>
            <div class="flex justify-between text-xs text-black/40 font-medium">
                <span>{{ formatTime(state.currentTime) }}</span>
                <span>{{ formatTime(state.duration) }}</span>
            </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-6">
            <!-- Playback Mode -->
            <button @click="togglePlaybackMode"
                class="cursor-target p-2 text-black/40 hover:text-black transition-colors"
                :title="state.playbackMode === 'sequential' ? 'Sequential' : 'Shuffle'">
                <svg v-if="state.playbackMode === 'sequential'" class="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </button>

            <div class="flex items-center gap-4">
                <button @click="prev" class="cursor-target p-2 text-black/60 hover:text-black transition-colors">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                    </svg>
                </button>
                <button @click="togglePlay"
                    class="cursor-target w-16 h-16 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 active:scale-95 transition-all shadow-xl">
                    <svg v-if="!state.isPlaying" class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                </button>
                <button @click="next" class="cursor-target p-2 text-black/60 hover:text-black transition-colors">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                </button>
            </div>

            <!-- Volume Control -->
            <div class="cursor-target flex items-center gap-2 group/volume relative">
                <svg class="w-5 h-5 text-black/40 group-hover/volume:text-black transition-colors" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <div class="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300 ease-out">
                    <input type="range" min="0" max="1" step="0.01" :value="state.volume" @input="handleVolumeChange"
                        class="w-24 h-1 bg-black/10 rounded-full appearance-none cursor-pointer accent-black">
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center p-12 text-black/20 italic">
        Select a song to start playing
    </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: black;
    border-radius: 50%;
    cursor: pointer;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.cover-fade-enter-from {
    opacity: 0;
    transform: scale(1.1);
}

.cover-fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.glow-fade-enter-active,
.glow-fade-leave-active {
    transition: opacity 1s ease;
}

.glow-fade-enter-from,
.glow-fade-leave-to {
    opacity: 0;
}
</style>
