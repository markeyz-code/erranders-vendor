<template>
  <div class="h-screen w-full flex flex-col font-sans relative overflow-hidden bg-white">
    <!-- Header / Toolbar -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-20 shrink-0">
      
      <!-- Left: Navigation & Date -->
      <div class="flex items-center gap-4">
        <button 
          @click="selectDate(new Date())"
          class="px-4 py-2 border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
        >
          Today
        </button>
        
        <div class="flex items-center gap-1 bg-gray-50 rounded-md p-1 border border-gray-200">
          <button @click="addDays(-1)" class="p-1.5 rounded-lg hover:bg-white hover: text-gray-600 transition-all">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button @click="addDays(1)" class="p-1.5 rounded-lg hover:bg-white hover: text-gray-600 transition-all">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Custom Date Picker Dropdown -->
        <DatePickerPopover v-model="currentDate" @update:modelValue="onDateChanged" />
        
        <!-- View Switcher -->
        <div class="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200 ml-4">
          <button 
            @click="setView('day')" 
            class="px-3 py-1.5 text-xs font-bold rounded transition-colors"
            :class="currentView === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          >
            Day
          </button>
          <button 
            @click="setView('week')" 
            class="px-3 py-1.5 text-xs font-bold rounded transition-colors"
            :class="currentView === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          >
            Week
          </button>
          <button 
            @click="setView('month')" 
            class="px-3 py-1.5 text-xs font-bold rounded transition-colors"
            :class="currentView === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          >
            Month
          </button>
        </div>

        <!-- Filter Mockup -->
        <button class="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-md transition-colors ml-2">
          <SlidersHorizontal class="w-4 h-4" />
        </button>
      </div>

      <!-- Right: Waitlist & Add -->
      <div class="flex items-center gap-3">
        <button 
          @click="isWaitlistOpen = true"
          class="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
        >
          <Users class="w-4 h-4" /> Waitlist
        </button>

        <button class="px-4 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-md transition-all flex items-center gap-2">
          Add <ChevronDown class="w-4 h-4 opacity-70" />
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden relative bg-white">
      <div v-if="loading && !appointmentsList.length" class="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
        <div class="animate-spin rounded-md h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <div class="h-full p-4 overflow-y-auto no-scrollbar">
        <!-- Day View -->
        <CalendarGrid 
          v-if="currentView === 'day'"
          :appointments="todaysAppointments" 
          @select="openAppointmentDetails" 
        />
        
        <!-- Week View -->
        <CalendarWeekGrid
          v-else-if="currentView === 'week'"
          :appointments="appointmentsList"
          :currentDate="currentDate"
          @select="openAppointmentDetails"
        />

        <!-- Month View -->
        <CalendarMonthGrid
          v-else-if="currentView === 'month'"
          :appointments="appointmentsList"
          :currentDate="currentDate"
          @select="openAppointmentDetails"
          @view-day="handleViewDay"
        />
      </div>
    </main>

    <!-- Side Drawers -->
    <WaitlistDrawer 
      :isOpen="isWaitlistOpen" 
      @close="isWaitlistOpen = false" 
    />
    <AppointmentDrawer 
      :isOpen="isAppointmentDrawerOpen"
      :appointment="selectedAppointment"
      :loading="loading"
      @close="isAppointmentDrawerOpen = false"
      @updateStatus="handleStatusUpdate"
      @verifyPayment="handleVerifyPayment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, Users } from 'lucide-vue-next';
import { useVendorAppointments } from '@/composables/modules/appointments';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';

// Import our new components
import DatePickerPopover from '@/components/appointments/DatePickerPopover.vue';
import CalendarGrid from '@/components/appointments/CalendarGrid.vue';
import CalendarWeekGrid from '@/components/appointments/CalendarWeekGrid.vue';
import CalendarMonthGrid from '@/components/appointments/CalendarMonthGrid.vue';
import WaitlistDrawer from '@/components/appointments/WaitlistDrawer.vue';
import AppointmentDrawer from '@/components/appointments/AppointmentDrawer.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Appointments - Errander Vendor' });

const { appointmentsList, loading, fetchAppointments, updateStatus, verifyPayment } = useVendorAppointments();
const { socket, connectSocket } = useRealtimeSocket();

// State
const currentView = ref<'day' | 'week' | 'month'>('day');
const currentDate = ref(new Date());
const isWaitlistOpen = ref(false);
const isAppointmentDrawerOpen = ref(false);
const selectedAppointment = ref<any>(null);

