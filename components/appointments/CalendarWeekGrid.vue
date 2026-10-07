<template>
  <div class="bg-white rounded-md border border-gray-50 overflow-hidden flex flex-col h-[70vh] min-h-[600px]">
    
    <!-- Top Headers (Days of the week) -->
    <div class="flex border-b border-gray-100 bg-white z-10 sticky top-0">
      <div class="w-16 shrink-0 border-r border-gray-100 bg-white"></div>
      <div v-for="day in weekDays" :key="day.iso" class="flex-1 py-4 text-center border-r border-gray-100 last:border-r-0">
        <div class="inline-flex flex-col items-center justify-center">
          <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">{{ day.name }}</span>
          <div 
            class="w-8 h-8 mt-1 rounded-full flex items-center justify-center font-bold text-sm"
            :class="day.isToday ? 'bg-parentPrimary text-white' : 'text-gray-900'"
          >
            {{ day.date }}
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Grid -->
    <div class="flex-1 overflow-y-auto relative no-scrollbar bg-gray-50/30" ref="scrollContainer">
      <div class="flex relative min-w-[800px]">
        
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

        <!-- Main Grid Area (7 columns) -->
        <div class="flex-1 flex relative">
          <!-- Horizontal Grid Lines (background) -->
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

          <!-- Day Columns -->
          <div 
            v-for="day in weekDays" 
            :key="day.iso" 
            class="flex-1 border-r border-gray-100 last:border-r-0 relative"
          >
            <!-- Appointments for this specific day -->
            <div 
              v-for="app in getAppointmentsForDate(day.iso)" 
              :key="app._id"
              class="absolute left-1 right-1 rounded-md p-2 cursor-pointer transition-all hover:brightness-95 border overflow-hidden group shadow-sm"
              :class="getEventColor(app.status)"
              :style="getEventStyle(app)"
              @click="$emit('select', app)"
            >
              <!-- Left colored bar indicating status -->
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-black/20"></div>

              <div class="relative z-10 h-full flex flex-col overflow-hidden">
                <div class="font-bold text-sm tracking-tight truncate leading-tight">
                  {{ app.user?.firstName }} {{ app.user?.lastName }}
                </div>
                
                <div class="text-[10px] opacity-90 truncate mt-0.5 leading-tight">
                  {{ app.items?.[0]?.service?.name || 'Service' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  appointments: any[];
  currentDate: Date; // A date falling within the current week
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

// Calculate the 7 days of the week based on currentDate
const weekDays = computed(() => {
  const d = new Date(props.currentDate);
  // Get Monday of the week
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  
  const days = [];
  
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = String(today.getMonth() + 1).padStart(2, '0');
  const todayD = String(today.getDate()).padStart(2, '0');
  const todayStr = `${todayY}-${todayM}-${todayD}`;

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const dt = String(current.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${dt}`;
    
    days.push({
      iso,
      name: current.toLocaleDateString('en-US', { weekday: 'short' }),
      date: current.getDate(),
      isToday: iso === todayStr
    });
  }
  return days;
});

const getAppointmentsForDate = (isoString: string) => {
  return props.appointments.filter(app => {
    if (!app.scheduledDate) return false;
    const appDateStr = new Date(app.scheduledDate).toISOString().split('T')[0];
    return appDateStr === isoString;
  });
};

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
      return 'bg-[#FDF4E3] text-[#A67C00] border-[#FBE6A2]'; 
    case 'confirmed': 
      return 'bg-[#E3F2FD] text-[#0061A6] border-[#A2D3FB]';
    case 'completed': 
      return 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'; 
    case 'cancelled': 
      return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]';
    default: 
      return 'bg-[#F5F5F5] text-[#424242] border-[#E0E0E0]';
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
