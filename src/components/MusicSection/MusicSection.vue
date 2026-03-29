<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import PlayerControls from './PlayerControls.vue';
import LyricsView from './LyricsView.vue';
import PlaylistDrawer from './PlaylistDrawer.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import { musicStore } from '../../store/music';

const { fetchSongs, togglePlaylist } = musicStore;
const isLyricsVisible = ref(false);
const isMobile = ref(false);

const updateSize = () => {
    isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
    fetchSongs();
    updateSize();
    window.addEventListener('resize', updateSize);
});
</script>

<template>
    <section
        class="section music-section relative w-full h-full min-h-screen bg-white overflow-hidden flex flex-col pt-24 pb-12 px-6 lg:px-12">
        <Bulge type="Dark" />
        <Header color="Dark" />

        <div class="relative z-10 w-full flex flex-col items-center pt-1">
            <h1 class="text-xs md:text-2xl font-black tracking-[0.4em] text-black/20 uppercase">
                - Favorite Music -
            </h1>
        </div>

        <div class="relative z-10 flex-1 w-full max-w-7xl mx-auto flex items-center justify-center">
            <AnimatedContent direction="vertical" :distance="50" sectionAnchor="music" transition="all 0.8s ease"
                class="w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-24">
                <!-- Left Side: Player Controls -->
                <div class="w-full lg:w-1/2 flex flex-col items-center gap-8"
                    :class="{ 'hidden lg:flex': isLyricsVisible }">
                    <PlayerControls :is-mobile="isMobile" />
                    
                    <!-- Mobile Control Row (Active Player) -->
                    <div v-if="isMobile" class="flex items-center gap-4 w-full justify-center px-6">
                        <button @click="isLyricsVisible = true"
                            class="flex-1 h-14 bg-black text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs font-bold border border-white/10 uppercase">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span>Lyrics</span>
                        </button>
                        <button @click="togglePlaylist"
                            class="flex-1 h-14 bg-red-600 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs font-bold border border-white/10 uppercase">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span>Playlist</span>
                        </button>
                    </div>
                </div>

                <!-- Right Side: Lyrics -->
                <div class="w-full lg:w-1/2 h-full flex flex-col items-center gap-8"
                    :class="{ 'hidden lg:flex': !isLyricsVisible }">
                    <div class="flex-1 w-full flex items-center text-black">
                        <LyricsView />
                    </div>
                    
                    <!-- Mobile Control Row (Active Lyrics) -->
                    <div v-if="isMobile" class="flex items-center gap-4 w-full justify-center px-6 pb-8">
                        <button @click="isLyricsVisible = false"
                            class="flex-1 h-14 bg-black text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs font-bold border border-white/10 uppercase">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Player</span>
                        </button>
                        <button @click="togglePlaylist"
                            class="flex-1 h-14 bg-red-600 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs font-bold border border-white/10 uppercase">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span>Playlist</span>
                        </button>
                    </div>
                </div>
            </AnimatedContent>
        </div>



        <!-- Background Elements -->
        <div class="absolute inset-0 z-0 opacity-40">
            <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full">
            </div>
        </div>

        <!-- Floating Playlist (Handled Inlets In Mobile) -->
        <PlaylistDrawer :hide-fab="isMobile" />
    </section>
</template>

<style scoped>
.music-section {
    background-color: white;
}

@media (max-width: 1024px) {
    .music-section {
        overflow-y: auto !important;
        height: auto !important;
        min-height: 100vh;
    }
}
</style>
