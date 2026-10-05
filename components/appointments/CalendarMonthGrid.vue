<template>
  <div class="bg-white rounded-md border border-gray-50 overflow-hidden flex flex-col h-[70vh] min-h-[600px]">
    
    <!-- Days of the Week Header -->
    <div class="grid grid-cols-7 border-b border-gray-100 bg-gray-50 z-10 sticky top-0">
      <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="py-3 text-center border-r border-gray-100 last:border-r-0">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ day }}</span>
      </div>
    </div>

    <!-- Scrollable Month Grid -->
    <div class="flex-1 overflow-y-auto bg-white">
      <div class="grid grid-cols-7 border-l border-gray-100 min-h-full">
        <!-- Cells -->
        <div 
          v-for="day in calendarDays" 
          :key="day.iso" 
          class="border-r border-b border-gray-100 min-h-[120px] p-2 flex flex-col group relative transition-colors"
          :class="{
            'bg-gray-50/50': !day.isCurrentMonth,
            'bg-blue-50/30': day.isToday
          }"
        >
          <!-- Date Number -->
          <div class="flex justify-between items-start mb-2">
            <span 
              class="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold"
              :class="day.isToday ? 'bg-parentPrimary text-white' : (day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400')"
            >
              {{ day.date }}
            </span>
            <span v-if="getAppointmentsForDate(day.iso).length > 0" class="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded">
              {{ getAppointmentsForDate(day.iso).length }}
            </span>
          </div>

          <!-- Appointments List -->
          <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1 relative z-10">
            <div 
              v-for="app in getAppointmentsForDate(day.iso).slice(0, 4)" 
              :key="app._id"
              class="rounded text-[10px] px-1.5 py-1 truncate cursor-pointer hover:opacity-80 font-semibold border"
              :class="getEventColor(app.status)"
              @click.stop="$emit('select', app)"
            >
              {{ app.startTime }} - {{ app.user?.firstName }}
            </div>
            
            <!-- More indicator -->
            <div 
              v-if="getAppointmentsForDate(day.iso).length > 4"
              class="text-[10px] text-gray-500 font-medium px-1 cursor-pointer hover:text-gray-900"
              @click.stop="$emit('view-day', day.iso)"
            >
              +{{ getAppointmentsForDate(day.iso).length - 4 }} more
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  appointments: any[];
  currentDate: Date; // A date falling within the current month
}>();

defineEmits(['select', 'view-day']);

// Calculate days to show in the month grid
const calendarDays = computed(() => {
  const d = new Date(props.currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Adjust so Monday is 0, Sunday is 6
  let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6;
  
  const days = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Previous month overflow
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push(createDayObject(prevDate, false, todayStr));
  }

  // Current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const currDate = new Date(year, month, i);
    days.push(createDayObject(currDate, true, todayStr));
  }

  // Next month overflow to complete the grid (make total multiple of 7)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push(createDayObject(nextDate, false, todayStr));
    }
  }
  
  // Ensure we have 6 rows (42 days) so height is consistent
  while (days.length < 42) {
    const nextDate = new Date(year, month + 1, days.length - firstDayOfWeek - lastDayOfMonth.getDate() + 1);
    days.push(createDayObject(nextDate, false, todayStr));
  }

  return days;
});

const createDayObject = (dateObj: Date, isCurrentMonth: boolean, todayStr: string) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  const iso = `${y}-${m}-${d}`;
  
  return {
    date: dateObj.getDate(),
    iso,
    isCurrentMonth,
    isToday: iso === todayStr
  };
};

const getAppointmentsForDate = (isoString: string) => {
  return props.appointments
    .filter(app => {
      if (!app.scheduledDate) return false;
      const appDateStr = new Date(app.scheduledDate).toISOString().split('T')[0];
      return appDateStr === isoString;
    })
    .sort((a, b) => {
      // Sort by start time
      return (a.startTime || '').localeCompare(b.startTime || '');
    });
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
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
