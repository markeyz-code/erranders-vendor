<template>
  <FullScreenLoader />
  <div class="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
    <!-- Desktop Header & Navigation -->
    <header class="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <video v-if="profile?.logo && profile.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-9 h-9 rounded-md object-cover flex-shrink-0" autoplay loop muted playsinline></video>
            <img v-else-if="profile?.logo" :src="profile.logo" alt="Store Logo" class="w-9 h-9 rounded-md object-cover flex-shrink-0" />
            <div v-else class="w-9 h-9 bg-parentPrimary rounded-md flex items-center justify-center text-white font-bold text-lg uppercase flex-shrink-0">
              {{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}
            </div>
            <span class="text-xl font-bold text-parentPrimary tracking-tight truncate">{{ profile?.storeName || 'Errander' }}</span>
          </div>

          <!-- Main Navigation (Horizontal) -->
          <nav class="hidden lg:flex flex-1 items-center space-x-1 ml-6">
            <NuxtLink
              v-for="item in navItems.main"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
              :class="isActive(item.path) ? 'bg-parentPrimary/10 text-parentPrimary' : 'text-gray-600 hover:bg-gray-50 hover:text-parentPrimary'"
            >
              <component :is="item.icon" class="w-4 h-4 mr-2" />
              <span>{{ item.label }}</span>
            </NuxtLink>
            
            <!-- More Dropdown -->
            <div class="relative group">
              <button class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-parentPrimary">
                <Menu class="w-4 h-4 mr-2" />
                <span>More</span>
              </button>
              <div class="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div class="p-2 space-y-1">
                  <NuxtLink
                    v-for="item in navItems.more"
                    :key="item.path"
                    :to="item.path"
                    class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                    :class="isActive(item.path) ? 'bg-parentPrimary/10 text-parentPrimary' : 'text-gray-600 hover:bg-gray-50 hover:text-parentPrimary'"
                  >
                    <component :is="item.icon" class="w-4 h-4 mr-3 text-gray-400 group-hover:text-parentPrimary" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <!-- Right side (Profile & Actions) -->
          <div class="flex items-center gap-4 ml-auto">
            <!-- Store Status Toggle -->
            <div class="flex items-center gap-2 border-r border-gray-200 pr-4">
              <span class="text-sm font-medium" :class="profile?.isOnline ? 'text-green-600' : 'text-red-500'">
                {{ profile?.isOnline ? 'Open' : 'Closed' }}
              </span>
              <button 
                @click="handleToggleOnline"
                :disabled="isToggling"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="profile?.isOnline ? 'bg-green-500' : 'bg-gray-200'"
              >
                <span 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="profile?.isOnline ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <NuxtLink to="/dashboard/notifications" class="p-2 rounded-full text-gray-400 hover:text-parentPrimary hover:bg-parentPrimary/10 transition-colors">
              <Bell class="w-5 h-5" />
            </NuxtLink>
            
            <!-- User Profile Menu -->
            <div class="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold text-gray-900 leading-tight">{{ userDisplayName }}</span>
                <span class="text-xs text-gray-500">{{ user?.email }}</span>
              </div>
              <button @click="handleLogoutClick" class="w-9 h-9 rounded-full bg-parentPrimary/10 text-parentPrimary flex items-center justify-center hover:bg-parentPrimary hover:text-white transition-colors" title="Logout">
                <LogOut class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2 overflow-hidden">
          <video v-if="profile?.logo && profile.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" autoplay loop muted playsinline></video>
          <img v-else-if="profile?.logo" :src="profile.logo" alt="Store Logo" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          <div v-else class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 uppercase">
            {{ profile?.storeName ? profile.storeName.charAt(0) : 'E' }}
          </div>
          <span class="font-bold text-parentPrimary tracking-tight truncate">{{ profile?.storeName || 'Errander' }}</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Mobile Store Status Toggle -->
          <button 
            @click="handleToggleOnline"
            :disabled="isToggling"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mr-2"
            :class="profile?.isOnline ? 'bg-green-500' : 'bg-gray-200'"
            :title="profile?.isOnline ? 'Store Open' : 'Store Closed'"
          >
            <span 
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="profile?.isOnline ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>

          <NuxtLink to="/dashboard/notifications" class="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-parentPrimary transition-colors">
            <Bell class="w-5 h-5" />
          </NuxtLink>
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <Transition name="overlay">
      <div
        v-if="showMobileMenu"
        class="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        @click="showMobileMenu = false"
      ></div>
    </Transition>

    <!-- Mobile Sidebar Menu -->
    <Transition name="slide">
      <aside
        v-if="showMobileMenu"
        class="lg:hidden w-[280px] bg-white min-h-screen fixed right-0 top-0 z-[60] flex flex-col shadow-2xl"
      >
        <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span class="font-bold text-gray-900">Menu</span>
          <button @click="showMobileMenu = false" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-parentPrimary text-white flex items-center justify-center font-bold text-lg">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 truncate text-sm">{{ userDisplayName }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
          </div>
        </div>
        
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in [...navItems.main, ...navItems.more]"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive(item.path) ? 'bg-parentPrimary text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-parentPrimary'"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            @click="handleLogoutClick"
            class="flex items-center justify-center w-full px-4 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Log Out
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
      <p class="text-sm text-gray-500">© {{ new Date().getFullYear() }} Errandr Merchant</p>
      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <NuxtLink to="/terms" class="text-sm font-medium text-gray-500 hover:text-parentPrimary transition-colors">Terms</NuxtLink>
        <NuxtLink to="/privacy" class="text-sm font-medium text-gray-500 hover:text-parentPrimary transition-colors">Privacy</NuxtLink>
        <NuxtLink to="/refund" class="text-sm font-medium text-gray-500 hover:text-parentPrimary transition-colors">Refunds</NuxtLink>
        <NuxtLink to="/contact" class="text-sm font-medium text-gray-500 hover:text-parentPrimary transition-colors">Contact</NuxtLink>
      </div>
    </footer>

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
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        @click.self="logoutModalOpen = false"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="logoutModalOpen"
            class="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center text-center space-y-4"
          >
            <div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
              <LogOut class="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">Leaving already?</h3>
              <p class="text-sm text-gray-500">You'll be signed out, but your store data is safe.</p>
            </div>
            <div class="flex gap-3 w-full pt-2">
              <button
                @click="logoutModalOpen = false"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmLogout"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </Transition>
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

useRealtimeNotifications() // Initialize listener

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
  if (!profile.value) {
    fetchProfile()
  }
  
  // Setup push notifications — always attempt (the function handles permission request internally)
  if ('Notification' in window) {
    requestPermissionAndRegister()
  }
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

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Vendor Dashboard', description: 'Monitor your sales and performance' },
  '/dashboard/inventory': { title: 'My Inventory', description: 'Manage your products and stock' },
  '/dashboard/pre-orders': { title: 'Advance Orders', description: 'Manage student pre-order batches and campaigns' },
  '/dashboard/orders': { title: 'Order Management', description: 'Process and track customer orders' },
  '/dashboard/promotions': { title: 'Promotions', description: 'Create banners and special offers' },
  '/dashboard/wallet': { title: 'My Wallet', description: 'Manage your earnings and payouts' },
  '/dashboard/notifications': { title: 'Notifications', description: 'Your recent alerts and messages' },
  '/dashboard/settings': { title: 'Store Settings', description: 'Configure your merchant profile' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Merchant Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Grow your business with Errander')

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


