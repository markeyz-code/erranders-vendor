import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useSocket } from '@/composables/useSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { refreshNuxtData } from '#app'

const LISTENERS_KEY = 'realtime_notification_listeners'

/**
 * Unread chat messages, shared across the app.
 *
 * A toast for every incoming message stacked up on busy chats, and a toast is the wrong
 * shape for "there are messages waiting" anyway — it disappears. A dot on the bell stays
 * until the messages are read.
 */
const unreadChatCount = ref(0)

export const useUnreadChat = () => {
  const clear = () => { unreadChatCount.value = 0 }
  return { unreadChatCount, clear }
}

const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.wav')
    audio.play().catch(e => console.warn('Audio playback failed', e))
  } catch (error) {
    // ignore
  }
}

export const useRealtimeNotifications = () => {
  const { showToast } = useCustomToast()
  const { socket, connectSocket } = useRealtimeSocket()
  const { connect: connectChat, on: onChat, off: offChat } = useSocket('chat')
  const { addNotification } = useNotifications()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)

  const handleNotification = (payload: any) => {
    if (!payload) return

    playNotificationSound()
    addNotification({
      id: payload.id || `notif_${Date.now()}`,
      ...payload
    })

    showToast({
      title: payload.title || 'Notification',
      message: payload.message || payload.body || payload.type || 'You have a new update',
      toastType: payload.priority === 'high' || payload.type === 'NEW_CHAT_MESSAGE' ? 'warning' : 'info',
      duration: 5000,
      action: payload.type === 'NEW_CHAT_MESSAGE' && payload.data?.orderId ? () => {
        const router = useRouter()
        if (router) {
          router.push(`/orders/${payload.data.orderId}?openChat=${payload.data.senderId || 'true'}`)
        } else {
          window.location.href = `/orders/${payload.data.orderId}?openChat=${payload.data.senderId || 'true'}`
        }
      } : undefined
    })
    
    // Silent internal page refresh to update data
    refreshNuxtData()
  }

  const handleAudit = (payload: any) => {
    if (!payload) return

    showToast({
      title: payload.action ? `Audit: ${payload.action}` : 'Audit Update',
      message: payload.description || 'A new audit log was recorded',
      toastType: 'info',
      duration: 5000,
    })
  }

  const handleOrderStatusUpdate = (payload: any) => {
    if (!payload) return

    playNotificationSound()
    addNotification({
      id: payload.id || `status_${Date.now()}`,
      title: 'Order Update',
      body: `Order #${payload.orderNumber} status changed`,
      ...payload
    })

    showToast({
      title: '📦 Order Update',
      message: `Order #${payload.orderNumber} status changed to ${payload.status?.replace(/_/g, ' ')}`,
      toastType: 'info',
      duration: 6000,
    })
  }

  onMounted(() => {
    connectSocket()

    if (listenersAttached.value || !socket.value) return
    listenersAttached.value = true

    socket.value.on('notification:new', handleNotification)
    socket.value.on('notification:new-order', handleNotification)
    socket.value.on('audit:log', handleAudit)
    socket.value.on('notification:order-status-update', handleOrderStatusUpdate)
    
    // Add global chat listener
    const chatSocket = connectChat()
    onChat('newMessageNotification', (payload: any) => {
      // A dot on the bell instead of a toast.
      //
      // The toast fired for every message, so an active chat produced a stack of them and
      // they covered the screen. The counter survives until the chat is opened.
      playNotificationSound()

      // Sitting in the chat already means they are reading it, not that they missed it.
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard/chats')) {
        return
      }
      unreadChatCount.value += 1
    })
  })

  onBeforeUnmount(() => {
    if (!socket.value || !listenersAttached.value) return

    socket.value.off('notification:new', handleNotification)
    socket.value.off('notification:new-order', handleNotification)
    socket.value.off('audit:log', handleAudit)
    socket.value.off('notification:order-status-update', handleOrderStatusUpdate)
    
    offChat('newMessageNotification')
    listenersAttached.value = false
  })
}
