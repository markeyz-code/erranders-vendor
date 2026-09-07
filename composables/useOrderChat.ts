import { ref, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

export interface Message {
  _id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType?: 'text' | 'image' | 'voice';
  attachment?: string;
  sender?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  replyTo?: {
    _id: string;
    message: string;
    messageType?: string;
    attachment?: string;
    sender?: any;
  };
  createdAt: string;
}

export const useOrderChat = (
  orderIdArg: MaybeRefOrGetter<string>,
  currentUserIdArg?: MaybeRefOrGetter<string | undefined>,
  targetUserIdArg?: MaybeRefOrGetter<string | undefined>
) => {
  const { connect, emit, on, off, getSocket } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  // We store our listener references so we can clean them up properly
  let newMessageHandler: ((message: any) => void) | null = null;
  let userTypingHandler: ((data: any) => void) | null = null;

  const fetchMessages = async () => {
    loading.value = true;
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);
    try {
      let url = `/chat/order/${orderId}`;
      if (currentUserId && targetUserId) {
        const cleanCurrent = extractObjectId(currentUserId);
        const cleanTarget = extractObjectId(targetUserId);
        url += `?userA=${cleanCurrent}&userB=${cleanTarget}`;
      }
      const res = await api.get(url);
      messages.value = Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      loading.value = false;
    }
  };

  const extractObjectId = (str: string) => {
    if (!str) return '';
    const parts = String(str).split(',');
    for (const p of parts) {
      const t = p.trim();
      if (/^[0-9a-fA-F]{24}$/.test(t)) return t;
    }
    return String(str).split(',')[0]?.trim() || '';
  };

  const sendMessage = (text: string, receiverId: string, senderId: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string, replyTo?: string) => {
    const orderId = toValue(orderIdArg);
    const cleanSenderId = extractObjectId(senderId);
    const cleanReceiverId = extractObjectId(receiverId);
    
    const tempMsg = {
      _id: Date.now().toString(),
      orderId,
      senderId: cleanSenderId,
      receiverId: cleanReceiverId,
      message: text,
      content: text,
      messageType: type,
      attachment,
      replyTo,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    messages.value.push(tempMsg as any);

    const payload: any = {
      orderId,
      senderId: cleanSenderId,
      message: text,
      messageType: type,
      attachment,
      replyTo
    };

    if (cleanReceiverId === 'admin_support_channel') {
      payload.roomType = 'support';
      // Do not include receiverId so backend doesn't crash parsing it as ObjectId
    } else {
      payload.receiverId = cleanReceiverId;
    }

    emit('sendMessage', payload);
  };

  const sendTyping = (userId: string) => {
    const orderId = toValue(orderIdArg);
    emit('typing', { orderId, userId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { orderId, userId });
    }, 2000);
  };

  const cleanupListeners = () => {
    if (newMessageHandler) {
      off('newMessage', newMessageHandler);
      newMessageHandler = null;
    }
    if (userTypingHandler) {
      off('userTyping', userTypingHandler);
      userTypingHandler = null;
    }
  };

  const setupListeners = () => {
    // Always ensure connected
    connect();

    const sock = getSocket();
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);

    // Compute a deterministic pairKey for this conversation
    let pairKey: string | undefined;
    if (currentUserId && targetUserId) {
      const cleanCurrent = extractObjectId(currentUserId);
      const cleanTarget = extractObjectId(targetUserId);
      const ids = [cleanCurrent, cleanTarget].sort();
      pairKey = `${ids[0]}_${ids[1]}`;
    }

    // Join the pair-specific order room
    emit('joinOrder', { orderId, pairKey });

    // Also re-join on reconnect
    if (sock) {
      sock.off('connect.orderChat.' + orderId); // remove old if any
      const reconnectHandler = () => {
        console.log(`[useOrderChat] Reconnected, rejoining order:${orderId}`);
        emit('joinOrder', { orderId: toValue(orderIdArg), pairKey });
      };
      sock.on('connect', reconnectHandler);
    }

    // Mark as read when chat is opened
    if (currentUserId) {
      emit('markRead', { orderId, userId: currentUserId });
    }

    // Clean up old listeners before adding new ones
    cleanupListeners();

    // Create the newMessage handler
    newMessageHandler = (message: any) => {
      const orderId = toValue(orderIdArg);
      const currentUserId = toValue(currentUserIdArg);

      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      
      if (msgOrderId === String(orderId)) {
        if (currentUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());

          if (cIds.includes(sId)) {
            // It's our own message, check for pending optimistic update
            const pendingIdx = messages.value.findIndex(m => m.status === 'pending' && m.message === message.message && (m.messageType || 'text') === (message.messageType || 'text'));
            if (pendingIdx !== -1) {
              messages.value[pendingIdx] = message;
              return;
            }
          }
        }

        // Strict deduplication by _id
        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }

        // Mark as read
        if (currentUserId) {
          emit('markRead', { orderId, userId: currentUserId });
        }
      }
    };

    // Create the userTyping handler
    userTypingHandler = (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    };

    on('newMessage', newMessageHandler);
    on('userTyping', userTypingHandler);
  };

  onUnmounted(() => {
    cleanupListeners();
    emit('leaveOrder', { orderId: toValue(orderIdArg) });
  });

  return {
    messages,
    loading,
    isTyping,
    fetchMessages,
    sendMessage,
    sendTyping,
    setupListeners
  };
};
