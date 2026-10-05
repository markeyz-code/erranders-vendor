<template>
 <div class="py-5 pb-10 continue mx-auto animate-fade-in space-y-6 w-full">
 <!-- Header -->
 <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
 <div>
 <h1 class="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">Active Orders</h1>
 <p class="text-sm text-gray-400 font-medium mt-1 flex items-center gap-2">
 Monitor and fulfill your active campus orders. 
 <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-sm font-bold bg-amber-50 text-amber-600 whitespace-nowrap shrink-0">
 {{ pendingOrdersCount }} Pending
 </span>
 </p>
 </div>
 </header>
 
 <!-- Toolbar -->
 <div class="flex flex-col sm:flex-row items-center gap-4 mb-5">
 <div class="relative w-full sm:w-80">
 <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Find order or customer..." 
 class="w-full py-2.5 pl-10 pr-10 border border-gray-25 rounded-xl text-[13px] font-medium text-gray-900 bg-white outline-none transition-all focus:border-gray-25focus:ring-1 focus:ring-gray-900"
 />
 <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
 <X class="w-3.5 h-3.5" />
 </button>
 </div>

 <div class="flex gap-1.5 overflow-x-auto w-full sm:flex-1 no-scrollbar pb-2 sm:pb-0">
 <button
 v-for="filter in statusFilters"
 :key="filter.key"
 @click="activeFilter = filter.key"
 class="shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all"
 :class="activeFilter === filter.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700'"
 >
 {{ filter.label }}
 </button>
 </div>
 </div>

 <!-- Orders Table -->
 <div class="bg-white rounded-2xl border border-gray-25 shadow-sm overflow-hidden min-h-[500px]">
 <UiTable 
 :columns="orderColumns" 
 :items="filteredOrders" 
 :loading="loading"
 empty-title="No orders found"
 empty-subtitle="Orders will appear here once students place them."
 :has-actions="true"
 @row-click="selectedOrder = $event">
 <template #orderId="{ item }">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-sm shrink-0">
 {{ (item as any).status === 'pending' ? '🔔' : statusEmoji((item as any).status) }}
 </div>
 <span class="font-bold text-gray-900 text-sm tracking-tight">#{{ (item as any).orderNumber }}</span>
 </div>
 </template>

 <template #customer="{ item }">
 <div>
 <p class="font-bold text-gray-900 text-sm">{{ (item as any).customer?.firstName }} {{ (item as any).customer?.lastName }}</p>
 <p class="text-sm text-gray-400 font-bold">{{ (item as any).items?.length || 0 }} Items</p>
 </div>
 </template>

 <template #total="{ item }">
 <span class="font-bold text-gray-900">₦{{ getVendorEarnings(item as any).toLocaleString() }}</span>
 </template>

 <template #status="{ item }">
 <span :class="getStatusBadge((item as any).status)" class="text-xs font-bold px-2.5 py-1 rounded-lg inline-block">
 {{ formatStatus((item as any).status) }}
 </span>
 </template>

 <template #time="{ item }">
 <span class="text-sm font-bold text-gray-400">{{ timeAgo((item as any).createdAt) }}</span>
 </template>

 <template #actions="{ item }">
 <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300 hover:text-gray-900" @click.stop="selectedOrder = item">
 <ChevronRight class="w-4 h-4" />
 </button>
 </template>
 </UiTable>
 </div>

 <!-- Order Detail Drawer -->
 <SideDrawer 
 :isOpen="!!selectedOrder" 
 :title="'Order Details'"
 :subtitle="selectedOrder ? `#${selectedOrder.orderNumber}` : ''"
 @close="selectedOrder = null"
 >
 <template v-if="selectedOrder">
 <div class="space-y-4 md:space-y-6 py-2">
 <!-- Status Overview -->
 <div class="flex flex-col items-center py-6 bg-gray-50 rounded-2xl border border-transparent">
 <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
 {{ statusEmoji(selectedOrder.status) }}
 </div>
 <p class="text-sm text-gray-500 font-medium mb-1">Current Status</p>
 <span :class="getStatusBadge(selectedOrder.status)" class="text-sm font-bold px-4 py-1.5 rounded-xl bg-white ">
 {{ formatStatus(selectedOrder.status) }}
 </span>
 </div>

 <!-- Items List -->
 <div class="space-y-4">
 <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Order Items</h4>
 <div class="space-y-3">
 <div v-for="group in groupedOrderItems" :key="group.name" class="space-y-3">
 <h5 v-if="group.name !== 'Other Items' || groupedOrderItems.length > 1" class="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1 mt-4">{{ group.name }}</h5>
 <div v-for="item in group.items" :key="item._id || item.name" class="p-4 bg-white border border-gray-50 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] space-y-3">
 <!-- Item Header -->
 <div class="flex items-start justify-between">
 <div class="flex items-center gap-3">
 <span class="w-9 h-9 bg-orange-100 text-[#FF5C1A] rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
 {{ item.quantity }}x
 </span>
 <div>
 <p class="text-base font-bold text-gray-900">{{ item.name }}</p>
 <p class="text-xs text-gray-500 font-medium mt-0.5">Base Price: ₦{{ getOriginalPrice(item.price, selectedOrder)?.toLocaleString() }}</p>
 </div>
 </div>
 <span class="text-base font-extrabold text-gray-900">
 ₦{{ getOriginalPrice(item.subtotal || (item.price * item.quantity), selectedOrder).toLocaleString() }}
 </span>
 </div>

 <!-- Customizations / Extras Section -->
 <div v-if="item.customizations?.length" class="p-3 bg-orange-50/50 rounded-lg border border-orange-100/50 space-y-2">
 <p class="text-[10px] font-bold tracking-wider text-[#FF5C1A] uppercase flex items-center gap-1">
 <Sparkles class="w-3.5 h-3.5 animate-pulse" /> REQUIRED ADD-ONS / CUSTOMIZATIONS
 </p>
 <div class="grid grid-cols-1 gap-1.5">
 <div v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-md border border-orange-100 shadow-2xs">
 <span class="font-extrabold text-gray-800 flex items-center gap-1.5">
 <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A]"></span>
 {{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ getCustomizationLabel(c) }}
 </span>
 <span v-if="c.price > 0" class="text-xs font-bold text-[#FF5C1A]">
 +₦{{ getOriginalPrice(c.price, selectedOrder).toLocaleString() }}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Vendor Note -->
 <div v-if="selectedOrder.vendorNote" class="p-4 bg-amber-50/50 border border-amber-100 rounded-md">
 <div class="flex gap-2">
 <MessageSquare class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
 <div>
 <p class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Customer Instruction</p>
 <p class="text-sm font-medium text-amber-900 leading-relaxed">{{ selectedOrder.vendorNote }}</p>
 </div>
 </div>
 </div>

 <!-- Total Summary -->
 <div class="p-5 bg-gray-900 rounded-2xl text-white relative overflow-hidden group ">
 <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FF5C1A]/20 rounded-2xl blur-3xl" />
 <div class="relative z-10 flex justify-between items-end">
 <div>
 <p class="text-sm font-bold text-white/40 mb-1">Total Payout</p>
 <h3 class="text-2xl font-bold tracking-tight">₦{{ getVendorEarnings(selectedOrder).toLocaleString() }}</h3>
 </div>
 </div>
 </div>

 <div class="p-5 bg-gray-50 rounded-2xl border border-transparent flex flex-col gap-4">
 <div class="flex items-center gap-4">
 <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[#FF5C1A] ">
 {{ selectedOrder.customer?.firstName?.[0] }}{{ selectedOrder.customer?.lastName?.[0] }}
 </div>
 <div class="flex-1">
 <p class="text-sm font-bold text-gray-900">{{ selectedOrder.customer?.firstName }} {{ selectedOrder.customer?.lastName }}</p>
 <p class="text-sm text-gray-500 font-medium">Ordered {{ timeAgo(selectedOrder.createdAt) }}</p>
 </div>
 <div class="flex flex-col gap-2">
 <a v-if="selectedOrder.customer.phone" :href="getWhatsAppLink(selectedOrder.customer.phone, 'customer')" target="_blank" class="flex-1 px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-lg text-xs font-bold hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-1.5">
   <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
   </svg>
   WhatsApp
 </a>
 <button 
 @click="pingParticipant(selectedOrder._id, 'customer')"
 class="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-600 hover:text-white transition-all border border-yellow-100 flex items-center justify-center gap-1.5 font-bold text-xs"
 >
 <Bell class="w-3.5 h-3.5" />
 <span>Ping</span>
 </button>
 <button 
 @click="openChat(selectedOrder.customer?._id, selectedOrder.customer?.firstName + ' ' + selectedOrder.customer?.lastName, selectedOrder.customer?.avatar)"
 class="px-3 py-1.5 bg-[#FF5C1A]/10 text-[#FF5C1A] rounded-xl hover:bg-[#FF5C1A] hover:text-white transition-all border border-[#FF5C1A]/20 flex items-center justify-center gap-1.5 font-bold text-xs"
 >
 <MessageSquare class="w-3.5 h-3.5" />
 <span>In-App Chat</span>
 </button>
 </div>
 </div>
 
 <div v-if="selectedOrder.errander" class="pt-4 border-t border-gray-50 flex items-center gap-4">
 <div class="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">
 {{ selectedOrder.errander?.firstName?.[0] }}
 </div>
 <div class="flex-1">
 <p class="text-sm font-bold text-gray-900">{{ selectedOrder.errander?.firstName }} (Rider)</p>
 <p class="text-sm text-gray-400 font-medium">Assigned Delivery Agent</p>
 </div>
 <div class="flex flex-col gap-2">
 <a v-if="selectedOrder.errander.phone" :href="getWhatsAppLink(selectedOrder.errander.phone, 'rider')" target="_blank" class="px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-lg text-xs font-bold hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-1.5">
   <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
   </svg>
   WhatsApp
 </a>
 <button 
 @click="pingParticipant(selectedOrder._id, 'errander')"
 class="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition-all border border-yellow-100 flex items-center justify-center gap-1.5 font-bold text-xs"
 >
 <Bell class="w-3.5 h-3.5" />
 <span>Ping</span>
 </button>
 <button 
 @click="openChat(selectedOrder.errander?._id, selectedOrder.errander?.firstName + ' (Rider)', selectedOrder.errander?.avatar)"
 class="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center justify-center gap-1.5 font-bold text-xs"
 >
 <MessageSquare class="w-3.5 h-3.5" />
 <span>In-App Chat</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </template>

 <template #footer>
 <div v-if="selectedOrder" class="flex flex-col gap-3 w-full">
 <button 
 v-if="['pending', 'confirmed'].includes(selectedOrder.status)" 
 @click="updateStatus(selectedOrder._id, 'preparing')" 
 :disabled="updatingOrderId === selectedOrder._id"
 class="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 <component :is="updatingOrderId === selectedOrder._id ? 'Loader2' : 'Clock'" :class="[updatingOrderId === selectedOrder._id ? 'animate-spin' : '', 'w-4 h-4']" />
 {{ updatingOrderId === selectedOrder._id ? 'UPDATING...' : 'START PREPARING' }}
 </button>
 <button 
 v-if="selectedOrder.status === 'preparing'" 
 @click="updateStatus(selectedOrder._id, 'ready_for_pickup')" 
 :disabled="updatingOrderId === selectedOrder._id"
 class="w-full py-2 bg-[#FF5C1A] text-white rounded-md text-sm font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 <component :is="updatingOrderId === selectedOrder._id ? 'Loader2' : 'Package'" :class="[updatingOrderId === selectedOrder._id ? 'animate-spin' : '', 'w-4 h-4']" />
 {{ updatingOrderId === selectedOrder._id ? 'UPDATING...' : 'READY FOR PICKUP' }}
 </button>
 
 <button @click="selectedOrder = null" class="w-full py-2 bg-white border border-gray-50 text-gray-400 text-sm font-medium rounded-md hover:bg-gray-50 transition-all">
 Close Details
 </button>
 </div>
 </template>
 </SideDrawer>
 <!-- Order Chat Side Drawer -->
 <OrderChat
 :is-open="chatState.isOpen"
 :order-id="chatState.orderId"
 :current-user-id="chatState.currentUserId"
 :receiver-id="chatState.receiverId"
 :receiver-name="chatState.receiverName"
 :receiver-avatar="chatState.receiverAvatar"
 :initial-message="chatState.initialMessage"
 @close="chatState.isOpen = false"
 />
 </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, ChevronRight, Clock, Package, Star, ArrowRight, MessageSquare, Loader2, Sparkles, X, Bell } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import UiTable from '@/components/ui/UiTable.vue';
