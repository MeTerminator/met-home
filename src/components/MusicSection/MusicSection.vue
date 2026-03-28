<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import PlayerControls from './PlayerControls.vue';
import LyricsView from './LyricsView.vue';
import PlaylistDrawer from './PlaylistDrawer.vue';
import { musicStore } from '../../store/music';

const { fetchSongs } = musicStore;

onMounted(() => {
    fetchSongs();
});
</script>

<template>
    <section
        class="section music-section relative w-full h-full min-h-screen bg-white overflow-hidden flex flex-col pt-24 pb-12 px-6 lg:px-12">
        <Bulge type="Dark" />
        <Header color="Dark" />

        <div
            class="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <!-- Left Side: Player Controls -->
            <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <PlayerControls />
            </div>

            <!-- Right Side: Lyrics -->
            <div class="w-full lg:w-1/2 h-full flex items-center text-black">
                <LyricsView />
            </div>
        </div>

        <!-- Background Elements -->
        <div class="absolute inset-0 z-0 opacity-40">
            <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full">
            </div>
        </div>

        <!-- Floating Playlist -->
        <PlaylistDrawer />
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
