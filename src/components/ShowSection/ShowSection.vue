<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import Tilted from '../ui/Tilted.vue';
import BorderGlow from '../ui/BorderGlow.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import Magentic from '../ui/Magentic.vue';
import ScrambleText from '../ui/ScrambleText.vue';
import { links } from '../../data/data';

const baseTextRef = ref<InstanceType<typeof ScrambleText> | null>(null);
const hoverTextRef = ref<InstanceType<typeof ScrambleText> | null>(null);

// false = main side active (card on right 70%)
// true  = furry side active (card on left 30%)
const isFurry = ref(false);
let isAnimating = false;

// Desktop refs
const leftImgRef = ref<HTMLElement | null>(null);
const rightImgRef = ref<HTMLElement | null>(null);

// Mobile refs (internal to card)
const leftImgMobileRef = ref<HTMLElement | null>(null);
const rightImgMobileRef = ref<HTMLElement | null>(null);

const cardWrapperRef = ref<HTMLElement | null>(null);

const isPortrait = ref(false);
const showCardBlur = ref(false);

const updatePortraitStatus = () => {
    isPortrait.value = window.innerWidth <= 768;
};

const onEntranceComplete = () => {
    // Entrance pulse or other logic can go here
};

const onMouseEnter = () => {
    showCardBlur.value = true;
};

const onMouseLeave = () => {
    showCardBlur.value = false;
};

const resetBlur = () => {
    showCardBlur.value = false;
};

