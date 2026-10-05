<template>
 <Teleport to="body">
  <div class="relative z-[200]">
  <Transition name="fade">
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity z-[200]" @click="$emit('close')" aria-hidden="true" />
  </Transition>

 <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full md:translate-y-0 md:translate-x-full"
      enter-to-class="translate-y-0 md:translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0 md:translate-x-0"
      leave-to-class="translate-y-full md:translate-y-0 md:translate-x-full"
 >
 <div v-if="isOpen" class="fixed inset-0 md:inset-auto md:top-4 md:bottom-4 md:right-4 md:left-auto z-[201] bg-white rounded-none md:rounded-3xl md:w-[600px] flex flex-col h-[100dvh] md:h-auto md:max-h-[calc(100vh-2rem)] border-0 md:border border-gray-25 overflow-hidden pointer-events-auto shadow-2xl">
 
 <!-- Header -->
 <div class="px-5 py-4 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
 <div>
 <h2 v-if="title" class="text-xl font-medium text-gray-900 tracking-tight">{{ title }}</h2>
 <p v-if="subtitle" class="text-sm font-bold text-gray-400 mt-1">{{ subtitle }}</p>
 </div>
 <button 
 type="button" 
 class="w-10 h-10 rounded-md flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95" 
 @click="$emit('close')"
 >
 <X class="w-5 h-5" />
 </button>
 </div>

 <!-- Scrollable Content -->
 <div class="flex-1 overflow-y-auto hide-scrollbar p-5 md:p-8">
 <slot></slot>
 </div>

 <!-- Optional Footer Slot (e.g., for Action Buttons) -->
 <div v-if="$slots.footer" class="px-5 py-4 md:px-8 md:py-6 border-t border-gray-100 bg-gray-50/50">
 <slot name="footer"></slot>
 </div>
 </div>
 </Transition>
 </div>
 </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
 isOpen: boolean;
 title?: string;
 subtitle?: string;
}>();

defineEmits(['close']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
 transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
 opacity: 0;
}

.hide-scrollbar::-webkit-scrollbar {
 display: none;
}
.hide-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>
