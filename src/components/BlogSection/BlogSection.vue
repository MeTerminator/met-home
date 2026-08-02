<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Header from '../Header.vue';
import Bulge from '../ui/Bulge.vue';
import AnimatedContent from '../ui/AnimatedContent.vue';
import Magentic from '../ui/Magentic.vue';
import { links } from '../../data/data';

interface BlogArticle {
    number: string;
    label: string;
    title: string;
    summary: string;
    link: string;
}

const RSS_URL = 'https://blog.met6.top:444/rss.xml';

const articles = ref<BlogArticle[]>([]);
const isLoading = ref(true);
const isFeedLive = ref(false);
const hasFeedError = ref(false);
let feedController: AbortController | null = null;

const feedLabel = computed(() => {
    if (isLoading.value) return 'Loading latest posts';
    if (hasFeedError.value) return 'RSS unavailable';
    return isFeedLive.value ? 'Live from RSS' : 'Latest posts';
});

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(date);
};

const extractSummary = (html: string) => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    document.querySelectorAll('img, script, style').forEach((element) => element.remove());
    return document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
};

const loadFeed = async () => {
    feedController = new AbortController();
    hasFeedError.value = false;

    try {
        const response = await fetch(RSS_URL, {
            headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
            signal: feedController.signal,
        });
        if (!response.ok) throw new Error(`RSS request failed with ${response.status}`);

        const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
        if (xml.querySelector('parsererror')) throw new Error('RSS response is not valid XML');

        const parsedArticles = Array.from(xml.querySelectorAll('item')).slice(0, 6).map((item, index) => {
            const title = item.querySelector('title')?.textContent?.trim() ?? '';
            const link = item.querySelector('link')?.textContent?.trim() ?? links.blog;
            const category = item.querySelector('category')?.textContent?.trim() || 'Blog';
            const publishedAt = formatDate(item.querySelector('pubDate')?.textContent?.trim() ?? '');
            const description = extractSummary(item.querySelector('description')?.textContent ?? '');

            return {
                number: String(index + 1).padStart(2, '0'),
                label: [category, publishedAt].filter(Boolean).join(' / '),
                title,
                summary: description || '点击前往博客阅读全文。',
                link,
            };
        }).filter((article) => article.title && article.link);

        if (parsedArticles.length >= 3) {
            articles.value = parsedArticles;
            isFeedLive.value = true;
        } else {
            throw new Error('RSS feed did not contain enough valid articles');
        }
    } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
            hasFeedError.value = true;
            console.warn('[Blog] Unable to load RSS feed.', error);
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    void loadFeed();
});

onUnmounted(() => {
    feedController?.abort();
});
</script>

<template>
    <section
        class="section blog-section darkGradient relative h-full w-full overflow-hidden px-6 pb-10 pt-28 text-white lg:px-12">
        <Bulge type="Light" />
        <Header color="Light" />

        <div
            class="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-6 md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-stretch md:gap-12 lg:gap-20">
            <div
                class="flex items-end justify-between gap-6 border-b border-white/10 pb-5 md:flex-col md:items-start md:justify-center md:border-b-0 md:border-r md:pb-0 md:pr-12">
                <AnimatedContent direction="vertical" :distance="35" section-anchor="blog" :delay="0.1">
                    <p class="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-white/35">
                        {{ feedLabel }}
                    </p>
                    <h2 class="text-[clamp(3.25rem,8vw,7.5rem)] font-black leading-[0.82] tracking-[-0.06em]">
                        Blog
                    </h2>
                </AnimatedContent>

                <AnimatedContent direction="vertical" :distance="20" section-anchor="blog" :delay="0.3"
                    class-name="hidden md:block">
                    <Magentic :href="links.blog" target="_blank" :strength="20"
                        class-name="cursor-target group flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white">
                        <span>All posts</span>
                        <span class="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </Magentic>
                </AnimatedContent>
            </div>

            <div v-if="articles.length"
                class="blog-list grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-3 md:grid-rows-6 md:gap-0">
                <AnimatedContent v-for="(article, index) in articles" :key="article.number" direction="vertical"
                    :distance="35" section-anchor="blog" :delay="0.18 + index * 0.08"
                    class-name="blog-card min-h-0">
                    <a :href="article.link" target="_blank" rel="noopener noreferrer"
                        class="cursor-target group flex h-full min-h-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:px-0 md:py-3 md:hover:bg-transparent md:hover:pl-3">
                        <div class="flex items-center gap-4">
                            <span class="shrink-0 font-mono text-[10px] tracking-[0.18em] text-white/25">
                                {{ article.number }}
                            </span>
                            <div class="min-w-0 flex-1">
                                <div class="mb-1 flex items-center justify-between gap-4">
                                    <h3
                                        class="line-clamp-1 text-lg font-black leading-tight tracking-[-0.03em] md:text-xl lg:text-2xl">
                                        {{ article.title }}
                                    </h3>
                                    <span
                                        class="shrink-0 text-sm text-white/35 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                                        ↗
                                    </span>
                                </div>
                                <p class="line-clamp-1 text-xs leading-relaxed text-white/40 md:text-sm">
                                    {{ article.summary }}
                                </p>
                            </div>
                        </div>

                        <p class="mt-2 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/25 md:hidden">
                            {{ article.label }}
                        </p>
                    </a>
                </AnimatedContent>
            </div>

            <div v-else class="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-white/10">
                <p class="text-sm font-bold uppercase tracking-[0.2em] text-white/30">
                    {{ isLoading ? 'Loading RSS…' : 'Unable to load RSS' }}
                </p>
            </div>

            <Magentic :href="links.blog" target="_blank" :strength="12"
                class-name="cursor-target flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-white md:hidden">
                View all posts ↗
            </Magentic>
        </div>
    </section>
</template>

<style scoped>
.blog-card:nth-child(n + 5) {
    display: none;
}

@media (min-width: 768px) {
    .blog-card:nth-child(n + 5) {
        display: block;
    }
}
</style>