onMounted(() => {
    updatePortraitStatus();
    window.addEventListener('resize', updatePortraitStatus);
    window.addEventListener('section:show:reset', resetBlur);

    // Initial state: Show Main Image
    // Desktop
    if (leftImgRef.value) gsap.set(leftImgRef.value, { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', opacity: 1, zIndex: 2 });
    if (rightImgRef.value) gsap.set(rightImgRef.value, { clipPath: 'inset(0% 0% 0% 100%)', webkitClipPath: 'inset(0% 0% 0% 100%)', opacity: 0, zIndex: 1 });
    // Mobile
    if (leftImgMobileRef.value) gsap.set(leftImgMobileRef.value, { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', opacity: 1, zIndex: 2 });
    if (rightImgMobileRef.value) gsap.set(rightImgMobileRef.value, { clipPath: 'inset(0% 0% 0% 100%)', webkitClipPath: 'inset(0% 0% 0% 100%)', opacity: 0, zIndex: 1 });
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePortraitStatus);
    window.removeEventListener('section:show:reset', resetBlur);
});

async function toggle() {
    if (isAnimating) return;
    isAnimating = true;

    const enteringFurry = !isFurry.value;
    const cardWrapper = cardWrapperRef.value;

    const dMainImg = leftImgRef.value;
    const dFurryImg = rightImgRef.value;
    const mMainImg = leftImgMobileRef.value;
    const mFurryImg = rightImgMobileRef.value;

    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
        }
    });

    if (isPortrait.value) {
        // --- Mobile Optimized Logic ---
        // 1. Fade the text content only
        tl.to('.show-card__text-content, .show-card__label, .show-card__btn-toggle span', {
            opacity: 0,
            duration: 0.25,
            ease: 'sine.inOut'
        });

        // 2. Wipe the mobile illustration simultaneously
        if (enteringFurry) {
            // Reveal Furry from Left
            gsap.set(mMainImg, { zIndex: 1 });
            tl.fromTo(mFurryImg,
                { clipPath: 'inset(0% 100% 0% 0%)', webkitClipPath: 'inset(0% 100% 0% 0%)', opacity: 1, zIndex: 5 },
                { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
                0.1 // Start slightly after text fade begins
            );
        } else {
            // Reveal Main from Right
            gsap.set(mFurryImg, { zIndex: 1 });
            tl.fromTo(mMainImg,
                { clipPath: 'inset(0% 0% 0% 100%)', webkitClipPath: 'inset(0% 0% 0% 100%)', opacity: 1, zIndex: 5 },
                { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
                0.1
            );
        }

        tl.call(() => { isFurry.value = enteringFurry; }, [], 0.4);

        tl.to('.show-card__text-content, .show-card__label, .show-card__btn-toggle span', {
            opacity: 1,
            duration: 0.35,
            ease: 'sine.out'
        }, '>-0.2');

    } else {
        // --- Desktop Logic (Remains high performance) ---
        if (enteringFurry) {
            gsap.set(dMainImg, { zIndex: 1 });
            tl.fromTo(dFurryImg,
                { clipPath: 'inset(0% 100% 0% 0%)', webkitClipPath: 'inset(0% 100% 0% 0%)', opacity: 1, zIndex: 5 },
                { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }
            );
            tl.to(cardWrapper, { left: '30%', duration: 1.2, ease: 'expo.inOut' }, 0);
        } else {
            gsap.set(dFurryImg, { zIndex: 1 });
            tl.fromTo(dMainImg,
                { clipPath: 'inset(0% 0% 0% 100%)', webkitClipPath: 'inset(0% 0% 0% 100%)', opacity: 1, zIndex: 5 },
                { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }
            );
            tl.to(cardWrapper, { left: '70%', duration: 1.2, ease: 'expo.inOut' }, 0);
        }
        tl.call(() => { isFurry.value = enteringFurry; }, [], 0.6);
    }
}

const moveNext = () => {
    if ((window as any).fullpage_api) {
        (window as any).fullpage_api.moveSectionDown();
    }
};
</script>

<template>
    <section
        class="section music-section relative w-full h-full min-h-screen bg-white overflow-hidden flex flex-col pt-24 pb-12 px-6 lg:px-12"
        :style="{ paddingInline: '0 !important' }">
        <Bulge type="Dark" />
        <Header color="Dark" />

        <div class="show-content-container">
            <!-- ── Background Images (Desktop Only Viewport) ── -->
            <div class="show-bg-viewport" v-if="!isPortrait">
                <div ref="leftImgRef" class="show-bg-panel show-bg--main">
                    <img src="/img/met-main-bg.webp" alt="" draggable="false" />
                </div>
                <div ref="rightImgRef" class="show-bg-panel show-bg--furry">
                    <img src="/img/met-furry-bg.webp" alt="" draggable="false" />
                </div>
            </div>

            <!-- ── Floating Card ── -->
            <div ref="cardWrapperRef" class="show-card-wrapper" :class="isFurry ? 'is-left' : 'is-right'">
                <AnimatedContent direction="vertical" :distance="80" sectionAnchor="show"
                    @complete="onEntranceComplete">
                    <Tilted :width="isPortrait ? '100%' : '450px'" height="80%" :rotateAmplitude="10" :scale="true"
                        :disabled="isPortrait" cardClass="h-full">
                        <BorderGlow :class="[
                            'relative flex flex-col transition-all duration-1000 ease-in-out md:rounded-[32px] overflow-hidden',
                            // Desktop Styles
                            'md:w-[450px] md:pt-12 md:px-10 md:pb-10 md:gap-6 md:border md:border-white/10 md:shadow-[0_12px_60px_rgba(0,0,0,0.2)] md:text-white',
                            // Mobile Styles
                            'max-md:w-full max-md:pt-0 max-md:pb-8 max-md:px-8 max-md:bg-white max-md:text-black max-md:border-none max-md:shadow-none max-md:rounded-none',
                            !isPortrait && showCardBlur ? 'backdrop-blur-[32px]' : 'backdrop-blur-none'
                        ]" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
                            :background-color="isPortrait ? 'white' : 'rgba(0,0,0,0.3)'"
                            :border-radius="isPortrait ? 0 : 32" glow-color="255 255 255" :glow-intensity="0.8"
                            :colors="['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.2)']"
                            :fill-opacity="isPortrait ? 0 : 0.15" :cone-spread="20">

                            <div ref="cardBodyRef" class="show-card__body">
                                <!-- Mobile Only: Illustration container inside card (Stacked for Performance) -->
                                <div v-if="isPortrait" class="show-card__mobile-viewport">
                                    <div
                                        class="relative w-full h-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
                                        <div ref="leftImgMobileRef"
                                            class="absolute inset-0 w-full h-full overflow-hidden">
                                            <img src="/img/met-main-bg.webp" alt="" class="w-full h-full object-cover">
                                        </div>
                                        <div ref="rightImgMobileRef"
                                            class="absolute inset-0 w-full h-full overflow-hidden">
                                            <img src="/img/met-furry-bg.webp" alt="" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                </div>

                                <p class="show-card__label shrink-0">{{ isFurry ? '— Furry Set -' : '— Main Set -' }}
                                </p>

                                <div class="show-card__text-content flex-1 overflow-y-auto">
                                    <div v-show="!isFurry" class="show-card__description">
                                        Hi, my friend. I am <span class="font-bold">MeTerminator</span>, a versatile
                                        full-stack developer and cybersecurity architect dedicated to crafting
                                        sophisticated digital ecosystems. My expertise spans the horizon of modern
                                        development, from building robust web architectures with <span
                                            class="font-bold">Next.js</span> and <span class="font-bold">React</span> to
                                        engineering high-performance mobile experiences through <span
                                            class="font-bold">Swift</span> and <span class="font-bold">Flutter</span>.
                                    </div>

                                    <div v-show="isFurry" class="show-card__description">
                                        Beyond the frontend, I specialize in architecting scalable backends using <span
                                            class="font-bold">Python</span>, <span class="font-bold">Flask</span>, and
                                        <span class="font-bold">FastAPI</span>. I immerse myself in the intricate world
                                        of <span class="font-bold">CTF competitions</span>, focusing on vulnerability
                                        research and binary exploitation. Whether optimizing <span
                                            class="font-bold">Linux infrastructure</span> or hardening server-side
                                        logic, my work is driven by a singular pursuit: the seamless synthesis of
                                        impenetrable security and elegant, cross-platform functionality.
                                    </div>
                                </div>

                                <div class="mt-auto flex flex-col gap-4 shrink-0">
                                    <Magentic :strength="20" :href="links.ocpic" target="_blank"
                                        className="group relative isolate z-20 flex items-center justify-center px-8 py-3 rounded-full border-2 border-red-600 font-extrabold text-sm overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 active:scale-95"
                                        style="width: 100%;"
                                        @mouseenter="baseTextRef?.triggerScramble(); hoverTextRef?.triggerScramble()"
                                        @click.stop>
                                        <div
                                            class="absolute inset-0 bg-red-600 origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover:scale-x-100 -z-10">
                                        </div>
                                        <div
                                            class="flex items-center gap-2 text-red-600 transition-colors duration-500 group-hover:text-white">
                                            <ScrambleText ref="baseTextRef" text="More OC Pictures"
                                                className="whitespace-nowrap" />
                                            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 12h14M14 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Magentic>

                                    <!-- Toggle Button -->
                                    <button class="show-card__btn-toggle group" @click.stop="toggle">
                                        <span class="relative z-10">{{ isFurry ? 'Switch to Main' : 'Switch to Furry'
                                        }}</span>
                                        <svg class="w-4 h-4 relative z-10 transition-transform duration-300"
                                            :class="isFurry ? 'rotate-180' : ''" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 12H5M5 12l7-7M5 12l7 7" />
                                        </svg>
                                        <div
                                            class="absolute inset-0 bg-gray-100 rounded-full scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 z-0">
                                        </div>
                                    </button>

                                    <!-- Mobile Next Page -->
                                    <button v-if="isPortrait"
                                        class="mt-4 w-full py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase border-t border-black/5 text-black/40 animate-pulse hover:text-black transition-colors"
                                        @click.stop="moveNext">
                                        <span>Scroll to Next Page</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </BorderGlow>
                    </Tilted>
                </AnimatedContent>
            </div>
        </div>
    </section>
</template>

<style scoped>
.show-content-container {
    position: absolute;
    top: 6rem;
    left: 5rem;
    right: 5rem;
    bottom: 2rem;
    z-index: 1;
    overflow: hidden;
    border-radius: 3rem;
    background: #000;
    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.3);
}

