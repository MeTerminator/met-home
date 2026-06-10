<script setup lang="ts">
import { musicStore } from '../../store/music';

const props = defineProps<{
    hideFab?: boolean;
}>();

const { state, togglePlaylist, playSong } = musicStore;

const handleSelect = (index: number) => {
    playSong(index);
    togglePlaylist();
};
</script>

<template>
    <div :class="[
        'absolute z-100 flex flex-col gap-4 pointer-events-none transition-all duration-500',
        hideFab ? 'bottom-20 left-1/2 -translate-x-1/2 items-center' : 'bottom-8 right-8 items-end'
    ]">
        <!-- Drawer -->
        <Transition name="slide-up">
            <div v-show="state.isPlaylistOpen"
                class="w-80 max-h-[70vh] bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
                <div
                    class="p-4 border-b border-black/5 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                    <h3 class="font-bold text-black">Playlist</h3>
                    <button @click="togglePlaylist"
                        class="cursor-target text-black/40 hover:text-black transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div v-scroll-chain class="playlist-drawer-scroll overflow-y-auto max-h-[calc(70vh-4rem)] p-2 space-y-1">
                    <button v-for="(song, index) in state.playlist" :key="song.songmid" @click="handleSelect(index)"
                        :class="[
                            'w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left cursor-target',
                            state.currentSongIndex === index ? 'bg-red-600 shadow-lg text-white' : 'text-black/60 hover:bg-black/5 hover:text-black'
                        ]">
                        <div class="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-black/5">
                            <img :src="song.pic" :alt="song.title" class="w-full h-full object-cover" loading="lazy" decoding="async">
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <div class="font-bold truncate text-sm">{{ song.title }}</div>
                            <div class="text-xs opacity-60 truncate">{{ song.author }}</div>
                        </div>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Toggle Button (FAB) -->
        <button v-if="!hideFab" @click="togglePlaylist"
            class="cursor-target w-14 h-14 rounded-full bg-red-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto hover:bg-red-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}
</style>
