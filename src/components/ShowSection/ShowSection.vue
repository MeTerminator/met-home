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

// false = main side active (left image visible, card on right)
// true  = furry side active (right image visible, card on left)
const isFurry = ref(false);
let isAnimating = false;

const leftImgRef = ref<HTMLElement | null>(null);
const rightImgRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const isPortrait = ref(false);
const isCardOut = ref(false);

const updatePortraitStatus = () => {
    isPortrait.value = window.innerWidth <= 768;
    if (!isPortrait.value && isCardOut.value) {
        isCardOut.value = false;
        if (cardRef.value) gsap.set(cardRef.value, { x: '0%', opacity: 1 });
    }
};

const toggleCardVisibility = () => {
    if (!isPortrait.value || isAnimating) return;
    isCardOut.value = !isCardOut.value;
    if (isCardOut.value) {
        gsap.to(cardRef.value, { x: '105%', opacity: 0, duration: 0.6, ease: 'power2.inOut' });
    } else {
        gsap.to(cardRef.value, { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' });
    }
};

// ── Section enter / exit (images only — card handled by AnimatedContent) ──

function imgReset() {
    const L = leftImgRef.value;
    const R = rightImgRef.value;
    if (!L || !R) return;
    gsap.set(L, { x: '-15%', opacity: 0 });
    gsap.set(R, { x: '15%', opacity: 0 });
}

function imgEnter() {
    const L = leftImgRef.value;
    const R = rightImgRef.value;
    if (!L || !R) return;
    // Snap both to hidden first
    gsap.set(L, { x: '-15%', opacity: 0 });
    gsap.set(R, { x: '15%', opacity: 0 });
    // Show active side's image on enter
    if (isFurry.value) {
        gsap.to(R, { x: '0%', opacity: 1, duration: 0.85, ease: 'power3.out' });
    } else {
        gsap.to(L, { x: '0%', opacity: 1, duration: 0.85, ease: 'power3.out' });
    }
}

function imgLeave() {
    const L = leftImgRef.value;
    const R = rightImgRef.value;
    if (!L || !R) return;
    gsap.to(L, { x: '-15%', opacity: 0, duration: 0.5, ease: 'power2.in' });
    gsap.to(R, { x: '15%', opacity: 0, duration: 0.5, ease: 'power2.in' });
}

onMounted(() => {
    imgReset();
    updatePortraitStatus();
    window.addEventListener('resize', updatePortraitStatus);
    window.addEventListener('replayShowAnimation', imgEnter);
    window.addEventListener('leaveShowAnimation', imgLeave);
    window.addEventListener('resetShowAnimation', imgReset);
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePortraitStatus);
    window.removeEventListener('replayShowAnimation', imgEnter);
    window.removeEventListener('leaveShowAnimation', imgLeave);
    window.removeEventListener('resetShowAnimation', imgReset);
});

// ── Card toggle ───────────────────────────────────────────────
function toggle() {
    if (isAnimating) return;
    isAnimating = true;

    const entering = !isFurry.value;
    const card = cardRef.value;
    const leftImg = leftImgRef.value;
    const rightImg = rightImgRef.value;
    if (!card || !leftImg || !rightImg) { isAnimating = false; return; }

    // Card slide/fade logic
    const slideOut = entering ? '110%' : '-110%'; // Toward current side
    const slideFrom = entering ? '-110%' : '110%'; // From new side

    // Image swap logic
    const hidingImg = entering ? leftImg : rightImg;
    const showingImg = entering ? rightImg : leftImg;
    const exitX = entering ? '-15%' : '15%';

    gsap.timeline({ onComplete: () => { isAnimating = false; } })
        .to(card, { x: slideOut, opacity: 0, duration: 0.38, ease: 'power2.in' })
        .to(hidingImg, { x: exitX, opacity: 0, duration: 0.45, ease: 'power2.inOut' }, '<0.05')
        .to(showingImg, { x: '0%', opacity: 1, duration: 0.45, ease: 'power2.inOut' }, '<')
        .call(() => { isFurry.value = entering; })
        .set(card, { x: slideFrom })
        .to(card, { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' });
}
</script>


<template>
    <section class="section section__2 second show-section--white relative w-full h-full"
        style="padding-inline: 0 !important; overflow: hidden !important;">
        <Bulge type="Dark" />
        <Header color="Dark" />

        <!-- ── Main Content Container (Rounded with Margins) ── -->
        <div class="show-content-container" @click="toggleCardVisibility">
            <!-- ── Background Images ─────────────────────────────────────── -->
            <div ref="leftImgRef" class="show-bg show-bg--left">
                <img src="/img/met-main-bg.webp" alt="" draggable="false" />
            </div>

            <!-- Right image: starts hidden -->
            <div ref="rightImgRef" class="show-bg show-bg--right" style="opacity: 0;">
                <img src="/img/met-furry-bg.webp" alt="" draggable="false" />
            </div>

            <!-- ── Floating Card ─────────────────────────────────────────── -->
            <AnimatedContent className="show-card-wrapper"
                :class="isFurry ? 'show-card-wrapper--left' : 'show-card-wrapper--right'" direction="vertical"
                :distance="80" triggerEvent="replayShowAnimation" leaveEvent="leaveShowAnimation"
                resetEvent="resetShowAnimation">
                <div ref="cardRef">
                    <Tilted :width="isPortrait ? '100%' : '340px'" height="auto" :rotateAmplitude="10" :scale="true" cardClass="">
                        <BorderGlow class-name="show-card__inner" background-color="rgba(255,255,255,0.05)"
                            :border-radius="20" glow-color="0 85 65" :glow-intensity="1.1"
                            :colors="['#ef4444', '#2600ff', '#ff9999']" :fill-opacity="0.35" :cone-spread="22">
                            <div class="show-card__body">
                                <p class="show-card__label">{{ isFurry ? '— Furry Set -' : '— Main Set -' }}</p>

                                <div class="show-card__description" :style="isFurry ? 'display: none;' : ''">
                                    Hi, my friend. I am <span class="font-bold">MeTerminator</span>, a versatile
                                    full-stack developer and cybersecurity architect dedicated to crafting sophisticated
                                    digital ecosystems. My expertise spans the horizon of modern development, from
                                    building robust web architectures with <span class="font-bold">Next.js</span> and
                                    <span class="font-bold">React</span> to engineering high-performance mobile
                                    experiences through <span class="font-bold">Swift</span> and <span
                                        class="font-bold">Flutter</span>.
                                </div>

                                <div class="show-card__description" :style="isFurry ? '' : 'display: none;'">
                                    Beyond the frontend, I specialize in architecting scalable backends using <span
                                        class="font-bold">Python</span>,
                                    <span class="font-bold">Flask</span>, and <span class="font-bold">FastAPI</span>. I
                                    immerse myself in the intricate world of <span class="font-bold">CTF
                                        competitions</span>, focusing on vulnerability research and binary exploitation.
                                    Whether optimizing <span class="font-bold">Linux infrastructure</span> or hardening
                                    server-side logic, my work is driven by a singular pursuit: the seamless synthesis
                                    of
                                    impenetrable security and elegant, cross-platform functionality.
                                </div>

                                <div class="mt-auto flex flex-col gap-4">
                                    <!-- More OC Pictures Button (Main CTA) -->
                                    <Magentic :strength="20" :href="links.ocpic" target="_blank"
                                        className="group relative isolate z-20 flex items-center justify-center px-8 py-3 rounded-full border-2 border-red-600 font-extrabold text-sm overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 active:scale-95"
                                        style="width: 100%;"
                                        @mouseenter="baseTextRef?.triggerScramble(); hoverTextRef?.triggerScramble()"
                                        @click.stop>

                                        <!-- Background Fill: Left to Right Red -->
                                        <div
                                            class="absolute inset-0 bg-red-600 origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover:scale-x-100 -z-10">
                                        </div>

                                        <!-- Default Text & Arrow (Red) -->
                                        <div
                                            class="flex items-center gap-2 text-red-600 transition-colors duration-500">
                                            <ScrambleText ref="baseTextRef" text="More OC Pictures"
                                                className="whitespace-nowrap" />
                                            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 12h14M14 5l7 7-7 7" />
                                            </svg>
                                        </div>

                                        <!-- Hover Text & Arrow (White) -->
                                        <div
                                            class="absolute inset-0 flex items-center justify-center gap-2 text-white pointer-events-none transition-[clip-path] duration-500 ease-in-out [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)] z-10">
                                            <ScrambleText ref="hoverTextRef" text="More OC Pictures"
                                                className="whitespace-nowrap" />
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 12h14M14 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Magentic>

                                    <!-- Secondary Toggle Button -->
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
                                    <p v-if="isPortrait" class="show-card__hide-hint">Click background to hide card</p>
                                </div>
                            </div>
                        </BorderGlow>
                    </Tilted>
                </div>
            </AnimatedContent>
        </div>
    </section>
</template>


<style scoped>
/* ── Main Content Container ── */
.show-content-container {
    position: absolute;
    inset: 2rem;
    margin-top: 4rem;
    border-radius: 2.5rem;
    overflow: hidden;
    z-index: 1;
    background: #ffffff;
    /* Always White */
    box-shadow: 0 12px 60px rgba(0, 0, 0, 0.08);
    transition: background 0.6s ease;
}

.show-section--white {
    background: #ffffff !important;
    transition: background 0.6s ease;
}



/* ── Background image panels ── */
.show-bg {
    position: absolute !important;
    top: 0;
    bottom: 0;
    width: 70% !important;
    height: 100% !important;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.6s ease;
}

.show-bg--left {
    left: 0;
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
}

.show-bg--right {
    right: 0;
    mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
}

.show-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
}

.show-bg--left img {
    object-position: left center;
}

.show-bg--right img {
    object-position: right center;
}

/* ── Card wrapper: positions the 30% panel that holds the card ── */
.show-card-wrapper {
    position: absolute !important;
    top: 0;
    bottom: 0;
    width: 30% !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
}

.show-card-wrapper--right {
    right: 0;
    left: auto;
}

.show-card-wrapper--left {
    left: 0;
    right: auto;
}

/* Allow clicks to pass through to the card itself */
.show-card-wrapper>div {
    pointer-events: auto;
}

/* ── Card inner look ── */
.show-card__inner {
    padding: 2rem 2rem 1.75rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-height: 260px;
    width: 320px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

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
    color: var(--colorSecondaryDark);
    opacity: 0.55;
}

.show-card__description {
    flex: 1;
    font-size: 15px;
    line-height: 1.7;
    color: var(--colorDark);
    min-height: 80px;
}

.show-card__btn-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid var(--colorSecondaryDark);
    background: transparent;
    color: var(--colorSecondaryDark);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    width: 100%;
}

.show-card__btn-toggle:hover {
    border-color: var(--colorDark);
    color: var(--colorDark);
}

/* ── Card look for White background ── */
.show-card__inner {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
    transition: background 0.5s ease, box-shadow 0.5s ease;
}

.show-card__label {
    color: var(--colorSecondaryDark);
    transition: color 0.4s ease;
}

.show-card__description {
    color: var(--colorDark);
    transition: color 0.4s ease;
}

@media (max-width: 768px) {
    .show-content-container {
        inset: 1rem;
        margin-top: 5rem;
        border-radius: 1.5rem;
    }

    .show-bg {
        width: 100% !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
        pointer-events: auto;
    }

    .show-bg--left {
        left: 0;
    }

    .show-bg--right {
        right: 0;
    }

    .show-card-wrapper {
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
    }

    .show-card__inner {
        width: calc(100% - 2rem) !important;
        max-width: 320px;
        background: rgba(0, 0, 0, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
        margin-inline: auto !important;
    }

    .show-card__label,
    .show-card__description {
        color: white !important;
    }

    .show-card__btn-toggle {
        color: white !important;
        border-color: rgba(255, 255, 255, 0.4) !important;
    }

    .show-card__hide-hint {
        font-size: 9px;
        text-align: center;
        color: white;
        opacity: 0.3;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-top: 4px;
    }
}
</style>
