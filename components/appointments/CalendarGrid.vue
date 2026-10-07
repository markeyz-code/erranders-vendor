<template>
  <div class="bg-white rounded-md border border-gray-50 overflow-hidden flex flex-col h-[70vh] min-h-[600px]">
    
    <!-- Top Headers (Staff / Vendor Name) -->
    <div class="flex border-b border-gray-100 bg-white z-10 sticky top-0">
      <div class="w-16 shrink-0 border-r border-gray-100 bg-white"></div>
      <div class="flex-1 py-4 text-center">
        <div class="inline-flex flex-col items-center justify-center">
          <div class="w-10 h-10 rounded-md bg-parentPrimary text-white flex items-center justify-center font-bold mb-1">
            ME
          </div>
          <span class="text-sm font-bold text-gray-900">My Schedule</span>
        </div>
      </div>
    </div>

    <!-- Scrollable Grid -->
    <div class="flex-1 overflow-y-auto relative no-scrollbar bg-gray-50/30" ref="scrollContainer">
      <div class="flex relative min-w-[600px]">
        
        <!-- Time Axis -->
        <div class="w-16 shrink-0 bg-white border-r border-gray-100 sticky left-0 z-10">
          <div 
            v-for="hour in hours" 
            :key="hour" 
            class="h-[80px] relative flex items-start justify-center pt-2"
          >
            <span class="text-sm font-bold text-gray-400">
              {{ formatHour(hour) }}
            </span>
          </div>
        </div>

        <!-- Main Grid Area -->
        <div class="flex-1 relative">
          <!-- Horizontal Grid Lines -->
          <div class="absolute inset-0 pointer-events-none">
            <div 
              v-for="hour in hours" 
              :key="hour" 
              class="h-[80px] border-b border-gray-100 relative"
            >
              <!-- Half-hour line -->
              <div class="absolute top-1/2 left-0 right-0 border-t border-gray-50"></div>
            </div>
          </div>

          <!-- Appointments (Absolute Positioned) -->
          <div 
            v-for="app in appointments" 
            :key="app._id"
            class="absolute left-2 right-2 rounded-md p-3 cursor-pointer transition-all hover:brightness-95 border overflow-hidden group"
            :class="getEventColor(app.status)"
            :style="getEventStyle(app)"
            @click="$emit('select', app)"
          >
            <!-- Left colored bar indicating status -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-black/20"></div>

            <div class="relative z-10 h-full flex flex-col">
              <div class="flex justify-between items-start gap-2">
                <span class="font-bold text-sm tracking-tight truncate">{{ app.user?.firstName }} {{ app.user?.lastName }}</span>
                <span class="text-sm font-bold whitespace-nowrap bg-white/20 px-1.5 rounded-md">{{ app.startTime }}</span>
              </div>
              
              <div class="mt-1 text-sm opacity-90 truncate font-medium">
                {{ app.items?.[0]?.service?.name || 'Service' }}
              </div>
              
              <div class="mt-auto pt-2 flex items-center justify-between text-sm font-bold">
                <span class="opacity-80">{{ app.items?.[0]?.service?.durationInMinutes || 0 }} min</span>
                <span>₦{{ app.price?.toLocaleString() || 0 }}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  appointments: any[];
  startHour?: number;
  endHour?: number;
}>();

defineEmits(['select']);

// Show full 24 hours to prevent any appointments from being hidden
const START_HOUR = props.startHour !== undefined ? props.startHour : 0;
const END_HOUR = props.endHour !== undefined ? props.endHour : 23;
const HOUR_HEIGHT = 80;

const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

const scrollContainer = ref<HTMLElement | null>(null);

const formatHour = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

const getEventStyle = (app: any) => {
  if (!app.startTime) return { display: 'none' };
  
  const [hStr, mStr] = app.startTime.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  
  // Skip if outside bounds
  if (h < START_HOUR || h > END_HOUR) return { display: 'none' };
  
  const minutesFromStart = (h - START_HOUR) * 60 + m;
  const top = (minutesFromStart / 60) * HOUR_HEIGHT;
  
  let duration = app.items?.[0]?.service?.durationInMinutes || 60;
  // Ensure minimum height for visibility
  if (duration < 15) duration = 15;
  
  const height = (duration / 60) * HOUR_HEIGHT;
  
  return {
    top: `${top}px`,
    height: `${height}px`,
  };
};

const getEventColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending': 
      return 'bg-[#FDF4E3] text-[#A67C00] border-[#FBE6A2]'; // Warm Yellow
    case 'confirmed': 
      return 'bg-[#E3F2FD] text-[#0061A6] border-[#A2D3FB]'; // Professional Blue (Fresha-like)
    case 'completed': 
      return 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'; // Emerald Green
    case 'cancelled': 
      return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'; // Red
    default: 
      return 'bg-[#F5F5F5] text-[#424242] border-[#E0E0E0]'; // Gray
  }
};

onMounted(() => {
  // Scroll to roughly current time (minus 1 hour for padding)
  if (scrollContainer.value) {
    const currentHour = new Date().getHours();
    const targetHour = Math.max(START_HOUR, currentHour - 1);
    scrollContainer.value.scrollTop = (targetHour - START_HOUR) * HOUR_HEIGHT;
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
