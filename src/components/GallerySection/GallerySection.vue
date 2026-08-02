<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import GlareHover from '../ui/GlareHover.vue';
import { links } from '../../data/data';

interface GalleryItem {
    id: string;
    src: string;
    width: number;
    height: number;
}

const galleryItems: GalleryItem[] = [
    { id: '01', src: '/gallery/gallery-01.webp', width: 1188, height: 2400 },
    { id: '02', src: '/gallery/gallery-02.webp', width: 1600, height: 2265 },
    { id: '03', src: '/gallery/gallery-03.webp', width: 1600, height: 2133 },
    { id: '04', src: '/gallery/gallery-04.webp', width: 1360, height: 2400 },
    { id: '05', src: '/gallery/gallery-05.webp', width: 1408, height: 2096 },
    { id: '06', src: '/gallery/gallery-06.webp', width: 1600, height: 2150 },
    { id: '07', src: '/gallery/gallery-07.webp', width: 1253, height: 2400 },
    { id: '08', src: '/gallery/gallery-08.webp', width: 2158, height: 1214 },
    { id: '09', src: '/gallery/gallery-09.webp', width: 1516, height: 2400 },
    { id: '10', src: '/gallery/gallery-10.webp', width: 1921, height: 2400 },
    { id: '11', src: '/gallery/gallery-11.webp', width: 2400, height: 1351 },
    { id: '12', src: '/gallery/gallery-12.webp', width: 1670, height: 1672 },
    { id: '13', src: '/gallery/gallery-13.webp', width: 1600, height: 1200 },
];

const galleryRows = [
    { id: 'top', items: galleryItems.filter((_, index) => index % 2 === 0), reverse: false },
    { id: 'bottom', items: galleryItems.filter((_, index) => index % 2 === 1), reverse: true },
];

const galleryStageRef = useTemplateRef<HTMLElement>('galleryStageRef');
const isGalleryActive = ref(false);
let entranceAnimation: gsap.core.Timeline | null = null;

const resetGallery = () => {
    const stage = galleryStageRef.value;
    if (!stage) return;

    isGalleryActive.value = false;
    entranceAnimation?.kill();

    const rows = stage.querySelectorAll<HTMLElement>('.gallery-row');
    const cards = stage.querySelectorAll<HTMLElement>('.gallery-item');
    const backgroundTitle = stage.querySelector<HTMLElement>('.gallery-background-title');

    gsap.set(rows, {
        clipPath: (index) => index === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
        opacity: 0,
    });
    gsap.set(cards, {
        y: 55,
        scale: 0.96,
        opacity: 0,
    });
    gsap.set(backgroundTitle, {
        filter: 'blur(40px)',
        scale: 1.08,
        y: 0,
        opacity: 0,
    });
};

const revealGallery = () => {
    const stage = galleryStageRef.value;
    if (!stage) return;

    isGalleryActive.value = true;
    entranceAnimation?.kill();

    const rows = stage.querySelectorAll<HTMLElement>('.gallery-row');
    const cards = stage.querySelectorAll<HTMLElement>('.gallery-item');
    const backgroundTitle = stage.querySelector<HTMLElement>('.gallery-background-title');

    entranceAnimation = gsap.timeline();
    entranceAnimation.to(backgroundTitle, {
        filter: 'blur(0px)',
        scale: 1,
        y: 0,
        opacity: 0.68,
        duration: 1.1,
        ease: 'power3.out',
    });
    entranceAnimation.to(backgroundTitle, {
        y: '-38vh',
        scale: 0.3,
        opacity: 0.16,
        duration: 1,
        ease: 'power4.inOut',
    }, '+=0');
    entranceAnimation.to(rows, {
        clipPath: 'inset(0 0% 0 0%)',
        opacity: 1,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power4.inOut',
    }, '>-0.75');
    entranceAnimation.to(cards, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.95,
        stagger: 0.025,
        ease: 'power3.out',
    }, '<+=0.12');
};

onMounted(() => {
    resetGallery();
    window.addEventListener('section:gallery:enter', revealGallery);
    window.addEventListener('section:gallery:reset', resetGallery);
});

