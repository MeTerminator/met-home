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
    /** If provided, automatically derives trigger/reset/leave events: section:[anchor]:[action] */
    sectionAnchor?: string;
    /** Custom event name to trigger (re)play. */
    triggerEvent?: string;
    /** Custom event name to reset back to initial state instantly. */
    resetEvent?: string;
    /** Custom event name to play the exit (reverse) animation. */
    leaveEvent?: string;
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
    sectionAnchor: '',
    triggerEvent: '',
    resetEvent: '',
    leaveEvent: '',
});

// Derived event names
const getTriggerEvent = () => props.triggerEvent || (props.sectionAnchor ? `section:${props.sectionAnchor}:enter` : '');
const getResetEvent = () => props.resetEvent || (props.sectionAnchor ? `section:${props.sectionAnchor}:reset` : '');
const getLeaveEvent = () => props.leaveEvent || (props.sectionAnchor ? `section:${props.sectionAnchor}:exit` : '');

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

const playExitAnimation = () => {
    const el = containerRef.value;
    if (!el) return;

    if (anim) {
        anim.kill();
    }

    const axis = props.direction === 'horizontal' ? 'x' : 'y';
    // Exit goes to the OPPOSITE side from which the element entered.
    // Enter: offset → 0.  Exit: 0 → -offset (slide out the other way).
    const offset = props.reverse ? -props.distance : props.distance;

    anim = gsap.to(el, {
        [axis]: -offset,
        scale: props.scale,
        opacity: props.animateOpacity ? props.initialOpacity : 1,
        duration: props.duration * 0.85,
        ease: 'power2.in',
    });
};

const handleLeaveEvent = () => playExitAnimation();

onMounted(() => {
    setInitialState();

    if (props.alwaysPlay) {
        playAnimation();
        return;
    }

    const trigger = getTriggerEvent();
    const reset = getResetEvent();
    const leave = getLeaveEvent();

    if (trigger) window.addEventListener(trigger, handleTriggerEvent);
    if (reset) window.addEventListener(reset, handleResetEvent);
    if (leave) window.addEventListener(leave, handleLeaveEvent);
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
        props.sectionAnchor,
        props.triggerEvent
    ],
    () => {
        setInitialState();
    },
    { deep: true }
);

onUnmounted(() => {
    if (anim) anim.kill();
    
    const trigger = getTriggerEvent();
    const reset = getResetEvent();
    const leave = getLeaveEvent();

    if (trigger) window.removeEventListener(trigger, handleTriggerEvent);
    if (reset) window.removeEventListener(reset, handleResetEvent);
    if (leave) window.removeEventListener(leave, handleLeaveEvent);
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
}
</style>
