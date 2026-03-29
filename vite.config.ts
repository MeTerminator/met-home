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
      includeAssets: [
        'favicon.ico',
        'images/icon/*.png',
        'img/*.webp',
        'met-hero-modal/*.avif',
        '**/*.{png,svg,webp,avif,woff2}'
      ],
      manifest: {
        name: 'MeT Home - Developer Portfolio',
        short_name: 'MeT-Home',
        description: 'Portfolio of MeTerminator - Developer, Designer, and Tech Enthusiast',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['portfolio', 'development', 'design'],
        icons: [
          {
            src: '/images/icon/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/icon/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/images/icon/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,otf,wasm,json,webp,avif}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // Increase limit to 20MB for high-res assets
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
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
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
