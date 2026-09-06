<template>
  <div class="h-[100dvh] w-screen flex bg-[#F0F2F5] overflow-hidden fixed inset-0 z-50">
    <!-- Left Sidebar (WhatsApp Web style) -->
    <div 
      :class="[ 'w-full md:w-[35%] lg:w-[30%] max-w-[420px] min-w-[320px] flex-col bg-white border-r border-gray-200 flex-shrink-0 transition-all', activeChat ? 'hidden md:flex' : 'flex' ]"
    >
      <!-- Header -->
      <div class="h-[60px] px-4 bg-[#008069] flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="p-2 hover:bg-white/10 rounded-md transition-colors text-white" title="Back to Dashboard">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer">
            {{ user ? (user.firstName?.[0] || user.email?.[0] || 'V').toUpperCase() : 'V' }}
          </div>
          <span class="font-semibold text-white text-base truncate">{{ user?.firstName || 'Vendor' }}</span>
        </div>
        <div class="flex items-center gap-4 text-white">
          <MessageSquare class="w-5 h-5 cursor-pointer hover:text-gray-200 transition-colors" />
          <MoreVertical class="w-5 h-5 cursor-pointer hover:text-gray-200 transition-colors" />
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-white">
        <button 
          @click="chatTab = 'orders'" 
          class="flex-1 py-3 text-sm font-semibold text-center transition-colors"
          :class="chatTab === 'orders' ? 'text-[#008069] border-b-2 border-[#008069]' : 'text-gray-500'"
        >
          Orders
        </button>
        <button 
          @click="chatTab = 'direct'" 
          class="flex-1 py-3 text-sm font-semibold text-center transition-colors relative"
          :class="chatTab === 'direct' ? 'text-[#008069] border-b-2 border-[#008069]' : 'text-gray-500'"
        >
          Messages
          <span v-if="totalDirectUnread > 0" class="absolute top-2 right-6 w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold">
            {{ totalDirectUnread }}
          </span>
        </button>
      </div>

      <!-- Search -->
      <div class="p-2 bg-white border-b border-gray-200">
        <div class="bg-[#F0F2F5] rounded-lg flex items-center px-4 py-1.5 transition-all border border-transparent focus-within:bg-white focus-within:border-[#00A884]">
          <Search class="w-4 h-4 text-[#54656F] mr-3" />
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="chatTab === 'orders' ? 'Search order chats' : 'Search messages'" 
            class="bg-transparent border-none outline-none text-[15px] w-full placeholder:text-[#54656F] text-[#111B21] py-1"
          />
        </div>
      </div>

      <!-- Chat List: Orders -->
      <div v-if="chatTab === 'orders'" class="flex-1 overflow-y-auto bg-white">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 animate-pulse rounded-lg" />
        </div>
        <div v-else-if="filteredChats.length === 0" class="flex flex-col items-center justify-center h-full text-[#54656F] space-y-2 p-6 text-center">
          <MessageSquare class="w-12 h-12 opacity-20" />
          <p class="text-[14px]">No active order chats found.</p>
        </div>
        <div v-else class="flex flex-col">
          <button
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="selectChat(chat)"
            class="w-full text-left flex items-center px-3 py-2 hover:bg-[#F5F6F6] transition-colors group"
            :class="{ 'bg-[#F0F2F5]': activeChat?.id === chat.id }"
          >
            <div class="w-12 h-12 rounded-md bg-[#E8F8F5] flex items-center justify-center text-[#008069] font-bold text-lg flex-shrink-0 mr-3">
              {{ getInitials(chat.receiverName) }}
            </div>
            <div class="flex-1 min-w-0 border-b border-gray-100 pb-3 pt-1 group-last:border-none">
              <div class="flex items-center justify-between mb-0.5">
                <h3 class="font-normal text-[#111B21] text-[16px] truncate">{{ chat.receiverName }}</h3>
                <span class="text-[12px] whitespace-nowrap ml-2 text-[#54656F]">{{ formatTime(chat.order.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[14px] text-[#54656F] truncate flex items-center gap-1">
                  <CheckCheck class="w-4 h-4 text-[#34B7F1]" />
                  {{ chat.receiverType }} • Order #{{ chat.order.orderNumber }}
                </p>
                <div v-if="unreadCounts[chat.order._id] > 0" class="w-5 h-5 rounded-md bg-[#25D366] text-white flex items-center justify-center text-[11px] font-bold">
                  {{ unreadCounts[chat.order._id] }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Chat List: Direct Messages -->
      <div v-else class="flex-1 overflow-y-auto bg-white">
        <div v-if="loadingDirect" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 animate-pulse rounded-lg" />
        </div>
        <div v-else-if="filteredDirectChats.length === 0" class="flex flex-col items-center justify-center h-full text-[#54656F] space-y-2 p-6 text-center">
          <MessageSquare class="w-12 h-12 opacity-20" />
          <p class="text-[14px]">No direct messages yet.</p>
          <p class="text-[12px] text-gray-400">Students can message you from your store page.</p>
        </div>
        <div v-else class="flex flex-col">
          <button
            v-for="conv in filteredDirectChats"
            :key="`${conv.user._id}_${conv.service?._id || 'general'}`"
            @click="selectDirectChat(conv)"
            class="w-full text-left flex items-center px-3 py-2 hover:bg-[#F5F6F6] transition-colors group"
            :class="{ 'bg-[#F0F2F5]': activeChat?.id === `direct_${conv.user._id}_${conv.service?._id || 'general'}` }"
          >
            <div class="w-12 h-12 rounded-md bg-[#FFF0E8] flex items-center justify-center text-[#FF5C1A] font-bold text-lg flex-shrink-0 mr-3 overflow-hidden">
              <img v-if="conv.user.avatar" :src="conv.user.avatar" class="w-full h-full object-cover" />
              <span v-else>{{ getInitials(`${conv.user.firstName || ''} ${conv.user.lastName || ''}`) }}</span>
            </div>
            <div class="flex-1 min-w-0 border-b border-gray-100 pb-3 pt-1 group-last:border-none">
              <div class="flex items-center justify-between mb-0.5">
                <h3 class="font-normal text-[#111B21] text-[16px] truncate">
                  {{ conv.user.firstName || 'Student' }} {{ conv.user.lastName || '' }}
                </h3>
                <span class="text-[12px] whitespace-nowrap ml-2 text-[#54656F]">
                  {{ conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : '' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[14px] text-[#54656F] truncate">
                  <span v-if="conv.service" class="font-medium text-[#00a884] mr-1">[{{ conv.service.name }}]</span>
                  {{ conv.lastMessage?.message || conv.lastMessage?.content || 'Start conversation' }}
                </p>
                <div v-if="conv.unreadCount > 0" class="w-5 h-5 rounded-md bg-[#25D366] text-white flex items-center justify-center text-[11px] font-bold">
                  {{ conv.unreadCount }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Area (Chat View) -->
    <div 
      :class="[ 'flex-1 flex-col bg-[#F0F2F5] border-l border-[#E1E1E1] h-full min-h-0 relative overflow-hidden', !activeChat ? 'hidden md:flex' : 'flex' ]"
    >
      <div v-if="!activeChat" class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F0F2F5]">
        <div class="w-80 h-80 mb-8 opacity-20 mx-auto">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="#075E54"/>
            <path d="M70.5 35.5C70.5 35.5 68.5 32 63.5 32C58.5 32 55.5 35.5 55.5 35.5C55.5 35.5 53 38 52 38.5C51 39 48.5 38 46 36.5C43.5 35 42.5 32 42.5 32C42.5 32 44.5 29 42.5 27.5C40.5 26 38.5 23 37.5 23C36.5 23 34.5 24.5 33 26.5C31.5 28.5 30 33 34.5 39C39 45 44.5 50 49 51.5C53.5 53 58.5 53 62.5 51.5C66.5 50 69.5 47 70.5 45C71.5 43 70.5 35.5 70.5 35.5Z" fill="white"/>
          </svg>
        </div>
        <h2 class="text-[32px] font-light text-[#41525D] mb-4">Erranders for Web</h2>
        <p class="text-[14px] text-[#667781] max-w-md leading-relaxed">
          Send and receive messages without keeping your phone online.<br/>
          Use Erranders on up to 4 linked devices and 1 phone at the same time.
        </p>
        <div class="mt-10 flex items-center justify-center gap-1.5 text-[14px] text-[#8696A0]">
          <Lock class="w-3.5 h-3.5" />
          <span>End-to-end encrypted</span>
        </div>
      </div>

      <!-- Order-based Chat -->
      <EmbeddedOrderChat 
        v-else-if="activeChat.chatType === 'order'"
        :key="activeChat.id"
        :is-open="true"
        :order-id="activeChat.order._id"
        :current-user-id="(activeChat.order.vendor?._id || activeChat.order.vendor || '') + ',' + ((user as any)?.id || (user as any)?._id)"
        :receiver-id="activeChat.receiverId"
        :receiver-name="activeChat.receiverName"
        :receiver-avatar="activeChat.avatar"
        :initial-message="(route.query.autoMessage as string)"
        @close="activeChat = null"
      />

      <!-- Direct Message Chat -->
      <EmbeddedDirectChat
        v-else-if="activeChat.chatType === 'direct'"
        :key="activeChat.id"
        :is-open="true"
        :receiver-id="activeChat.receiverId"
        :receiver-name="activeChat.receiverName"
        :receiver-avatar="activeChat.avatar"
        :service-id="activeChat.serviceId"
        :service-name="activeChat.serviceName"
        @close="activeChat = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, ArrowLeft, MessageSquare, MoreVertical, CheckCheck, Lock } from 'lucide-vue-next'
import EmbeddedOrderChat from '@/components/core/EmbeddedOrderChat.vue'
import EmbeddedDirectChat from '@/components/core/EmbeddedDirectChat.vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false
})

const { user } = useUser()
const route = useRoute()

const orders = ref<any[]>([])
const directConversations = ref<any[]>([])
const loading = ref(true)
const loadingDirect = ref(true)
const searchQuery = ref('')
const activeChat = ref<any>(null)
const unreadCounts = ref<Record<string, number>>({})
const chatTab = ref<'orders' | 'direct'>('direct')

import { useSocket } from '@/composables/useSocket'
const { on, connect } = useSocket('chat')

const fetchOrders = async () => {
  loading.value = true
  try {
    const [res, unreadRes] = await Promise.all([
      api.get('/orders/vendor/mine'),
      api.get('/chat/unread/orders').catch(() => ({ data: {} }))
    ])
    
    const responseData = (res as any)?.data?.data || (res as any)?.data || res
    orders.value = Array.isArray(responseData) ? responseData : (responseData?.orders || [])
    
    if (unreadRes && unreadRes.data) {
      unreadCounts.value = unreadRes.data
    }
    
    // Check if route has an orderId to auto-select
    if (route.query.orderId) {
      chatTab.value = 'orders'
      const targetReceiverId = route.query.receiverId;
      const targetChat = chatList.value.find(c => 
        c.order._id === route.query.orderId && 
        (!targetReceiverId ? c.receiverType === 'Customer' : c.receiverId === targetReceiverId)
      )
      if (targetChat) {
        activeChat.value = targetChat
      }
    }
  } catch (e) {
    console.error('Failed to fetch orders for chat', e)
  } finally {
    loading.value = false
  }
}

const fetchDirectConversations = async () => {
  loadingDirect.value = true
  try {
    const res = await api.get('/chat/direct/conversations')
    directConversations.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Failed to fetch direct conversations', e)
  } finally {
    loadingDirect.value = false
  }
}

const totalDirectUnread = computed(() => {
  return directConversations.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
})

const chatList = computed(() => {
  const list: any[] = []
  for (const order of orders.value) {
    if (order.customer) {
      list.push({
        id: `customer_${order._id}`,
        chatType: 'order',
        order: order,
        receiverId: order.customer._id || order.customer,
        receiverName: `${order.customer.firstName || 'Student'} ${order.customer.lastName || ''}`.trim(),
        receiverType: 'Customer',
        avatar: order.customer.avatar
      })
    }
    if (order.errander) {
      list.push({
        id: `errander_${order._id}`,
        chatType: 'order',
        order: order,
        receiverId: order.errander._id || order.errander,
        receiverName: `${order.errander.firstName || 'Rider'} ${order.errander.lastName || ''}`.trim(),
        receiverType: 'Rider',
        avatar: order.errander.avatar
      })
    }
  }
  return list
})

const filteredChats = computed(() => {
  if (!searchQuery.value) return chatList.value
  const q = searchQuery.value.toLowerCase()
  return chatList.value.filter(c => {
    const orderNum = (c.order.orderNumber || '').toLowerCase()
    const rName = (c.receiverName || '').toLowerCase()
    return orderNum.includes(q) || rName.includes(q)
  })
})

const filteredDirectChats = computed(() => {
  if (!searchQuery.value) return directConversations.value
  const q = searchQuery.value.toLowerCase()
  return directConversations.value.filter((c: any) => {
    const name = `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.toLowerCase()
    return name.includes(q)
  })
})

const selectChat = (chat: any) => {
  activeChat.value = chat
  if (chat.order && chat.order._id) {
    unreadCounts.value[chat.order._id] = 0
  }
}

const selectDirectChat = (conv: any) => {
  activeChat.value = {
    id: `direct_${conv.user._id}_${conv.service?._id || 'general'}`,
    chatType: 'direct',
    receiverId: conv.user._id,
    receiverName: `${conv.user.firstName || 'Student'} ${conv.user.lastName || ''}`.trim(),
    avatar: conv.user.avatar || '',
    serviceId: conv.service?._id,
    serviceName: conv.service?.name
  }
  conv.unreadCount = 0
}

const getInitials = (name: string) => {
  if (!name || name === 'undefined') return 'U'
  const cleanName = String(name).trim().replace(/\s+/g, ' ')
  const parts = cleanName.split(' ')
  const f = (parts[0] || '').charAt(0)
  const l = parts.length > 1 ? (parts[1] || '').charAt(0) : ''
  return (f + l).toUpperCase() || 'U'
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchOrders()
  fetchDirectConversations()
  connect()
  
  on('newMessageNotification', (msg: any) => {
    const orderId = msg.order?._id || msg.order || msg.orderId;
    
    // Handle direct message notification
    if (msg.roomType === 'direct' && !msg.appointment && !msg.appointmentId) {
      const senderId = String(msg.senderId || msg.sender?._id || msg.sender || '');
      // If we don't have the direct chat open for this sender, increment unread
      if (!activeChat.value || activeChat.value.receiverId !== senderId) {
        // Refresh direct conversations to pick up the new message
        fetchDirectConversations();
      }
      return;
    }

    // Handle order notification
    if (orderId) {
      if (!activeChat.value || activeChat.value.order?._id !== orderId) {
        unreadCounts.value[orderId] = (unreadCounts.value[orderId] || 0) + 1;
      }
    }
  })
})
</script>

