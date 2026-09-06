import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useSocket } from '@/composables/useSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { refreshNuxtData } from '#app'

const LISTENERS_KEY = 'realtime_notification_listeners'

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

    playNotificationSound()

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
      // Don't toast if we're already on the chat page with this user open,
      // but a global toast is usually fine and helpful.
      playNotificationSound()
      showToast({
        title: `New Message from ${payload.sender?.firstName || 'Customer'}`,
        message: payload.content || payload.message || 'You received a message',
        toastType: 'info',
        duration: 5000,
        action: () => {
          const router = useRouter()
          if (router) {
            router.push('/dashboard/chats')
          } else {
            window.location.href = '/dashboard/chats'
          }
        }
      })
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