import OrderChat from '@/components/core/OrderChat.vue';
import { useUser } from '@/composables/modules/auth/user';
import { useSocket } from "@/composables/useSocket";
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness';
import { useRouter } from 'vue-router';
import { useCustomToast } from "@/composables/core/useCustomToast";

const { user } = useUser();
const { showToast } = useCustomToast();
const { cachedBusiness } = useGetBusiness();
const router = useRouter();

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Orders - Errander Vendor' });

const loading = ref(true);
const orders = ref<any[]>([]);
const activeFilter = ref('all');
const searchQuery = ref('');
const selectedOrder = ref<any>(null);

const groupedOrderItems = computed(() => {
  if (!selectedOrder.value?.items) return [];
  
  const packMap = new Map<string, any[]>();
  const categoryMap = new Map<string, any[]>();
  
  selectedOrder.value.items.forEach((item: any) => {
    if (item.packId) {
      if (!packMap.has(item.packId)) packMap.set(item.packId, []);
      packMap.get(item.packId)!.push(item);
    } else {
      const cat = item.category || 'Meals';
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(item);
    }
  });
  
  const result = [];
  let packCounter = 1;
  
  for (const [packId, items] of packMap.entries()) {
    const name = packId.toLowerCase().includes('pack') ? packId : `Pack ${packCounter++}`;
    result.push({ name, items, isPack: true });
  }
  
  for (const [cat, items] of categoryMap.entries()) {
    result.push({ name: cat, items, isPack: false });
  }
  
  return result;
});

