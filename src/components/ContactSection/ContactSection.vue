<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import BorderGlow from '../ui/BorderGlow.vue';
import Magentic from '../ui/Magentic.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import Tilted from '../ui/Tilted.vue';
import { links } from '../../data/data';

const contactLinks = [
    { name: 'QQ Main', iconUrl: '/icon/QQ.svg', url: links.qqMain, color: '#3b82f6' },
    { name: 'QQ Furry', iconUrl: '/icon/QQ.svg', url: links.qqFurry, color: '#3b82f6' },
    { name: 'Email', iconUrl: '/icon/email.svg', url: links.email, color: '#f472b6' },
    { name: 'GitHub', iconUrl: '/icon/github.svg', url: links.github, color: '#ffffff' },
    { name: 'Bilibili', iconUrl: '/icon/bilibili.svg', url: links.bilibili, color: '#fb7299' },
    { name: 'Steam', iconUrl: '/icon/steam.svg', url: links.steam, color: '#ffffff' },
];

const hoverStates = ref<Record<string, boolean>>({});

const dividerRef = useTemplateRef<HTMLDivElement>('dividerRef');
let dividerAnimation: gsap.core.Tween | null = null;

const resetDivider = () => {
    if (!dividerRef.value) return;

    dividerAnimation?.kill();
    gsap.set(dividerRef.value, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
    });
};

const revealDivider = () => {
    if (!dividerRef.value) return;

    dividerAnimation?.kill();
    dividerAnimation = gsap.fromTo(
        dividerRef.value,
        {
            clipPath: 'inset(0 0 100% 0)',
            opacity: 1,
        },
        {
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
            duration: 1.2,
            delay: 0.35,
            ease: 'power3.inOut',
        },
    );
};

onMounted(() => {
    resetDivider();
    window.addEventListener('section:contact:enter', revealDivider);
    window.addEventListener('section:contact:reset', resetDivider);
});

onUnmounted(() => {
    dividerAnimation?.kill();
    window.removeEventListener('section:contact:enter', revealDivider);
    window.removeEventListener('section:contact:reset', resetDivider);
});
</script>

<template>
    <section
        class="section contact-section darkGradient relative w-full h-full overflow-hidden flex flex-col pt-32 pb-20 px-6 lg:px-12">
        <Bulge type="Light" />
        <Header color="Light" />

        <div
            class="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center gap-6 lg:gap-16">

            <!-- Centered Header -->
            <AnimatedContent direction="vertical" :distance="30" sectionAnchor="contact" :delay="0.5">
                <h2 class="text-5xl sm:text-7xl font-black text-white text-center tracking-tight">
                    Contact
                </h2>
            </AnimatedContent>

            <!-- Content Grid: QR cards | divider | contact links -->
            <div
                class="w-full flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] items-center lg:items-stretch justify-center gap-12 lg:gap-10 px-4 lg:px-8">

                <!-- Left Side: QR Contact Cards (Hidden on Mobile) -->
                <div class="hidden lg:flex w-full items-center justify-center gap-8">
                    <!-- WeChat Card -->
                    <AnimatedContent direction="horizontal" :distance="-50" sectionAnchor="contact" :delay="0.1"
                        className="w-full min-w-0 max-w-[280px]">
                        <Tilted width="100%" height="100%" :rotateAmplitude="5" :scale="true"
                            card-class="w-full h-full">
                            <BorderGlow className="p-8 text-center h-full flex flex-col justify-center"
                                glowColor="7 193 96" backgroundColor="rgba(255, 255, 255, 0.03)" :borderRadius="32"
                                :fillOpacity="0.1" :glowIntensity="0.6" :colors="['#07c160', '#06ad56', '#059348']">
                                <div class="flex flex-col items-center gap-4">
                                    <div
                                        class="relative w-full aspect-square p-4 bg-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                                        <!-- QR Image with Filter -->
                                        <img src="/img/contact-wechat.png" alt="WeChat QR"
                                            class="w-full h-full object-contain brightness-0 invert transition-all duration-500 hover:scale-105">
                                    </div>
                                    <div
                                        class="mt-2 text-white/50 text-xs font-black uppercase tracking-[0.2em] transition-colors">
                                        - WeChat -
                                    </div>
                                </div>
                            </BorderGlow>
                        </Tilted>
                    </AnimatedContent>

                    <!-- QQ Card -->
                    <AnimatedContent direction="horizontal" :distance="-50" sectionAnchor="contact" :delay="0.3"
                        className="w-full min-w-0 max-w-[280px]">
                        <Tilted width="100%" height="100%" :rotateAmplitude="5" :scale="true"
                            card-class="w-full h-full">
                            <BorderGlow className="p-8 text-center h-full flex flex-col justify-center"
                                glowColor="59 130 246" backgroundColor="rgba(255, 255, 255, 0.03)" :borderRadius="32"
                                :fillOpacity="0.1" :glowIntensity="0.6" :colors="['#3b82f6', '#2563eb', '#60a5fa']">
                                <div class="flex flex-col items-center gap-4">
                                    <div
                                        class="relative w-full aspect-square p-4 bg-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                                        <!-- QR Image with Filter -->
                                        <img src="/img/contact-qq.png" alt="QQ QR"
                                            class="w-full h-full object-contain brightness-0 invert transition-all duration-500 hover:scale-105">
                                    </div>
                                    <div
                                        class="mt-2 text-white/50 text-xs font-black uppercase tracking-[0.2em] transition-colors">
                                        - QQ Main -
                                    </div>
                                </div>
                            </BorderGlow>
                        </Tilted>
                    </AnimatedContent>
                </div>

                <!-- Desktop Divider -->
                <div ref="dividerRef"
                    class="hidden lg:block w-px h-full min-h-72 bg-gradient-to-b from-transparent via-white/25 to-transparent"
                    style="clip-path: inset(0 0 100% 0); opacity: 0;"
                    aria-hidden="true">
                </div>

                <!-- Right Side: Digital Identity Links -->
                <div class="w-full flex flex-col items-center justify-center gap-8 lg:gap-12">
                    <div class="w-full grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:grid-flow-col gap-4">
                        <AnimatedContent v-for="(link, index) in contactLinks" :key="link.name" direction="vertical"
                            :distance="20" sectionAnchor="contact" :delay="0.6 + (index * 0.1)"
                            className="cursor-target w-full">
                            <Magentic :strength="20" :href="link.url" target="_blank"
                                className="group relative w-full h-20 flex items-center gap-4 px-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                                @mouseenter="hoverStates[link.name] = true"
                                @mouseleave="hoverStates[link.name] = false">

                                <!-- Icon and Color Accent -->
                                <div
                                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                    <img :src="link.iconUrl" :alt="link.name"
                                        class="w-6 h-6 object-contain pointer-events-none" />
                                </div>

                                <div
                                    class="flex-1 flex items-baseline justify-between transition-all duration-300 group-hover:pl-2">
                                    <span class="text-2xl font-bold text-white tracking-tight">{{ link.name }}</span>
                                </div>
                            </Magentic>
                        </AnimatedContent>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes pulse-slow {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }
}

.animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
}
</style>
