<template>
  <div class="space-y-6 h-screen animate-fade-in w-full pb-20 sm:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight mb-1">Notifications</h1>
        <p class="text-gray-500 text-sm">Stay updated on your store's orders and activities.</p>
      </div>
      <button
        v-if="notifications.length > 0 && unreadCount > 0"
        @click="markAllAsRead"
        class="text-sm font-semibold text-parentPrimary hover:underline"
      >
        Mark all as read
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-white rounded-md border border-gray-50 animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="text-center py-20 bg-white rounded-md border border-gray-50">
      <div class="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-2xl mx-auto mb-4">🔔</div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
      <p class="text-sm text-gray-400">When new orders arrive or tracking updates occur, they will appear here.</p>
    </div>

    <!-- Notification List -->
    <div v-else class="space-y-3">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="notif.read ? 'bg-white' : 'bg-blue-50/50 border-blue-100'"
        class="rounded-md border border-gray-50 overflow-hidden transition-all hover: group cursor-pointer"
        @click="handleNotifClick(notif)"
      >
        <div class="p-5 flex items-start gap-4">
          <!-- Icon -->
          <div
            :class="{ 'bg-blue-100/50 text-blue-600': notif.type === 'NEW_ORDER_AVAILABLE', 'bg-emerald-100/50 text-emerald-600': notif.type === 'ORDER_ACCEPTED', 'bg-amber-100/50 text-amber-600': notif.type === 'ORDER_STATUS_UPDATE', 'bg-gray-100 text-gray-600': !['NEW_ORDER_AVAILABLE', 'ORDER_ACCEPTED', 'ORDER_STATUS_UPDATE'].includes(notif.type), }"
            class="w-12 h-12 rounded-md flex items-center justify-center text-xl flex-shrink-0"
          >
            {{ getEmoji(notif.type) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-base font-bold text-gray-900">{{ notif.title }}</h4>
              <div class="flex items-center gap-2 flex-shrink-0 mt-1">
                <span class="text-sm font-bold text-gray-400 whitespace-nowrap">{{ formatTime(notif.createdAt) }}</span>
                <div v-if="!notif.read" class="w-2.5 h-2.5 rounded-md bg-parentPrimary flex-shrink-0" />
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ notif.body }}</p>

            <!-- Action buttons -->
            <div v-if="notif.type === 'NEW_ORDER_AVAILABLE' && !notif.data?.accepted" class="flex gap-3 mt-4">
              <button
                @click.stop="handleNotifClick(notif)"
                class="px-5 py-2 text-sm font-bold text-white bg-parentPrimary rounded-md hover:brightness-110 transition-all"
              >
                View Order
              </button>
              <button
                @click.stop="dismissNotification(notif.id)"
                class="px-5 py-2 text-sm font-semibold text-gray-500 bg-gray-50 rounded-md hover:bg-gray-100 transition-all border border-gray-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()

definePageMeta({
  layout: 'vendor'
})

useHead({ title: 'Notifications - Errander Vendor' })

const {
  notifications,
  unreadCount,
  loading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  dismissNotification,
} = useNotifications()

const getEmoji = (type: string) => ({
  NEW_ORDER_AVAILABLE: '🚀',
  ORDER_ACCEPTED: '✅',
  ORDER_STATUS_UPDATE: '📦',
  NEW_CHAT_MESSAGE: '💬',
}[type] || '🔔')

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleNotifClick = (notif: any) => {
  if (!notif.read) {
    markAsRead(notif.id)
  }
  if (notif.type === 'NEW_CHAT_MESSAGE' && notif.data?.orderId) {
    navigateTo(`/dashboard/chats?orderId=${notif.data.orderId}`)
    return
  }
  // If it's related to an order, navigate to dashboard where they can see it
  if (notif.data?.orderId || notif.type === 'NEW_ORDER_AVAILABLE') {
    navigateTo(`/dashboard/orders`)
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
