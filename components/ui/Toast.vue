<template>
  <Teleport to="body">
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999999] flex flex-col gap-3 max-w-sm w-full items-center px-4 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[ 'toast-base', { 'bg-rose-500 border-rose-600': toast.type === 'error', 'bg-emerald-500 border-emerald-600': toast.type === 'success', 'bg-amber-500 border-amber-600': toast.type === 'warning', 'bg-blue-500 border-blue-600': toast.type === 'info' } ]"
          class="w-full rounded-md border p-4 flex items-start gap-3.5 cursor-pointer transition-all duration-300 pointer-events-auto text-white shadow-lg"
          @click="handleToastClick(toast)"
        >
          <!-- Status Icon container -->
          <div class="flex-shrink-0 mt-0.5">
            <div class="w-9 h-9 rounded-md flex items-center justify-center bg-white/20 text-white">
              <CheckCircle v-if="toast.type === 'success'" :size="20" class="stroke-[2.5]" />
              <AlertCircle v-else-if="toast.type === 'error'" :size="20" class="stroke-[2.5]" />
              <AlertTriangle v-else-if="toast.type === 'warning'" :size="20" class="stroke-[2.5]" />
              <Info v-else :size="20" class="stroke-[2.5]" />
            </div>
          </div>
          
          <!-- Content Container -->
          <div class="flex-1 min-w-0">
            <!-- Toast Title (if exists, or fall back to capitalized type) -->
            <h4 class="font-medium text-sm text-white leading-snug tracking-tight">
              {{ toast.title || (toast.type.charAt(0).toUpperCase() + toast.type.slice(1)) }}
            </h4>
            <!-- Toast Message -->
            <p class="text-sm font-bold text-white/90 leading-relaxed mt-0.5">
              {{ toast.message }}
            </p>
          </div>
          
          <!-- Close button hint -->
          <div class="flex-shrink-0 self-center text-white/70 hover:text-white transition-colors pl-2">
            <X :size="16" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

interface Toast {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timeoutId?: number
  action?: () => void
}

const toasts = ref<Toast[]>([])
let toastCounter = 0

const handleToastClick = (toast: Toast) => {
  if (toast.action) {
    toast.action()
  }
  removeToast(toast.id)
}

// Create a new toast
const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000, action?: () => void) => {
  const id = toastCounter++
  const newToast: Toast = { id, title, message, type, duration, action }
  
  toasts.value.push(newToast)
  
  // Auto-remove toast after duration
  const timeoutId = window.setTimeout(() => {
    removeToast(id)
  }, duration)
  
  // Store timeout ID for cleanup
  newToast.timeoutId = timeoutId
  
  return id
}

// Remove a toast by ID
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    // Clear the timeout if it exists
    if (toasts.value[index].timeoutId) {
      clearTimeout(toasts.value[index].timeoutId)
    }
    toasts.value.splice(index, 1)
  }
}

// IMPORTANT: Explicitly expose methods to parent components
defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
/* Animations */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-base {
  transition: all 0.2s ease-in-out;
}

.toast-base:hover {
  transform: translateY(1px);
}
</style>