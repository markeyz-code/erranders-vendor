<template>
  <div class="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col w-full min-w-0">
    <!-- Table Body with horizontal scroll -->
    <div class="overflow-x-auto w-full hide-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50/50 sticky top-0 z-10">
          <tr class="border-b border-gray-100">
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-4 py-4 md:px-6 md:py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
              :class="col.class"
            >
              {{ col.label }}
            </th>
            <th v-if="hasActions" class="px-4 py-4 md:px-6 md:py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50/50">
          <!-- Loading State -->
          <tr v-if="loading" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
            <td v-for="col in (hasActions ? columns.length + 1 : columns.length)" :key="col" class="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap">
              <div class="h-4 bg-gray-100 rounded w-full max-w-[120px]"></div>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-else-if="items.length === 0">
            <td :colspan="hasActions ? columns.length + 1 : columns.length" class="px-4 py-16 md:px-6 md:py-24 text-center">
              <div class="flex flex-col items-center justify-center max-w-xs mx-auto">
                <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <component :is="emptyIcon || Inbox" class="w-8 h-8 text-gray-300" />
                </div>
                <h4 class="font-bold text-gray-900 text-lg tracking-tight">{{ emptyTitle || 'No items found' }}</h4>
                <p class="text-gray-500 text-sm mt-1 font-medium">{{ emptySubtitle || 'Wait for data or try adjusting your filters.' }}</p>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr 
            v-else 
            v-for="(item, idx) in items" 
            :key="item._id || idx" 
            class="hover:bg-gray-50/80 transition-colors group cursor-pointer"
            @click="$emit('row-click', item)"
          >
            <td 
              v-for="(col, cIdx) in columns" 
              :key="col.key" 
              class="px-4 py-4 md:px-6 md:py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
              :class="col.class"
            >
              <slot :name="col.key" :item="item" :index="idx">
                {{ item[col.key] }}
              </slot>
            </td>
            <td v-if="hasActions" class="px-4 py-4 md:px-6 md:py-4 text-right whitespace-nowrap">
              <slot name="actions" :item="item" :index="idx"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Optional Footer / Pagination -->
    <div v-if="showFooter" class="p-4 md:p-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

interface Column {
 key: string;
 label: string;
 class?: string;
}

defineProps<{
 columns: Column[];
 items: any[];
 loading?: boolean;
 hasActions?: boolean;
 showFooter?: boolean;
 emptyTitle?: string;
 emptySubtitle?: string;
 emptyIcon?: any;
}>();

const emit = defineEmits(['row-click']);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
 display: none;
}
.hide-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>
