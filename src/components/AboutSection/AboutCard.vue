<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, ref } from 'vue';
import Tilted from '../ui/Tilted.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import BorderGlow from '../ui/BorderGlow.vue';
import { registerScrollChaining } from '../../lib/scrollHelper';

const cardRef = useTemplateRef<HTMLElement>('cardRef');
const isMobile = ref(false);
let cleanupScroll: (() => void) | undefined;

const updateSize = () => {
    isMobile.value = window.innerWidth <= 850;
};

const onAnimComplete = () => {
    cardRef.value?.classList.add('blur-in');
};

const handleReset = () => {
    cardRef.value?.classList.remove('blur-in');
};

const moveNext = () => {
    if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionDown();
    }
};

onMounted(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('section:about:reset', handleReset);
    if (cardRef.value) {
        cleanupScroll = registerScrollChaining(cardRef.value);
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
    window.removeEventListener('section:about:reset', handleReset);
    if (cleanupScroll) {
        cleanupScroll();
    }
});
</script>

<template>
    <Tilted :width="isMobile ? '95%' : '80%'" height="auto" :rotateAmplitude="2"
        card-class="card_tilt w-full max-w-[850px] mx-auto" :scale="!isMobile" :disabled="isMobile">
        <AnimatedContent :distance="50" direction="vertical" :reverse="false" :duration="1.1" ease="power3.out"
            :initial-opacity="0" :animate-opacity="true" :scale="1.1" :threshold="0" :delay="0.1"
            sectionAnchor="about" @complete="onAnimComplete">
            <BorderGlow :edgeSensitivity="30" glowColor="40 80 80" backgroundColor="#06001000" :borderRadius="28"
                :glowRadius="40" :glowIntensity="1" :coneSpread="25" :animated="false"
                :colors="['#c084fc', '#f472b6', '#38bdf8']">
                <div ref="cardRef" class="card relative overflow-hidden flex justify-between mx-auto w-full p-6 md:p-10"
                    style="background-color: rgba(2, 2, 17, 0.65); border-radius: 30px; backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 2.4px 1.9px 3.2px -9px rgba(0, 0, 0, 0.5), 18px 14px 80px -9px rgba(0, 0, 0, 0.3);">

                    <!-- Glowing Background Blob -->
                    <div class="background-glow pointer-events-none absolute rounded-full transition-colors duration-200"
                        style="background: radial-gradient(circle 135px at 250px 250px, rgba(224, 224, 255, 0.5), rgba(0, 0, 0, 0)); mix-blend-mode: overlay;">
                    </div>

                    <!-- Profile Frame -->
                    <div class="avatar transition-all duration-500 w-[40%] bg-cover bg-no-repeat ml-0 my-0 object-contain mr-5"
                        style="background-image: url('/img/met-furry_pendant.webp');">
                    </div>

                    <!-- Content Area -->
                    <div
                        class="infos text-white py-4 w-112.5 max-w-112.5 flex flex-col justify-center gap-4 z-10 relative">

                        <div class="info-item">
                            <div class="info-content">
                                <h1 id="chac-name"
                                    class="font-semibold text-[2.5em] leading-[1.2em] -mt-2 text-center cursor-target">
                                    MeTerminator</h1>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="text-[#e74c3c] font-bold">About Me</div>
                            <div class="info-content text-[min(1.15em,4vw)] leading-[1.8em] mb-2">
                                <p>Full-stack developer & Web Security student. </p>
                                <p>Aiming to ship my ideas as code and focus on the work I'm passionate about.</p>
                                <p>Aspiring CTFer | Always leveling up. </p>
                            </div>


                            <div class="text-[#e74c3c] font-bold">Tech Stack Learing</div>
                            <div class="info-content text-[min(1.15em,4vw)] leading-[1.8em]">
                                <p><span class="tech-label text-[#f1c40f] md:pl-6">Language: </span>
                                    Python,
                                    PHP,
                                    Java,
                                    Kotlin,
                                    JavaScript,
                                    TypeScript,
                                    Golang,
                                    Rust,
                                    Swift,
                                    Dart,
                                    etc.
                                </p>
                                <p><span class="tech-label text-[#f1c40f] md:pl-6">Backend: </span>
                                    Flask,
                                    FastAPI,
                                    Lavarel,
                                    Express.js,
                                    Gin,
                                    Spring Boot,
                                    etc.
                                </p>
                                <p><span class="tech-label text-[#f1c40f] md:pl-6">Frontend: </span>
                                    Vue,
                                    React,
                                    Next.js,
                                    Nuxt.js,
                                    etc.
                                </p>
                            </div>
                        </div>

                        <!-- Mobile Next Page -->
                        <div v-if="isMobile" class="mt-4 w-full">
                            <button class="w-full py-6 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase border-t border-white/5 text-white/30 animate-pulse hover:text-white transition-colors"
                                @click.stop="moveNext">
                                <span>Scroll to Music</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                    </div>

                </div>
            </BorderGlow>
        </AnimatedContent>
    </Tilted>
</template>

<style scoped>
#chac-name {
    background: linear-gradient(90deg, #e74c3c, #f1c40f, #e74c3c, #e74c3c, #f1c40f);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: background-position 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

#chac-name:hover {
    background-position: 40% center;
}

.avatar {
    background-position: center;
    background-size: contain;
}

.avatar:hover {
    filter: drop-shadow(0 0 15px #acbfff80);
    transform: scale(1.02);
}

.card {
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    transition: backdrop-filter 1s ease, -webkit-backdrop-filter 1s ease;
}

.card.blur-in {
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
}

@media (max-width: 850px) {
    .card {
        flex-direction: column !important;
        height: auto !important;
        max-height: 80vh;
        width: 100% !important;
        max-width: 500px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        align-items: center;
        padding: 2.5rem 1.5rem !important;
        gap: 1rem;
    }

    .avatar {
        width: 160px !important;
        height: 160px !important;
        margin-right: 0 !important;
        margin-bottom: 0 !important;
        flex-shrink: 0;
    }

    .infos {
        padding: 0;
        width: 100% !important;
        max-width: none !important;
        text-align: center;
        align-items: center;
    }

    .info-content {
        text-align: left;
        width: 100%;
    }

    .tech-label {
        display: block;
        margin-top: 0.5rem;
    }

    .background-glow {
        display: none;
    }

    .bloglink {
        display: none;
    }
}
</style>
