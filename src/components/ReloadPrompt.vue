<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const UPDATE_INTERVAL = 60 * 1000
const UPDATE_THROTTLE = 15 * 1000

let registration: ServiceWorkerRegistration | undefined
let updateTimer: ReturnType<typeof setInterval> | undefined
let updateInProgress = false
let lastUpdateCheck = 0

const checkForUpdates = async () => {
  if (
    !registration?.active ||
    !navigator.onLine ||
    updateInProgress ||
    Date.now() - lastUpdateCheck < UPDATE_THROTTLE
  ) {
    return
  }

  updateInProgress = true
  lastUpdateCheck = Date.now()

  try {
    // update() fetches sw.js again and starts the Workbox update lifecycle when
    // its generated precache manifest has changed.
    await registration.update()
  } catch (error) {
    console.warn('[PWA] Failed to check for an update:', error)
  } finally {
    updateInProgress = false
  }
}

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegisteredSW(_swUrl, swRegistration) {
    registration = swRegistration
    void checkForUpdates()

    updateTimer = setInterval(() => {
      void checkForUpdates()
    }, UPDATE_INTERVAL)
  },
  onRegisterError(error) {
    console.error('[PWA] Service worker registration failed:', error)
  },
})

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    void checkForUpdates()
  }
}

const handleWindowActive = () => {
  void checkForUpdates()
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleWindowActive)
  window.addEventListener('online', handleWindowActive)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowActive)
  window.removeEventListener('online', handleWindowActive)

  if (updateTimer) {
    clearInterval(updateTimer)
  }
})

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()" class="reload-btn">
      Reload
    </button>
    <button @click="close()" class="close-btn">
      Close
    </button>
  </div>
</template>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 10000;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: inherit;
}
.pwa-toast .message {
  margin-bottom: 8px;
  font-size: 14px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}
.pwa-toast button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.reload-btn {
  background-color: #2c3e50 !important;
}
</style>