const isChatOpen = ref(false);
const chatReceiverId = ref('');
const pendingOrdersCount = computed(() => orders.value.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length);
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');
const updatingOrderId = ref<string | null>(null);

const getOriginalPrice = (price: number, orderItem?: any) => {
 const pct = orderItem?.foodMarkupPercentage ?? 5;
 const factor = 1 + (pct / 100);
 return Math.round((price || 0) / factor);
};

const getVendorEarnings = (orderItem: any) => {
 if (!orderItem || orderItem.type === 'custom_errand') return 0;
 // Use proper null check — vendorShare of 0 should NOT trigger fallback
 if (orderItem.vendorShare != null && orderItem.vendorShare > 0) {
 return orderItem.vendorShare;
 }
 const pct = orderItem.foodMarkupPercentage ?? 5;
 const factor = 1 + (pct / 100);
 const vendorSubtotal = Math.round((orderItem.subtotal || 0) / factor);
 const vendorPackaging = orderItem.packagingFee || 0; // Packaging fee has no markup
 return vendorSubtotal + vendorPackaging;
};

const getGroupedCustomizations = (customizations: any[]) => {
 if (!customizations) return [];
 const grouped: Record<string, any> = {};
 customizations.forEach(c => {
 if (grouped[c.name]) {
 grouped[c.name].quantity += 1;
 grouped[c.name].price += c.price;
 } else {
 grouped[c.name] = { ...c, quantity: 1 };
 }
 });
 return Object.values(grouped);
};

