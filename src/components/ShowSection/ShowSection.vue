<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import Tilted from '../ui/Tilted.vue';
import MouseFollowBorder from '../ui/MouseFollowBorder.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';

// false = main side active (left image visible, card on right)
// true  = furry side active (right image visible, card on left)
const isFurry = ref(false);
let isAnimating = false;

const leftImgRef = ref<HTMLElement | null>(null);
const rightImgRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

// ── Section enter / exit (images only — card handled by AnimatedContent) ──

function imgReset() {
  isAnimating = false;
  isFurry.value = false;
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
  // Snap to hidden first
  gsap.set(L, { x: '-15%', opacity: 0 });
  gsap.set(R, { x: '15%', opacity: 0 });
  // Only left (main) slides in on enter
  gsap.to(L, { x: '0%', opacity: 1, duration: 0.85, ease: 'power3.out' });
  // Right stays hidden (isFurry is false at entry)
}

function imgLeave() {
  const L = leftImgRef.value;
  const R = rightImgRef.value;
  if (!L || !R) return;
  // Left exits to the LEFT, right exits to the RIGHT
  // Only the visible one needs to animate, but animating both is fine
  gsap.to(L, { x: '-15%', opacity: 0, duration: 0.5, ease: 'power2.in' });
  gsap.to(R, { x: '15%', opacity: 0, duration: 0.5, ease: 'power2.in' });
}

onMounted(() => {
  imgReset();
  window.addEventListener('replayShowAnimation', imgEnter);
  window.addEventListener('leaveShowAnimation', imgLeave);
  window.addEventListener('resetShowAnimation', imgReset);
});

onUnmounted(() => {
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

  // Card: slide out toward image side, then in from opposite
  const slideOut = entering ? '-110%' : '110%';
  const slideFrom = entering ? '110%' : '-110%';

  // Image exit directions: left always exits LEFT, right always exits RIGHT
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
  <section class="section section__2 second lightGradient relative w-full h-full"
    style="padding-inline: 0 !important; overflow: hidden !important;">
    <Bulge type="Dark" />
    <Header color="Dark" />

    <!-- ── Background Images ─────────────────────────────────────── -->

    <!-- Left image: plain div, animated manually via GSAP events -->
    <div ref="leftImgRef" class="show-bg show-bg--left">
      <img src="/img/met-main-bg.webp" alt="" draggable="false" />
    </div>

    <!-- Right image: starts hidden, shown only when isFurry -->
    <div ref="rightImgRef" class="show-bg show-bg--right">
      <img src="/img/met-furry-bg.webp" alt="" draggable="false" />
    </div>

    <!-- ── Floating Card ─────────────────────────────────────────── -->
    <!-- Wrapper: absolute half-panel, flex centers the card vertically -->
    <AnimatedContent className="show-card-wrapper"
      :class="isFurry ? 'show-card-wrapper--left' : 'show-card-wrapper--right'" direction="vertical" :distance="80"
      triggerEvent="replayShowAnimation" leaveEvent="leaveShowAnimation" resetEvent="resetShowAnimation">
      <!-- GSAP target: only x / opacity animated here during toggle -->
      <div ref="cardRef">
        <Tilted width="340px" height="auto" :rotateAmplitude="10" :scale="true" cardClass="">
          <MouseFollowBorder className="show-card__inner">
            <div class="show-card__body">
              <p class="show-card__label">{{ isFurry ? '— Furry Side' : '— Main Side' }}</p>

              <!-- Description — placeholder -->
              <div class="show-card__description"></div>

              <button class="show-card__btn" @click.stop="toggle">
                <span>{{ isFurry ? 'See Main' : 'See Furry' }}</span>
                <svg class="show-card__btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="isFurry ? 'M19 12H5M5 12l7-7M5 12l7 7' : 'M5 12h14M14 5l7 7-7 7'" />
                </svg>
              </button>
            </div>
          </MouseFollowBorder>
        </Tilted>
      </div>
    </AnimatedContent>
  </section>
</template>

<style scoped>
/* ── Background image panels ── */
.show-bg {
  /* Position relative to the section (which = viewport) */
  position: absolute !important;
  top: 0;
  bottom: 0;
  width: 50% !important;
  height: 100% !important;
  overflow: hidden;
  pointer-events: none;
  /* Images below the card */
  z-index: 1;
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

/* ── Card wrapper: positions the half-panel that holds the card ── */
.show-card-wrapper {
  position: absolute !important;
  top: 0;
  bottom: 0;
  width: 50% !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  /* Card always ABOVE images */
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
  background: rgba(255, 255, 255, 0.12);
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

/* ── Toggle Button ── */
.show-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 999px;
  border: 2px solid var(--colorDark);
  background: transparent;
  color: var(--colorDark);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  width: fit-content;
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
  isolation: isolate;
}

.show-card__btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--colorDark);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
  z-index: -1;
}

.show-card__btn:hover::before {
  transform: scaleX(1);
}

.show-card__btn:hover {
  color: var(--colorLight);
}

.show-card__btn-arrow {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.show-card__btn:hover .show-card__btn-arrow {
  transform: translateX(3px);
}
</style>