// Computeds
const todaysAppointments = computed(() => {
  return appointmentsList.value.filter(app => {
    if (!app.scheduledDate) return false;
    const appDateStr = new Date(app.scheduledDate).toISOString().split('T')[0];
    const y = currentDate.value.getFullYear();
    const m = String(currentDate.value.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.value.getDate()).padStart(2, '0');
    const currentDateStr = `${y}-${m}-${d}`;
    return appDateStr === currentDateStr;
  });
});

// Methods
const selectDate = (date: Date) => {
  currentDate.value = date;
  fetchAppointmentsForDate(date);
};

const addDays = (days: number) => {
  const newDate = new Date(currentDate.value);
  if (currentView.value === 'month') {
    newDate.setMonth(newDate.getMonth() + (days > 0 ? 1 : -1));
  } else if (currentView.value === 'week') {
    newDate.setDate(newDate.getDate() + (days > 0 ? 7 : -7));
  } else {
    newDate.setDate(newDate.getDate() + days);
  }
  selectDate(newDate);
};

const onDateChanged = (newDate: Date) => {
  fetchAppointmentsForDate(newDate);
};

const setView = (view: 'day' | 'week' | 'month') => {
  currentView.value = view;
  fetchAppointmentsForDate(currentDate.value);
};

const handleViewDay = (iso: string) => {
  const [y, m, d] = iso.split('-');
  currentDate.value = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  setView('day');
};

const fetchAppointmentsForDate = async (date: Date) => {
  if (currentView.value === 'day') {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    await fetchAppointments({ date: `${y}-${m}-${d}` });
  } else if (currentView.value === 'week') {
    const dObj = new Date(date);
    const day = dObj.getDay();
    const diff = dObj.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(dObj.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const sy = monday.getFullYear();
    const sm = String(monday.getMonth() + 1).padStart(2, '0');
    const sd = String(monday.getDate()).padStart(2, '0');
    
    const ey = sunday.getFullYear();
    const em = String(sunday.getMonth() + 1).padStart(2, '0');
    const ed = String(sunday.getDate()).padStart(2, '0');
    
    await fetchAppointments({ startDate: `${sy}-${sm}-${sd}`, endDate: `${ey}-${em}-${ed}` });
  } else if (currentView.value === 'month') {
    const y = date.getFullYear();
    const m = date.getMonth();
    
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    
    // Expand to cover grid overflow
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;
    const gridStart = new Date(y, m, 1 - firstDayOfWeek);
    
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridStart.getDate() + 41); // 42 days total

    const sy = gridStart.getFullYear();
    const sm = String(gridStart.getMonth() + 1).padStart(2, '0');
    const sd = String(gridStart.getDate()).padStart(2, '0');
    
    const ey = gridEnd.getFullYear();
    const em = String(gridEnd.getMonth() + 1).padStart(2, '0');
    const ed = String(gridEnd.getDate()).padStart(2, '0');

    await fetchAppointments({ startDate: `${sy}-${sm}-${sd}`, endDate: `${ey}-${em}-${ed}` });
  }
};

const openAppointmentDetails = (app: any) => {
  selectedAppointment.value = app;
  isAppointmentDrawerOpen.value = true;
};

const handleStatusUpdate = async ({ id, status }: { id: string, status: string }) => {
  const success = await updateStatus(id, status);
  if (success && selectedAppointment.value && selectedAppointment.value._id === id) {
    selectedAppointment.value = appointmentsList.value.find(a => a._id === id);
  }
};

const handleVerifyPayment = async (id: string) => {
  const success = await verifyPayment(id);
  if (success && selectedAppointment.value && selectedAppointment.value._id === id) {
    selectedAppointment.value = appointmentsList.value.find(a => a._id === id);
  }
};

onMounted(() => {
  fetchAppointmentsForDate(currentDate.value);
  
  if (!socket.value) {
    connectSocket();
  }
  
  if (socket.value) {
    socket.value.on('notification', async (payload: any) => {
      // Refresh the calendar for any booking-related notification
      await fetchAppointmentsForDate(currentDate.value);
      if (selectedAppointment.value) {
        selectedAppointment.value = appointmentsList.value.find(a => a._id === selectedAppointment.value._id) || selectedAppointment.value;
      }
    });
  }
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (socket.value) {
    socket.value.off('notification');
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
