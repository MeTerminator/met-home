<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

interface GlareHoverProps {
    glareColor?: string;
    glareOpacity?: number;
    glareAngle?: number;
    glareSize?: number;
    transitionDuration?: number;
    playOnce?: boolean;
    className?: string;
}

const props = withDefaults(defineProps<GlareHoverProps>(), {
    glareColor: '#ffffff',
    glareOpacity: 0.42,
    glareAngle: -35,
    glareSize: 280,
    transitionDuration: 850,
    playOnce: false,
    className: '',
});

const overlayRef = useTemplateRef<HTMLDivElement>('overlayRef');

const glareRgba = computed(() => {
    const hex = props.glareColor.replace('#', '');
    if (!/^[\dA-Fa-f]{6}$/.test(hex)) return props.glareColor;

    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${props.glareOpacity})`;
});

const overlayStyle = computed(() => ({
    position: 'absolute' as const,
    inset: '0',
    zIndex: '20',
    background: `linear-gradient(${props.glareAngle}deg,
        transparent 60%,
        ${glareRgba.value} 70%,
        transparent 100%)`,
    backgroundSize: `${props.glareSize}% ${props.glareSize}%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%',
    pointerEvents: 'none' as const,
}));

const animateIn = () => {
    const overlay = overlayRef.value;
    if (!overlay) return;

    overlay.style.transition = 'none';
    overlay.style.backgroundPosition = '-100% -100%';
    void overlay.offsetHeight;
    overlay.style.transition = `background-position ${props.transitionDuration}ms ease`;
    overlay.style.backgroundPosition = '100% 100%';
};

const animateOut = () => {
    const overlay = overlayRef.value;
    if (!overlay) return;

    overlay.style.transition = props.playOnce
        ? 'none'
        : `background-position ${props.transitionDuration}ms ease`;
    overlay.style.backgroundPosition = '-100% -100%';
};
</script>

<template>
    <div :class="['relative overflow-hidden', props.className]" @mouseenter="animateIn" @mouseleave="animateOut">
        <div ref="overlayRef" :style="overlayStyle"></div>
        <slot />
    </div>
</template>