const getCustomizationLabel = (c: any) => {
 if (c.selected && c.selected !== c.name && !['add-on', 'add-ons', 'extra', 'extras', 'customization', 'customizations'].includes(c.selected.toLowerCase())) {
 return `${c.selected}: ${c.name}`;
 }
 return c.name;
};

const chatState = ref({
 isOpen: false,
 receiverId: '',
 receiverName: '',
 receiverAvatar: '',
 orderId: '',
 currentUserId: '',
 initialMessage: ''
});

const isPinging = ref<string | null>(null);
const pingParticipant = async (orderId: string, target: 'customer' | 'errander') => {
  if (isPinging.value) return;
  isPinging.value = target;
  try {
    const res = await api.post(`/orders/${orderId}/ping`, {
      target,
      message: 'Please check the app for an update regarding your order.'
    });
    // you could show a success toast here
    showToast({
      title: 'Success',
      message: `Successfully pinged the ${target}!`,
      toastType: 'success',
      duration: 3000
    });
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to ping participant. They may have notifications disabled or you are pinging too fast.';
    showToast({
      title: 'Error',
      message: msg,
      toastType: 'error',
      duration: 3000
    });
  } finally {
    isPinging.value = null;
  }
};

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
 if (!receiverId || !selectedOrder.value) return;
 chatState.value = {
 isOpen: true,
 receiverId,
 receiverName: name,
 receiverAvatar: avatar || '',
 orderId: selectedOrder.value._id,
 currentUserId: (selectedOrder.value.vendor?._id || selectedOrder.value.vendor || '') + ',' + ((user as any)?.id || (user as any)?._id),
 initialMessage: `Hello ${name.split(' ')[0]}! Thanks for your order #${selectedOrder.value.orderNumber}. We're currently processing it. Let us know if you need any adjustments!`
 };
 selectedOrder.value = null; // Close Order Details Drawer
};

