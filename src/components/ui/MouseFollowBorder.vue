<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { gsap } from 'gsap';

interface MouseFollowBorderProps {
    className?: string;
    duration?: number;
    ease?: string;
}

const props = withDefaults(defineProps<MouseFollowBorderProps>(), {
    className: '',
    duration: 0.8, // Slightly longer for smoother feel
    ease: 'power3.out'
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

let currentAngle = 0;

const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = (angleRad * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    
    // The red part in the conic-gradient starts at 85% and ends at 95%.
    // The center of the red segment is at 90% of 360deg = 324deg.
    // To have the center of the red part point to the mouse, 
    // we need: var(--border-angle) + 324deg = degrees.
    // So: var(--border-angle) = degrees - 324deg.
    const targetAngle = degrees - 324;
    
    // Calculate the shortest rotation delta to avoid "long way around" jumps
    // (target - current + 180) % 360 - 180 gives the signed shortest distance
    const delta = ((targetAngle - currentAngle + 540) % 360) - 180;
    currentAngle += delta;
    
    gsap.to(containerRef.value, {
        '--border-angle': `${currentAngle}deg`,
        duration: props.duration,
        ease: props.ease
    });
};

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
    <div ref="containerRef" :class="['mouse-follow-border', props.className]">
        <slot />
    </div>
</template>

<style scoped>
.mouse-follow-border {
    position: relative;
    --border-angle: 0deg;
    border-radius: 30px;
}

.mouse-follow-border::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    padding: 3px;
    border-radius: inherit;
    background: conic-gradient(
        from var(--border-angle), 
        #1a73e8, 
        #1a73e8 80%, 
        #ff0044 85%, 
        #ff0044 90%, 
        #ff0044 95%, 
        #1a73e8 100%
    );
    
    --mask-bg: linear-gradient(#fff, #fff);
    --mask-clip: content-box, padding-box;
    
    mask-image: var(--mask-bg), var(--mask-bg);
    -webkit-mask-image: var(--mask-bg), var(--mask-bg);
    mask-origin: var(--mask-clip);
    -webkit-mask-origin: var(--mask-clip);
    mask-clip: var(--mask-clip);
    -webkit-mask-clip: var(--mask-clip);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    
    z-index: 50;
}
</style>