onUnmounted(() => {
    entranceAnimation?.kill();
    window.removeEventListener('section:gallery:enter', revealGallery);
    window.removeEventListener('section:gallery:reset', resetGallery);
});
</script>

<template>
    <section
        class="section gallery-section lightGradient relative h-full w-full overflow-hidden px-0! pb-8 pt-24 text-black">
        <Bulge type="Dark" />
        <Header color="Dark" />

        <div ref="galleryStageRef" class="gallery-stage relative z-10 flex h-full w-full flex-col justify-center gap-3"
            :class="{ 'is-active': isGalleryActive }">
            <div
                class="gallery-background-title pointer-events-none absolute inset-0 z-20 flex items-center justify-center mix-blend-multiply"
                aria-hidden="true">
                <span
                    class="select-none whitespace-nowrap text-[clamp(9rem,25vw,28rem)] font-black leading-none tracking-[-0.09em] text-black">
                    Gallery
                </span>
            </div>

            <div v-for="row in galleryRows" :key="row.id"
                class="gallery-row relative z-10 w-full overflow-hidden opacity-0">
                <div class="gallery-track flex w-max will-change-transform" :class="{ 'gallery-track--reverse': row.reverse }">
                    <div v-for="copyIndex in 2" :key="copyIndex" class="gallery-group flex shrink-0">
                        <a v-for="(item, index) in row.items" :key="`${copyIndex}-${item.id}`" :href="links.ocpic"
                            target="_blank" rel="noopener noreferrer"
                            class="gallery-item group cursor-target shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5 md:rounded-3xl"
                            :style="{ '--item-aspect': item.width / item.height }"
                            :aria-hidden="copyIndex === 2 ? 'true' : undefined" :tabindex="copyIndex === 2 ? -1 : 0">
                            <GlareHover class-name="h-full w-full" :glare-opacity="0.38" :glare-angle="-35"
                                :glare-size="300" :transition-duration="900">
                                <img :src="item.src" :alt="copyIndex === 1 ? `Gallery artwork ${item.id}` : ''"
                                    :loading="index < 3 ? 'eager' : 'lazy'"
                                    class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                                <div
                                    class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-20">
                                </div>
                                <span
                                    class="pointer-events-none absolute bottom-4 left-4 z-30 font-mono text-[10px] tracking-[0.25em] text-white/65">
                                    {{ item.id }}
                                </span>
                            </GlareHover>
                        </a>
                    </div>
                </div>

                <div
                    class="pointer-events-none absolute inset-y-0 left-0 z-40 w-[7vw] bg-gradient-to-r from-[#fff] to-transparent">
                </div>
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 z-40 w-[7vw] bg-gradient-to-l from-[#f2f2f2] to-transparent">
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.gallery-stage {
    --gallery-row-height: clamp(190px, 29vh, 290px);
}

.gallery-group {
    gap: 0.875rem;
    padding-right: 0.875rem;
}

.gallery-item {
    height: var(--gallery-row-height);
    width: calc(var(--gallery-row-height) * var(--item-aspect));
}

.gallery-track {
    animation: gallery-marquee 88s linear infinite;
    animation-play-state: paused;
}

.gallery-track--reverse {
    animation-direction: reverse;
    animation-duration: 76s;
}

.gallery-stage.is-active .gallery-track {
    animation-play-state: running;
}

.gallery-row:hover .gallery-track {
    animation-play-state: paused;
}

@keyframes gallery-marquee {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        transform: translate3d(-50%, 0, 0);
    }
}

@media (max-width: 767px) {
    .gallery-stage {
        --gallery-row-height: clamp(155px, 25vh, 215px);
    }

    .gallery-group {
        gap: 0.625rem;
        padding-right: 0.625rem;
    }

    .gallery-track {
        animation-duration: 68s;
    }

    .gallery-track--reverse {
        animation-duration: 58s;
    }
}

@media (prefers-reduced-motion: reduce) {
    .gallery-track {
        animation-play-state: paused !important;
    }
}
</style>
