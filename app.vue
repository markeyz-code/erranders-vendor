<template>
  <div>
    <!-- Platform Closed Overlay -->
    <ClientOnly>
      <CorePlatformClosed v-if="isPlatformClosed" />
    </ClientOnly>

    <template v-if="!isPlatformClosed">
      <VitePwaManifest />
      <UiToast class="z-[9999999]" />
      <CoreNetworkStatusBanner />
      <UiGlobalConfirmModal class="z-[10000000]" />
      <NuxtLayout class="z-10">
        <NuxtPage class="z-10" />
      </NuxtLayout>
      
      <CoreCallOverlay />
    </template>
    
    <!-- Background Audio - Bottom Left -->
    <!-- <ClientOnly>
      <div class="fixed bottom-6 left-6 z-[999998]">
        <BackgroundAudio src="/audio/ambient-tranquility-serene-soundscapes-365048.mp3" />
      </div>
    </ClientOnly> -->
  </div>
</template>

<style>
body {
  font-family: 'Roobert PRO', sans-serif;
}
</style>

<script setup lang="ts">
// Global app configuration
import { ref, onMounted } from 'vue'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useWebRTC } from '@/composables/useWebRTC'

const isPlatformClosed = ref(false)

useRealtimeNotifications()

const { initSocketListeners } = useWebRTC()

// Check platform status
const checkPlatformStatus = async () => {
  try {
    const envApiUrl = import.meta.env?.VITE_API_BASE_URL
    const baseUrl = envApiUrl || 'https://api.erranders.org'
    const cleanBase = baseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
    const res = await $fetch<{ isClosed: boolean }>(`${cleanBase}/api/v1/settings/platform-status/public`)
    isPlatformClosed.value = res?.isClosed ?? false
  } catch (e) {
    isPlatformClosed.value = false
  }
}

onMounted(() => {
  checkPlatformStatus()
  initSocketListeners()
})

useHead({
  title: 'Errandr - Merchant Portal',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

useSeoMeta({
  title: 'Errandr — Merchant Portal',
  ogTitle: 'Errandr — Merchant Portal',
  description: 'Errandr Merchant Portal. Manage your store, process orders, and grow your business with Errandr.',
  ogDescription: 'Errandr Merchant Portal. Manage your store, process orders, and grow your business with Errandr.',
  keywords: 'Errandr merchant, vendor portal, store management, process orders, business growth',
  author: 'Errandr Team',
  ogType: 'website',
  ogUrl: 'https://errandr.com/merchant',
  ogImage: 'https://errandr.com/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Errandr — Merchant Portal',
  twitterDescription: 'Errandr Merchant Portal. Manage your store, process orders, and grow your business with Errandr.',
  twitterImage: 'https://errandr.com/og-image.jpg'
})
</script>