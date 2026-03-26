<script setup lang="ts">
import { onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import { gsap } from 'gsap';

interface AnimatedContentProps {
    distance?: number;
    direction?: 'vertical' | 'horizontal';
    reverse?: boolean;
    duration?: number;
    ease?: string | ((progress: number) => number);
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number;
    delay?: number;
    className?: string;
    alwaysPlay?: boolean;
    /** Custom event name to trigger (re)play. Useful in fullpage.js environments. */
    triggerEvent?: string;
}

const props = withDefaults(defineProps<AnimatedContentProps>(), {
    distance: 100,
    direction: 'vertical',
    reverse: false,
    duration: 0.8,
    ease: 'power3.out',
    initialOpacity: 0,
    animateOpacity: true,
    scale: 1,
    threshold: 0.1,
    delay: 0,
    className: '',
    alwaysPlay: false,
    triggerEvent: 'replayContactAnimation'
});

const emit = defineEmits<{
    complete: [];
}>();

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

let anim: gsap.core.Tween | null = null;

const setInitialState = () => {
    const el = containerRef.value;
    if (!el) return;
    const axis = props.direction === 'horizontal' ? 'x' : 'y';
    const offset = props.reverse ? -props.distance : props.distance;
    gsap.set(el, {
        [axis]: offset,
        scale: props.scale,
        opacity: props.animateOpacity ? props.initialOpacity : 1
    });
};

const playAnimation = () => {
    const el = containerRef.value;
    if (!el) return;

    if (anim) {
        anim.kill();
    }

    const axis = props.direction === 'horizontal' ? 'x' : 'y';
    const offset = props.reverse ? -props.distance : props.distance;

    anim = gsap.fromTo(el,
        {
            [axis]: offset,
            scale: props.scale,
            opacity: props.animateOpacity ? props.initialOpacity : 1
        },
        {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration: props.duration,
            ease: props.ease,
            delay: props.delay,
            onComplete: () => emit('complete')
        }
    );
};

const handleTriggerEvent = () => playAnimation();

const handleResetEvent = () => setInitialState();

onMounted(() => {
    setInitialState();

    if (props.alwaysPlay) {
        playAnimation();
        return;
    }

    window.addEventListener(props.triggerEvent, handleTriggerEvent);
    window.addEventListener('resetContactAnimation', handleResetEvent);
});

watch(
    () => [
        props.distance,
        props.direction,
        props.reverse,
        props.duration,
        props.ease,
        props.initialOpacity,
        props.animateOpacity,
        props.scale,
        props.threshold,
        props.delay,
        props.alwaysPlay,
        props.triggerEvent
    ],
    () => {
        setInitialState();
    },
    { deep: true }
);

onUnmounted(() => {
    if (anim) anim.kill();
    window.removeEventListener(props.triggerEvent, handleTriggerEvent);
    window.removeEventListener('resetContactAnimation', handleResetEvent);
});
</script>

<template>
    <div ref="containerRef" :class="['animated-content', props.className]">
        <slot />
    </div>
</template>

<style scoped>
.animated-content {
    position: relative;
    width: 100%;
}
</style>
