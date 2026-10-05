<template>
  <div class="relative" ref="popoverRef">
    <button 
      @click="toggle"
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-25 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-parentPrimary/20"
    >
      <span class="text-sm font-bold text-gray-900">{{ formattedDate }}</span>
      <ChevronDown class="w-4 h-4 text-gray-500" :class="{'rotate-180': isOpen}" />
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isOpen" class="absolute top-full left-0 mt-2 w-[340px] bg-white rounded-md border border-gray-50 z-50 p-4">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft class="w-4 h-4 text-gray-600" />
          </button>
          <span class="text-sm font-bold text-gray-900">{{ currentMonthName }} {{ currentYear }}</span>
          <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight class="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <!-- Days Header -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-center text-xs font-bold text-gray-400">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="{ date, isCurrentMonth, isSelected, isToday } in calendarDays"
            :key="date.toISOString()"
            @click="selectDate(date)"
            class="h-9 w-9 mx-auto rounded-md flex items-center justify-center text-sm font-semibold transition-all relative"
            :class="[ !isCurrentMonth ? 'text-gray-300 hover:text-gray-500' : 'text-gray-700 hover:bg-gray-100', isSelected ? 'bg-parentPrimary text-white hover:bg-parentPrimary' : '', isToday && !isSelected ? 'text-parentPrimary' : '' ]"
          >
            {{ date.getDate() }}
            <div v-if="isToday && !isSelected" class="absolute bottom-1 w-1 h-1 rounded-md bg-parentPrimary"></div>
          </button>
        </div>

        <!-- Quick Filters -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
          <button @click="selectDate(new Date())" class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-25">Today</button>
          <button @click="addDays(1)" class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-25">Tomorrow</button>
          <button @click="addDays(7)" class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-25">In 1 week</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: Date;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const popoverRef = ref<HTMLElement | null>(null);

const displayDate = ref(new Date(props.modelValue));

watch(() => props.modelValue, (newVal) => {
  displayDate.value = new Date(newVal);
});

const toggle = () => isOpen.value = !isOpen.value;

const close = (e: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', close));
onUnmounted(() => document.removeEventListener('click', close));

const formattedDate = computed(() => {
  const d = props.modelValue;
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
});

const currentMonthName = computed(() => displayDate.value.toLocaleString('default', { month: 'long' }));
const currentYear = computed(() => displayDate.value.getFullYear());

const prevMonth = () => displayDate.value = new Date(displayDate.value.getFullYear(), displayDate.value.getMonth() - 1, 1);
const nextMonth = () => displayDate.value = new Date(displayDate.value.getFullYear(), displayDate.value.getMonth() + 1, 1);

const selectDate = (date: Date) => {
  emit('update:modelValue', date);
  isOpen.value = false;
};

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  selectDate(d);
};

const calendarDays = computed(() => {
  const year = displayDate.value.getFullYear();
  const month = displayDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  const today = new Date();
  
  // Get day of week, adjusting to make Monday = 0, Sunday = 6
  let firstDayOfWeek = firstDay.getDay() - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6;
  
  // Padding for previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(createDayObject(new Date(year, month, -i), false));
  }
  
  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(createDayObject(new Date(year, month, i), true));
  }
  
  // Padding for next month
  let lastDayOfWeek = lastDay.getDay() - 1;
  if (lastDayOfWeek === -1) lastDayOfWeek = 6;
  
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    days.push(createDayObject(new Date(year, month + 1, i), false));
  }
  
  return days;
});

const createDayObject = (date: Date, isCurrentMonth: boolean) => {
  const today = new Date();
  return {
    date,
    isCurrentMonth,
    isSelected: date.toDateString() === props.modelValue.toDateString(),
    isToday: date.toDateString() === today.toDateString()
  };
};
</script>
