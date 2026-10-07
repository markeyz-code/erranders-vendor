<template>
  <FullScreenLoader />
  <div class="min-h-screen bg-[#f8f9fb] overflow-x-hidden w-full max-w-[100vw]">
    
    <!-- Desktop Left Sidebar -->
    <aside class="hidden lg:flex flex-col bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50 transition-all duration-300" :class="isSidebarMinimized ? 'w-20' : 'w-60'">
      <!-- Logo -->
      <div class="px-4 py-4 flex items-center gap-3 border-b border-gray-100" :class="isSidebarMinimized ? 'justify-center' : ''">
        <div v-if="isSidebarMinimized" class="w-9 h-9 rounded-lg overflow-hidden shrink-0">
          <video v-if="profile?.logo && profile.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
          <img v-else-if="profile?.logo" :src="profile.logo" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-parentPrimary text-white flex items-center justify-center font-bold text-sm uppercase">{{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}</div>
        </div>
        <template v-else>
          <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <video v-if="profile?.logo && profile.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
            <img v-else-if="profile?.logo" :src="profile.logo" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-parentPrimary text-white flex items-center justify-center font-bold text-sm uppercase">{{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}</div>
          </div>
          <span class="text-sm font-bold text-gray-900 truncate">{{ profile?.storeName || 'Merchant' }}</span>
        </template>

        <!-- Toggle -->
        <button 
          @click="isSidebarMinimized = !isSidebarMinimized"
          class="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary z-50 transition-colors"
        >
          <ChevronLeft v-if="!isSidebarMinimized" class="w-3.5 h-3.5" />
          <ChevronRight v-else class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Store Status -->
      <div class="px-4 py-3 border-b border-gray-100" :class="isSidebarMinimized ? 'flex justify-center' : ''">
        <button 
          @click="handleToggleOnline" :disabled="isToggling"
          class="flex items-center gap-2 text-sm font-medium transition-colors"
          :class="isSidebarMinimized ? '' : 'w-full px-3 py-2 rounded-lg justify-between'"
          :style="profile?.isOnline ? 'background: #ecfdf5' : 'background: #fef2f2'"
          :title="isSidebarMinimized ? (profile?.isOnline ? 'Store Open' : 'Store Closed') : ''"
        >
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0" :class="profile?.isOnline ? 'bg-emerald-500' : 'bg-red-400'"></span>
            <span v-if="!isSidebarMinimized" :class="profile?.isOnline ? 'text-emerald-700' : 'text-red-600'">
              Store {{ profile?.isOnline ? 'Open' : 'Closed' }}
            </span>
          </div>
          <!-- Real Toggle Visual -->
          <div v-if="!isSidebarMinimized"
            class="relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out"
            :class="profile?.isOnline ? 'bg-emerald-500' : 'bg-red-300'"
          >
            <span class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="profile?.isOnline ? 'translate-x-3' : 'translate-x-0'" />
          </div>
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 py-3 space-y-0.5 overflow-y-auto" :class="isSidebarMinimized ? 'px-2' : 'px-3'">
        <p v-if="!isSidebarMinimized" class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Main</p>
        <NuxtLink
          v-for="item in navItems.main"
          :key="item.path"
          :to="item.path"
          class="flex items-center py-2.5 text-sm font-medium rounded-lg transition-all"
          :class="[
            isActive(item.path) ? 'bg-parentPrimary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            isSidebarMinimized ? 'justify-center px-0' : 'px-3'
          ]"
          :title="isSidebarMinimized ? item.label : ''"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
          <span v-if="!isSidebarMinimized">{{ item.label }}</span>
        </NuxtLink>

        <template v-if="navItems.more.length">
          <p v-if="!isSidebarMinimized" class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-3">More</p>
          <div v-else class="my-2 border-t border-gray-100"></div>
          <NuxtLink
            v-for="item in navItems.more"
            :key="item.path"
            :to="item.path"
            class="flex items-center py-2.5 text-sm font-medium rounded-lg transition-all"
            :class="[
              isActive(item.path) ? 'bg-parentPrimary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              isSidebarMinimized ? 'justify-center px-0' : 'px-3'
            ]"
            :title="isSidebarMinimized ? item.label : ''"
          >
            <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
            <span v-if="!isSidebarMinimized">{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>

      <!-- Logout -->
      <div class="border-t border-gray-100" :class="isSidebarMinimized ? 'p-2' : 'p-3'">
        <button
          @click="handleLogoutClick"
          class="flex items-center w-full py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          :class="isSidebarMinimized ? 'justify-center px-0' : 'px-3'"
        >
          <LogOut class="w-[18px] h-[18px] shrink-0" :class="isSidebarMinimized ? '' : 'mr-3'" />
          <span v-if="!isSidebarMinimized">Log Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 overflow-hidden">
        <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0">
          <video v-if="profile?.logo && profile.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
          <img v-else-if="profile?.logo" :src="profile.logo" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-parentPrimary text-white flex items-center justify-center font-bold text-sm uppercase">{{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}</div>
        </div>
        <span class="font-semibold text-sm text-gray-900 truncate">{{ profile?.storeName || 'Merchant' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Store Status Toggle -->
        <button 
          @click="handleToggleOnline" :disabled="isToggling"
          class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200"
          :class="profile?.isOnline ? 'bg-green-500' : 'bg-gray-200'"
        >
          <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200" :class="profile?.isOnline ? 'translate-x-4' : 'translate-x-0'" />
        </button>
        <NuxtLink to="/dashboard/notifications" class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-parentPrimary hover:bg-gray-50 transition-colors">
          <Bell class="w-5 h-5" />
        </NuxtLink>
        <button @click="showMobileMenu = !showMobileMenu" class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Menu class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Mobile Overlay -->
    <Transition name="overlay">
      <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" @click="showMobileMenu = false" />
    </Transition>

    <!-- Mobile Sidebar (LEFT side) -->
    <Transition name="slide">
      <aside v-if="showMobileMenu" class="lg:hidden w-72 bg-white min-h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-gray-100">
        <!-- Header -->
        <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md overflow-hidden shrink-0">
              <video v-if="profile?.logo && profile.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
              <img v-else-if="profile?.logo" :src="profile.logo" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-parentPrimary text-white flex items-center justify-center font-bold text-[10px] uppercase">{{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}</div>
            </div>
            <span class="text-sm font-bold text-gray-900 truncate">{{ profile?.storeName || 'Merchant' }}</span>
          </div>
          <button @click="showMobileMenu = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X class="w-4 h-4" /></button>
        </div>

        <!-- User Profile -->
        <NuxtLink to="/dashboard/settings" @click="showMobileMenu = false" class="mx-3 mt-3 p-3 rounded-lg bg-gray-50 flex items-center gap-3 hover:bg-gray-100 transition-colors group">
          <div class="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm shrink-0">{{ userInitials }}</div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate leading-tight">{{ userDisplayName }}</p>
            <p class="text-[11px] text-gray-400 truncate leading-tight mt-0.5">{{ user?.email }}</p>
          </div>
          <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
        </NuxtLink>

        <!-- Store Status -->
        <div class="mx-3 mt-2 px-3 py-2 rounded-lg flex items-center justify-between" :style="profile?.isOnline ? 'background: #ecfdf5' : 'background: #fef2f2'">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="profile?.isOnline ? 'bg-emerald-500' : 'bg-red-400'"></span>
            <span class="text-sm font-medium" :class="profile?.isOnline ? 'text-emerald-700' : 'text-red-600'">Store {{ profile?.isOnline ? 'Open' : 'Closed' }}</span>
          </div>
          <button @click="handleToggleOnline" :disabled="isToggling" class="text-[10px] font-semibold underline" :class="profile?.isOnline ? 'text-emerald-600' : 'text-red-500'">
            {{ profile?.isOnline ? 'Close' : 'Open' }}
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <NuxtLink
            v-for="item in [...navItems.main, ...navItems.more]"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all"
            :class="isActive(item.path) ? 'bg-parentPrimary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-[18px] h-[18px] mr-3" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Logout -->
        <div class="px-3 py-3 border-t border-gray-100">
          <button @click="handleLogoutClick" class="flex items-center w-full px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
            <LogOut class="w-[18px] h-[18px] mr-3" /> Log Out
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content Area -->
    <main class="w-full overflow-x-hidden" :class="isSidebarMinimized ? 'lg:pl-20' : 'lg:pl-60'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <slot />
      </div>
    </main>

    <!-- Logout Modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="logoutModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
        @click.self="logoutModalOpen = false"
      >
        <div class="bg-white rounded-lg max-w-sm w-full p-6 flex flex-col items-center text-center space-y-4">
          <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <LogOut class="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 mb-1">Leaving already?</h3>
            <p class="text-sm text-gray-500">You'll be signed out, but your store data is safe.</p>
          </div>
          <div class="flex gap-3 w-full pt-2">
            <button @click="logoutModalOpen = false" class="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button @click="confirmLogout" class="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors">Log Out</button>
          </div>
        </div>
      </div>
    </Transition>
    <CorePushNotificationPrompt />
    <CoreWhatsAppWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useVendorProfile, useVendorStatus } from '@/composables/modules/vendors'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Wallet, 
  Settings, 
  LogOut, 
  X,
  Bell,
  Megaphone,
  Clock,
  Menu,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useVendorNotifications } from '@/composables/useVendorNotifications'

useRealtimeNotifications()

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const { profile, fetchProfile } = useVendorProfile()
const { requestPermissionAndRegister, listenForOrders } = useVendorNotifications()
const { toggleOnline } = useVendorStatus()

const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)
const isSidebarMinimized = ref(false)
const isToggling = ref(false)

