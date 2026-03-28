<script setup lang="ts">
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
</script>

<template>
    <section
        class="section section__2 second darkGradient items-center justify-center pb-10 pt-paddingY text-colorLight w-full h-full relative">
        <Bulge type="Light" />
        <Header color="Light" />
        <div class="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <AnimatedContent direction="vertical" :distance="50" sectionAnchor="contact"
                class="w-full flex-1 flex flex-col items-center justify-center">
                <div class="text-4xl md:text-6xl font-black text-white/20 uppercase tracking-[0.4em]">
                    - Contact -
                </div>
            </AnimatedContent>
        </div>
    </section>
</template>
