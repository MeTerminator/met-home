import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
import { readdirSync, statSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Function to recursively delete .DS_Store files
function deleteDsStore(dir: string) {
  if (!existsSync(dir)) return
  const files = readdirSync(dir)
  files.forEach(file => {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      deleteDsStore(fullPath)
    } else if (file === '.DS_Store') {
      unlinkSync(fullPath)
    }
  })
}

// Custom plugin to exclude .DS_Store from dist
const excludeDsStore = () => ({
  name: 'exclude-ds-store',
  apply: 'build' as const,
  closeBundle: () => {
    deleteDsStore('dist')
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'icon/*.svg', 'img/*.png', 'img/*.webp'],
      manifest: {
        name: 'Home of MeTerminator',
        short_name: 'MeT-Home',
        description: 'Portfolio of MeTerminator - Developer, Designer, and Tech Enthusiast',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon/github.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon/github.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp,avif,json}'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit for caching
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <--- 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    compression(),
    excludeDsStore()
  ],
})