const handleToggleOnline = async () => {
  const vendorId = profile.value?.data?._id || profile.value?._id;
  if (isToggling.value || !vendorId) return;
  
  isToggling.value = true;
  try {
    await toggleOnline(vendorId);
    await fetchProfile();
  } catch (error) {
    console.error('Failed to toggle online status', error);
  } finally {
    isToggling.value = false;
  }
}

onMounted(() => {
  if (!profile.value) fetchProfile()
  if ('Notification' in window) requestPermissionAndRegister()
  listenForOrders()
})

const navItems = computed(() => {
  const isServiceProvider = profile.value?.businessType === 'service_provider';
  const isHybrid = profile.value?.businessType === 'hybrid';

  const items = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (isServiceProvider || isHybrid) {
    items.push({ path: '/dashboard/appointments', label: 'Appointments', icon: Clock }); 
    items.push({ path: '/dashboard/services', label: 'Services', icon: ClipboardList }); 
  }

  if (!isServiceProvider || isHybrid) {
    items.push({ path: '/dashboard/orders', label: 'Orders', icon: ClipboardList });
    items.push({ path: '/dashboard/inventory', label: 'Inventory', icon: Package });
  }

  const more = [];
  if (!isServiceProvider || isHybrid) {
    more.push({ path: '/dashboard/pre-orders', label: 'Advance Orders', icon: Clock });
  }

  more.push({ path: '/dashboard/categories', label: 'Store Categories', icon: ClipboardList });

  more.push(
    { path: '/dashboard/promotions', label: 'Promotions', icon: Megaphone },
    { path: '/dashboard/chats', label: 'Chats', icon: MessageSquare },
    { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
    { path: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings }
  );

  return { main: items, more };
})

const userDisplayName = computed(() => {
  if (!user.value) return 'Vendor'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Vendor'
})

const userInitials = computed(() => {
  if (!user.value) return 'V'
  const first = user.value.firstName || ''
  const last = user.value.lastName || ''
  return (first[0] || last[0] || user.value.email?.[0] || 'V').toUpperCase()
})

const handleLogoutClick = () => {
  logoutModalOpen.value = true
}

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard' || route.path === '/dashboard/'
  return route.path.startsWith(path)
}

const confirmLogout = () => {
  logOut()
  logoutModalOpen.value = false
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
