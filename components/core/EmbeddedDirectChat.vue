<template>
  <div v-if="isOpen" class="w-full h-full flex flex-col font-sans relative overflow-hidden bg-[#E5DDD5] min-h-0">
    <div class="w-full h-full flex flex-col bg-[#FDFBF7] min-h-0">
      <!-- Header -->
      <div class="px-4 py-2.5 bg-[#FF5C1A] text-white flex items-center gap-4 sticky top-0 z-20 shadow-sm flex-shrink-0">
        <button @click="$emit('close')" class="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors">
          <ArrowLeft class="w-5 h-5 text-white" />
        </button>
        <div class="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden cursor-pointer">
          <img v-if="receiverAvatar" :src="receiverAvatar" class="w-full h-full object-cover" />
          <User v-else class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-[16px] font-medium truncate leading-tight text-white">{{ receiverName || 'Direct Message' }}</h3>
          <p class="text-[13px] text-white/80 font-normal truncate">
            <span v-if="serviceName">Enquiry: {{ serviceName }}</span>
            <span v-else-if="isTyping" class="text-emerald-200 italic">typing...</span>
            <span v-else>Direct Message</span>
          </p>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-6 space-y-[2px] scroll-smooth bg-[#FDFBF7]">
        <!-- Date chip -->
        <div class="flex justify-center mb-6 sticky top-2 z-10">
          <span class="px-3 py-1 bg-white border border-[#FF5C1A]/10 text-[#FF5C1A] text-[11px] font-bold rounded-full shadow-sm">
            Direct Message
          </span>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center h-40 space-y-4">
          <div class="w-8 h-8 border-2 border-[#25D366]/20 border-t-[#25D366] rounded-md animate-spin" />
        </div>

        <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-10">
          <div class="p-5 bg-white rounded-md">
            <p class="text-[12px] text-gray-500 font-medium leading-relaxed">
              🔒 Messages are end-to-end encrypted. No one outside of this chat, not even Errandr, can read them.
            </p>
          </div>
        </div>

        <template v-else>
          <div v-for="msg in messages" :key="msg._id">
            <div
              class="flex mb-1"
              :class="isMine(msg) ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[75%] px-3 py-2 rounded-lg relative text-sm leading-relaxed"
                :class="isMine(msg) 
                  ? 'bg-[#FFF3ED] text-[#14110F] rounded-tr-none border border-[#FF5C1A]/10' 
                  : 'bg-white text-[#14110F] rounded-tl-none border border-gray-100'"
              >
                <div class="break-words pr-14 whitespace-pre-wrap">{{ msg.message || msg.content }}</div>
                <span class="text-[10px] text-gray-400 absolute bottom-1.5 right-2.5 flex items-center gap-0.5 font-medium">
                  {{ formatTime(msg.createdAt) }}
                  <CheckCheck v-if="isMine(msg)" class="w-3 h-3" :class="msg.isRead ? 'text-[#34B7F1]' : 'text-gray-300'" />
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input -->
      <div class="px-3 py-2 bg-[#F0F0F0] border-t border-gray-200 flex items-end gap-2 flex-shrink-0">
        <div class="flex-1 bg-white rounded-2xl flex items-end overflow-hidden border border-gray-100 shadow-sm">
          <textarea
            v-model="newMessage"
            rows="1"
            placeholder="Type a message"
            class="w-full bg-transparent border-0 px-4 py-3 text-[15px] focus:outline-none resize-none max-h-32 text-gray-800 placeholder-gray-400"
            @keydown.enter.exact.prevent="submitMessage"
            ref="inputRef"
            @input="adjustHeight"
          ></textarea>
        </div>
        <button 
          @click.prevent="submitMessage"
          :disabled="!newMessage.trim()"
          class="w-11 h-11 bg-[#FF5C1A] text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#e55317] disabled:opacity-40 transition-colors active:scale-95"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { ArrowLeft, Send, User, CheckCheck } from 'lucide-vue-next';
import { useDirectChat } from '@/composables/useDirectChat';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps<{
  isOpen: boolean;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  serviceId?: string;
  serviceName?: string;
}>();

const emit = defineEmits(['close']);

const { user } = useUser();
const currentUserId = computed(() => (user.value as any)?._id || (user.value as any)?.id || '');

const newMessage = ref('');
const inputRef = ref<HTMLTextAreaElement | null>(null);
const messageContainer = ref<HTMLElement | null>(null);

let chatTracker: ReturnType<typeof useDirectChat> | null = null;
const messages = ref<any[]>([]);
const loading = ref(false);
const isTyping = ref(false);

const isMine = (msg: any) => {
  const senderId = String(msg.senderId || msg.sender?._id || msg.sender || '');
  return senderId === String(currentUserId.value);
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const adjustHeight = () => {
  const el = inputRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  }
};

const submitMessage = () => {
  if (!newMessage.value.trim() || !chatTracker) return;
  const text = newMessage.value.trim();
  
  chatTracker.sendMessage(text);
  newMessage.value = '';
  if (inputRef.value) inputRef.value.style.height = 'auto';
  scrollToBottom();
};

const initChat = async () => {
  if (!currentUserId.value || !props.receiverId) return;
  loading.value = true;
  chatTracker = useDirectChat(currentUserId.value, props.receiverId, props.serviceId);
  chatTracker.setupListeners();
  await chatTracker.fetchMessages();
  messages.value = chatTracker.messages.value;
  loading.value = false;
  scrollToBottom();
  await nextTick();
  inputRef.value?.focus();
};

watch(() => chatTracker?.messages?.value, (newVal) => {
  if (newVal) {
    messages.value = newVal;
    scrollToBottom();
  }
}, { deep: true });

watch(() => chatTracker?.isTyping?.value, (val) => {
  isTyping.value = !!val;
});

watch(() => messages.value.length, () => scrollToBottom());

watch(() => props.isOpen, async (val) => {
  if (val) await initChat();
}, { immediate: true });
</script>