const getWhatsAppLink = (phone: string, type: 'customer' | 'rider') => {
  if (!phone || !selectedOrder.value) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '234');
  const order = selectedOrder.value;
  
  let message = '';
  const storeName = order.vendor?.storeName || 'the store';
  
  if (type === 'customer') {
    const total = getVendorEarnings(order) + (order.packagingFee || 0);
    const itemsList = order.items?.map((i: any) => `- ${i.quantity}x ${i.name || i.product?.name || i.food?.name || 'Item'} (₦${i.price})`).join('\n') || '';
    message = `Hello ${order.customer?.firstName}, I am the vendor (${storeName}) for your order #${order.orderNumber}.

*Order Details:*
${itemsList}

*Total:* ₦${total}
*Status:* ${formatStatus(order.status)}

If you have any specific instructions or questions, please let me know here.`;
  } else if (type === 'rider') {
    message = `Hello ${order.errander?.firstName}, I am the vendor (${storeName}) for order #${order.orderNumber}.

The order contains ${order.items?.length || 0} item(s) and is currently *${formatStatus(order.status)}*.

*Pickup Address:* ${order.vendor?.address || 'Store Address'}

Please let me know your estimated arrival time.`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

const orderColumns = [
 { key: 'orderId', label: 'Reference' },
 { key: 'customer', label: 'Customer' },
 { key: 'total', label: 'Total' },
 { key: 'status', label: 'Status' },
 { key: 'time', label: 'Ordered' }
];

const statusFilters = [
 { key: 'all', label: 'All Orders' },
 { key: 'confirmed', label: 'Incoming' },
 { key: 'preparing', label: 'In Kitchen' },
 { key: 'ready_for_pickup', label: 'Ready' },
 { key: 'delivered', label: 'Delivered' },
];

const filteredOrders = computed(() => {
 let list = orders.value;
 if (activeFilter.value !== 'all') {
 list = list.filter((o) => o.status === activeFilter.value);
 }
 if (searchQuery.value) {
 const q = searchQuery.value.toLowerCase();
 list = list.filter(o => 
 o.orderNumber?.toLowerCase().includes(q) ||
 o.customer?.firstName?.toLowerCase().includes(q) ||
 o.customer?.lastName?.toLowerCase().includes(q)
 );
 }
 return list;
});

const formatStatus = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const statusEmoji = (status: string) => {
 const map: Record<string, string> = {
 pending: '🔔', confirmed: '✅', preparing: '👨‍🍳', ready_for_pickup: '📦',
 picked_up: '🏃', in_transit: '🚀', delivered: '🎉', cancelled: '❌',
 };
 return map[status] || '📋';
};

const getStatusBadge = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
 if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
 return 'bg-gray-50 text-gray-400';
}

const timeAgo = (date: string) => {
 const diff = Date.now() - new Date(date).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 60) return `${mins}m ago`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 return `${Math.floor(hrs / 24)}d ago`;
};

const updateStatus = async (orderId: string, status: string) => {
 try {
 updatingOrderId.value = orderId;
 await api.put(`/orders/${orderId}/status`, { status });
 await loadOrders();
 if (selectedOrder.value?._id === orderId) {
 selectedOrder.value = null;
 }
 } catch (e) { console.error('Status sync failed:', e); }
 finally { updatingOrderId.value = null; }
};

const loadOrders = async () => {
  try {
    const res = await api.get<any>('/orders/vendor/mine');
    // Double-check filter on frontend to ensure negotiating orders never show up
    orders.value = (res.data.orders || []).filter((o: any) => o.status !== 'negotiating');
  } catch (e) { console.error('Order sync failed:', e); }
  finally { loading.value = false; }
};

const { connect, on, emit } = useSocket('realtime');
onMounted(async () => {
 await loadOrders();
 const sock = connect();
 // Explicitly register user with the realtime gateway for targeted notifications
 if (user.value?._id) {
 emit('register', { userId: user.value._id });
 }
 on('notification:new', (payload: any) => {
 if (['NEW_ORDER', 'ORDER_STATUS_UPDATE'].includes(payload.type)) {
 loadOrders();
 // Play alert sound for new orders
 if (payload.type === 'NEW_ORDER') {
 try {
 const audio = new Audio('/sounds/order-alert.mp3');
 audio.play().catch(() => {});
 } catch (_) {}
 }
 }
 });
 on('notification:order-status-update', () => {
 loadOrders();
 });
 on('notification:new-order', () => {
 loadOrders();
 });
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

