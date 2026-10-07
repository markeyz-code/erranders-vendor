<template>
 <div class="py-5 pb-10 max-w-7xl mx-auto animate-fade-in">
 <!-- Header Section -->
 <header class="flex items-end justify-between gap-4 flex-wrap mb-6">
 <div class="flex-1 min-w-[200px]">
 <h1 class="text-[26px] font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
 <p class="text-sm text-gray-400 font-medium mt-1">Welcome back to your store overview</p>
 </div>
 <div class="flex items-center gap-2.5 flex-wrap">
 <!-- <button @click="shareStore" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-white text-gray-600 border border-gray-25 hover:border-gray-200 hover:bg-gray-50">
 <Share2 class="w-4 h-4" />
 Share Store
 </button> -->
 <div class="flex items-center gap-2 bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-100">
 <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span class="text-emerald-600 text-[13px] font-bold">Store Online</span>
 </div>
 <NuxtLink to="/dashboard/settings" class="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150">
 <Settings class="w-5 h-5" />
 </NuxtLink>
 </div>
 </header>

 <!-- Stats Grid -->
 <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
 <div v-for="stat in computedStats" :key="stat.label" class="bg-white border border-gray-25 rounded-2xl p-5 flex flex-col justify-between h-32 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden">
 <div class="w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110 mb-2" :class="stat.iconColorClass === 'inv-stat-card__icon--blue' ? 'bg-blue-50 text-blue-500' : stat.iconColorClass === 'inv-stat-card__icon--amber' ? 'bg-amber-50 text-amber-500' : stat.iconColorClass === 'inv-stat-card__icon--purple' ? 'bg-purple-50 text-purple-500' : 'bg-emerald-50 text-emerald-500'">
 <component :is="stat.icon" class="w-5 h-5" />
 </div>
 <div class="relative z-10">
 <p class="text-[28px] font-bold text-gray-900 leading-none tracking-tight mb-1">{{ stat.value }}</p>
 <p class="text-sm text-gray-500 font-medium">{{ stat.label }}</p>
 </div>
 <span v-if="stat.trend" class="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
 Live
 </span>
 </div>
 </div>

 <div class="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-6">
 <!-- Recent Orders Table -->
 <div class="xl:col-span-2">
 <div class="flex flex-col min-h-[500px]">
 <div class="px-2 py-2 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 class="font-bold text-gray-900 text-lg tracking-tight">{{ isServiceProvider ? 'Recent Appointments' : 'Recent Orders' }}</h3>
 <p class="text-sm font-medium text-gray-400 mt-1">Real-time incoming requests</p>
 </div>
 <NuxtLink to="/dashboard/orders" class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-white text-[#FF5C1A] border border-gray-25 hover:border-gray-200 hover:bg-gray-50 self-start sm:self-auto">
 See All
 </NuxtLink>
 </div>
 
 <UiTable 
 :columns="isServiceProvider ? appointmentColumns : orderColumns" 
 :items="isServiceProvider ? appointmentsList.slice(0, 5) : orders.slice(0, 5)" 
 :loading="isServiceProvider ? loadingAppointments : loadingOrders"
 empty-title="Welcome to your dashboard!"
 empty-subtitle="You haven't received any requests yet. If you're new, make sure to complete your profile setup."
 :has-actions="true">
 <template #customer="{ item }">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-500 border border-white">
 {{ item.customer?.firstName?.[0] }}{{ item.customer?.lastName?.[0] }}
 </div>
 <div class="truncate">
 <p class="font-bold text-gray-900 truncate">{{ item.customer?.firstName }} {{ item.customer?.lastName }}</p>
 <p class="text-sm text-gray-400 font-medium">{{ item.customer?.phone || 'No phone' }}</p>
 </div>
 </div>
 </template>
 <template #store="{ item }">
 <div v-if="!isServiceProvider" class="flex items-center gap-2">
 <div class="w-5 h-5 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-50 shrink-0">
 <img v-if="item.vendor?.logo" :src="item.vendor.logo" class="w-full h-full object-cover" />
 <Building v-else class="w-2.5 h-2.5 text-gray-300" />
 </div>
 <span class="text-sm font-bold text-gray-600 truncate max-w-[120px]">{{ item.vendor?.storeName || 'N/A' }}</span>
 </div>
 <div v-else class="flex flex-col">
 <span class="text-sm font-bold text-gray-900 truncate max-w-[150px]">{{ item.items?.[0]?.service?.name || 'Service' }}</span>
 <span class="text-sm text-gray-500 font-medium">{{ item.items?.[0]?.variantName || '' }}</span>
 </div>
 </template>
 <template #date="{ item }">
 <div class="flex flex-col">
 <span class="text-sm font-bold text-gray-900 whitespace-nowrap">{{ new Date(item.scheduledDate).toLocaleDateString() }}</span>
 <span class="text-sm text-gray-500 font-medium whitespace-nowrap">{{ item.startTime }} - {{ item.endTime }}</span>
 </div>
 </template>
 <template #total="{ item }">
 <span class="font-bold text-gray-900 whitespace-nowrap">₦{{ (item.total || item.price || 0).toLocaleString() }}</span>
 </template>
 <template #status="{ item }">
 <span :class="getStatusBadge(item.status)" class="text-[11px] font-bold px-2.5 py-1 rounded-md border whitespace-nowrap uppercase tracking-wider">
 {{ item.status.replace(/_/g, ' ') }}
 </span>
 </template>
 <template #actions>
 <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300 hover:text-gray-900" @click="$router.push(isServiceProvider ? '/dashboard/appointments' : '/dashboard/orders')">
 <ArrowRight class="w-4 h-4" />
 </button>
 </template>
 </UiTable>
 
 <!-- Onboarding Guide if no orders/appointments -->
 <div v-if="(isServiceProvider ? appointmentsList.length === 0 : orders.length === 0) && !(isServiceProvider ? loadingAppointments : loadingOrders)" class="p-4 md:p-6 bg-[#FF5C1A]/5 border-t border-[#FF5C1A]/10 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
 <div class="flex items-start gap-4">
 <div class="w-10 h-10 rounded-xl bg-[#FF5C1A] text-white flex items-center justify-center shrink-0 ">
 <ShieldCheck class="w-5 h-5" />
 </div>
 <div>
 <h4 class="text-base font-bold text-gray-900">Setup your store for success</h4>
 <p class="text-sm text-gray-500 font-medium mt-1">Complete these steps to start receiving requests</p>
 </div>
 </div>
 <div class="flex items-center gap-3 flex-wrap justify-end">
 <NuxtLink v-if="isMiniMart" to="/products/bulk-add" class="px-5 py-2.5 bg-[#FF5C1A] text-white rounded-xl text-[13px] font-bold hover:bg-[#E54D12] transition-all whitespace-nowrap text-center shadow-sm">
 Add Products from Catalog
 </NuxtLink>
 <NuxtLink to="/dashboard/settings" class="px-5 py-2.5 bg-white text-gray-900 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all border border-gray-200 shadow-sm whitespace-nowrap text-center">
 Setup Store Profile
 </NuxtLink>
 </div>
 </div>
 </div>

 <!-- Marketing / Insight Cards -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div class="bg-white rounded-2xl border border-gray-25 p-4 md:p-6 relative overflow-hidden group hover:border-gray-200 transition-colors">
 <div class="relative z-10">
 <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-5 border border-orange-100">
 <Package v-if="!isServiceProvider" class="w-5 h-5 text-[#FF5C1A]" />
 <Calendar v-else class="w-5 h-5 text-[#FF5C1A]" />
 </div>
 <h3 class="text-lg font-bold text-gray-900 mb-1 tracking-tight">{{ isServiceProvider ? 'Upcoming Bookings' : 'Stock Status' }}</h3>
 <p class="text-gray-500 text-sm mb-6 font-medium">{{ isServiceProvider ? 'Check your appointment schedule' : 'Some items running low' }}</p>
 <div class="flex flex-col sm:flex-row gap-3">
 <NuxtLink :to="isServiceProvider ? '/dashboard/appointments' : '/dashboard/inventory'" class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md">
 {{ isServiceProvider ? 'View Schedule' : 'Manage Stock' }}
 </NuxtLink>
 <NuxtLink v-if="isMiniMart" to="/products/bulk-add" class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-[#FF5C1A]/5 text-[#FF5C1A] border border-[#FF5C1A]/20 hover:bg-[#FF5C1A]/10">
 Add from Catalog
 </NuxtLink>
 </div>
 </div>
 </div>
 
 <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-25 relative overflow-hidden group hover:border-gray-200 transition-colors">
 <div class="relative z-10">
 <div class="flex items-center gap-0.5 mb-5">
 <Star v-for="i in 5" :key="i" class="w-4 h-4 text-amber-400 fill-amber-400" />
 </div>
 <p class="text-sm text-gray-500 font-semibold mb-1">Store Rating</p>
 <h3 class="text-4xl font-bold text-gray-900 tracking-tight">{{ Number(currentStats.rating || 5).toFixed(1) }}</h3>
 <p class="text-sm text-gray-400 font-bold mt-4 flex items-center gap-1.5">
 <CheckCircle class="w-3.5 h-3.5 text-emerald-500" /> {{ currentStats.reviewsCount || 0 }} CUSTOMER REVIEWS
 </p>
 </div>
 </div>
 </div>
 </div>

 <!-- Financial Sidebar -->
 <div class="space-y-4 md:space-y-6">
 <div class="bg-white rounded-2xl border border-gray-25 p-4 md:p-6 space-y-4 md:space-y-6 transition-all hover:border-gray-200">
 <div class="flex items-center gap-4">
 <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/5 text-[#FF5C1A] flex items-center justify-center border border-[#FF5C1A]/10 shrink-0">
 <Banknote class="w-5 h-5" />
 </div>
 <div>
 <h3 class="text-lg font-bold text-gray-900 tracking-tight">Earnings</h3>
 <p class="text-sm font-medium text-gray-400">Today's Settlement</p>
 </div>
 </div>
 
 <div class="space-y-1">
 <p class="text-sm font-medium text-gray-400 ml-1">Current Balance</p>
 <div class="flex items-baseline gap-1">
 <span class="text-lg font-medium text-gray-400">₦</span>
 <h4 class="text-4xl font-bold text-gray-900 tracking-tight">{{ currentStats.todaySales?.toLocaleString() || '0' }}</h4>
 </div>
 </div>



 <!-- Payout Schedule Quick Config -->
 <div class="pt-4 border-t border-gray-100">
  <div class="flex items-center justify-between mb-3">
    <h4 class="text-sm font-bold text-gray-900">Payout Schedule</h4>
    <span v-if="updatingPayout" class="w-4 h-4 border border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></span>
  </div>
  <div class="grid grid-cols-4 gap-2">
    <button 
      v-for="pref in ['manual', 'daily', 'weekly', 'monthly']" 
      :key="pref"
      @click="updatePayoutSchedule(pref)"
      :disabled="updatingPayout"
      class="py-2 px-1 text-[11px] font-bold rounded-lg border text-center capitalize transition-all"
      :class="wallet?.payoutPreference === pref ? 'bg-[#FF5C1A]/10 border-[#FF5C1A]/30 text-[#FF5C1A]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'"
    >
      {{ pref }}
    </button>
  </div>
 </div>

 <NuxtLink to="/dashboard/wallet" class="inline-flex items-center justify-center w-full gap-1.5 px-5 py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md mt-2">
 Financial Hub <ArrowRight class="w-3.5 h-3.5 ml-2" />
 </NuxtLink>
 </div>


 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { 
 ShoppingBag, Clock, TrendingUp, Building, Inbox, 
 Settings, ArrowRight, CheckCircle, Banknote, Megaphone, Package, Star, ShieldCheck, Share2, Calendar
} from 'lucide-vue-next';

import { vendors_api } from '@/api_factory/modules/vendors';
import { useVendorOrders } from '@/composables/modules/vendor/useVendorOrders';
import { useVendorAppointments } from '@/composables/modules/appointments';
import { useSocket } from '@/composables/useSocket';
import { useUser } from '@/composables/modules/auth/user';
import { useWallet } from '@/composables/modules/wallets';
import UiTable from '@/components/ui/UiTable.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Dashboard - Errander Vendor' });

const { orders, loading: loadingOrders, loadMyVendorOrders } = useVendorOrders();
const { appointmentsList, loading: loadingAppointments, fetchAppointments } = useVendorAppointments();
const { showToast } = useCustomToast();
const { user } = useUser();
const { connect, on, emit } = useSocket('realtime');
const { wallet, fetchWallet, updatePreferences } = useWallet();
const currentStats = ref<any>({});
const vendorProfile = ref<any>(null);
const loadingStats = ref(true);
const updatingPayout = ref(false);

const isServiceProvider = computed(() => vendorProfile.value?.businessType === 'service_provider');
const isMiniMart = computed(() => {
 if (!vendorProfile.value) return false;
 const cats = vendorProfile.value.tags || [];
 return (vendorProfile.value.businessType === 'physical_product' || vendorProfile.value.businessType === 'hybrid') && 
 (cats.includes('mini-mart') || cats.includes('groceries') || cats.includes('provisions') || vendorProfile.value.category === 'mini-mart');
});

const orderColumns = [
 { key: 'customer', label: 'Customer' },
 { key: 'total', label: 'Amount' },
 { key: 'status', label: 'Status' }
];

const appointmentColumns = [
 { key: 'customer', label: 'Client' },
 { key: 'store', label: 'Service' },
 { key: 'date', label: 'Date & Time' },
 { key: 'status', label: 'Status' }
];

const computedStats = computed(() => [
 { label: isServiceProvider.value ? 'Today Appointments' : 'Today Orders', value: currentStats.value?.todayOrders?.toString() || '0', icon: isServiceProvider.value ? Calendar : ShoppingBag, iconColorClass: 'inv-stat-card__icon--blue', trend: 0 },
 { label: isServiceProvider.value ? 'Active Appointments' : 'Active Orders', value: currentStats.value?.activeOrders?.toString() || '0', icon: Clock, iconColorClass: 'inv-stat-card__icon--amber', trend: 0 },
 { label: 'Revenue', value: '₦' + (currentStats.value?.totalSales?.toLocaleString() || '0'), icon: Building, iconColorClass: 'inv-stat-card__icon--purple', trend: 0 },
 { label: 'Rating', value: Number(currentStats.value?.rating || 5).toFixed(1), icon: Star, iconColorClass: 'inv-stat-card__icon--green', trend: 0 },
]);

 const fetchDashboardData = async () => {
 loadingStats.value = true;
 try {
 const [statsRes, profileRes] = await Promise.all([
 vendors_api.getMyVendorStats(),
 vendors_api.getProfile()
 ]);
 
 currentStats.value = statsRes?.data || {};
 vendorProfile.value = profileRes?.data || null;
 await fetchWallet();
 } catch (error) {
 console.error('Failed to load dashboard stats:', error);
 } finally {
 loadingStats.value = false;
 }
};

const updatePayoutSchedule = async (pref: string) => {
  if (wallet.value?.payoutPreference === pref) return;
  updatingPayout.value = true;
  try {
    await updatePreferences({ preference: pref });
  } finally {
    updatingPayout.value = false;
  }
};

onMounted(() => {
 fetchDashboardData();
 loadMyVendorOrders();
 fetchAppointments();
 
 const sock = connect();
 if (user.value?._id) {
   emit('register', { userId: user.value._id });
 }
 
 const refreshAll = () => {
   fetchDashboardData();
   loadMyVendorOrders();
 };

 on('notification:new', (payload: any) => {
   if (['NEW_ORDER', 'ORDER_STATUS_UPDATE'].includes(payload.type)) {
     refreshAll();
   }
 });
 on('notification:order-status-update', refreshAll);
 on('notification:new-order', refreshAll);
});

const getStatusBadge = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600 border-emerald-100/50';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600 border-amber-100/50';
 return 'bg-gray-50 text-gray-400 border-gray-100/50';
};

const shareStore = () => {
 if (!vendorProfile.value || !vendorProfile.value.subdomain) {
 showToast({ title: 'Error', message: 'Store link not available', type: 'error' });
 return;
 }
 const protocol = window.location.protocol;
 let baseHost = window.location.host;
 const parts = window.location.hostname.split('.');
 if (parts.length >= 3 || (parts.length >= 2 && parts[parts.length - 1] === 'localhost')) {
 if (parts[0] !== 'www' && parts[0] !== 'student' && parts[0] !== 'vendor') {
 const port = window.location.port ? `:${window.location.port}` : '';
 baseHost = parts.slice(1).join('.') + port;
 }
 }
 const shareUrl = `${protocol}//${vendorProfile.value.subdomain}.${baseHost}/`;
 if (navigator.share) {
 navigator.share({
 title: vendorProfile.value.storeName,
 text: `Check out ${vendorProfile.value.storeName} on Errandr!`,
 url: shareUrl,
 }).catch(err => {
 console.error('Error sharing:', err);
 });
 } else {
 navigator.clipboard.writeText(shareUrl);
 showToast({ title: 'Success', message: 'Store link copied to clipboard!', type: 'success' });
 }
};

onMounted(fetchDashboardData);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
