<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

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