/* ── Background panels ── */
.show-bg-viewport {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.show-bg-panel {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.show-bg-panel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* ── Card wrapper ── */
.show-card-wrapper {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: auto;
    height: auto;
    pointer-events: none;
    /* transition is handled by GSAP */
}

.show-card-wrapper.is-right {
    left: 70%;
}

.show-card-wrapper.is-left {
    left: 30%;
}

.show-card-wrapper>div {
    pointer-events: auto;
}

/* ── Card Styles ── */
.show-card__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
}

.show-card__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
}

.show-card__description {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
}

.show-card__btn-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    color: white;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    width: 100%;
}

.show-card__btn-toggle:hover {
    border-color: white;
}

/* ── Mobile Portait Styles ── */
@media (max-width: 768px) {
    .show-content-container {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        inset: 0;
        height: 100vh;
        background: white;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0;
        box-shadow: none;
    }

    .show-bg-viewport {
        display: none;
        /* Desktop bg hidden on mobile */
    }

    .show-card-wrapper {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
        width: 100% !important;
        padding-top: 0;
        /* Space for Header */
    }

    .show-card__mobile-viewport {
        width: 100%;
        margin-bottom: 2rem;
        aspect-ratio: 16 / 9;
        flex-shrink: 0;
    }

    .show-card__label {
        color: rgba(0, 0, 0, 0.45) !important;
    }

    .show-card__description {
        color: rgba(0, 0, 0, 0.8) !important;
    }

    .show-card__btn-toggle {
        color: black !important;
        border-color: rgba(0, 0, 0, 0.2) !important;
    }

    .show-card__btn-toggle:hover {
        border-color: black !important;
    }
}
</style>
