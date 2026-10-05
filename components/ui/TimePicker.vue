<template>
  <div class="relative w-full" ref="containerRef">
    <p v-if="label" class="text-sm font-bold text-gray-400 mb-1 ml-1">{{ label }}</p>
    <div 
      class="flex items-center w-full px-4 py-3.5 bg-white border border-gray-25 rounded-md transition-all cursor-pointer"
      :class="{ 'border-[#FF5C1A] ring-2 ring-[#FF5C1A]/10': openPopover !== null }"
      @click="openPopover = 'hour'"
    >
      <Clock class="w-4 h-4 text-gray-400 mr-2 shrink-0" />
      <div class="flex items-center flex-1" @click.stop>
        
        <!-- Hour -->
        <div class="relative">
          <div 
            @click="openPopover = openPopover === 'hour' ? null : 'hour'"
            class="w-8 text-center text-gray-900 font-bold bg-transparent rounded hover:bg-gray-100 py-1 cursor-pointer transition-colors"
            :class="{ 'bg-gray-100': openPopover === 'hour' }"
          >
            {{ padZero(hour) }}
          </div>
          
          <Transition name="fade">
            <div v-if="openPopover === 'hour'" class="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-1 w-16 h-48 bg-white border border-gray-50 rounded-md overflow-y-auto no-scrollbar py-1">
              <div 
                v-for="h in 12" :key="h" 
                @click="hour = h.toString(); openPopover = 'minute'"
                class="w-full text-center py-2 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                :class="parseInt(hour) === h ? 'text-[#FF5C1A] bg-orange-50/50' : 'text-gray-700'"
              >
                {{ padZero(h) }}
              </div>
            </div>
          </Transition>
        </div>

        <span class="text-gray-900 font-bold mx-0.5 pb-0.5 pointer-events-none">:</span>
        
        <!-- Minute -->
        <div class="relative">
          <div 
            @click="openPopover = openPopover === 'minute' ? null : 'minute'"
            class="w-8 text-center text-gray-900 font-bold bg-transparent rounded hover:bg-gray-100 py-1 cursor-pointer transition-colors"
            :class="{ 'bg-gray-100': openPopover === 'minute' }"
          >
            {{ padZero(minute) }}
          </div>
          
          <Transition name="fade">
            <div v-if="openPopover === 'minute'" class="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-1 w-16 h-48 bg-white border border-gray-50 rounded-md overflow-y-auto no-scrollbar py-1">
              <div 
                v-for="m in 60" :key="m-1" 
                @click="minute = (m-1).toString(); openPopover = null"
                class="w-full text-center py-2 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                :class="parseInt(minute) === (m-1) ? 'text-[#FF5C1A] bg-orange-50/50' : 'text-gray-700'"
              >
                {{ padZero(m-1) }}
              </div>
            </div>
          </Transition>
        </div>

        <!-- Period -->
        <div class="relative ml-1">
          <div 
            @click="openPopover = openPopover === 'period' ? null : 'period'"
            class="w-10 text-center text-gray-900 font-bold bg-transparent rounded hover:bg-gray-100 py-1 cursor-pointer transition-colors"
            :class="{ 'bg-gray-100': openPopover === 'period' }"
          >
            {{ period }}
          </div>
          
          <Transition name="fade">
            <div v-if="openPopover === 'period'" class="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-1 w-16 bg-white border border-gray-50 rounded-md py-1">
              <div 
                @click="period = 'AM'; openPopover = null"
                class="w-full text-center py-2 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                :class="period === 'AM' ? 'text-[#FF5C1A] bg-orange-50/50' : 'text-gray-700'"
              >
                AM
              </div>
              <div 
                @click="period = 'PM'; openPopover = null"
                class="w-full text-center py-2 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                :class="period === 'PM' ? 'text-[#FF5C1A] bg-orange-50/50' : 'text-gray-700'"
              >
                PM
              </div>
            </div>
          </Transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Clock } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  label?: string
}>()

const emit = defineEmits(['update:modelValue'])

const containerRef = ref<HTMLElement | null>(null)
const openPopover = ref<'hour' | 'minute' | 'period' | null>(null)

const hour = ref('12')
const minute = ref('00')
const period = ref<'AM' | 'PM'>('AM')

const padZero = (val: string | number) => {
  return parseInt(val as string).toString().padStart(2, '0')
}

const parseModelValue = () => {
  if (!props.modelValue) return
  const val = props.modelValue.trim()
  const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (match) {
    let h = parseInt(match[1])
    minute.value = match[2].padStart(2, '0')
    if (match[3]) {
      period.value = match[3].toUpperCase() as 'AM' | 'PM'
      hour.value = (h > 12 ? h - 12 : (h === 0 ? 12 : h)).toString().padStart(2, '0')
    } else {
      if (h >= 12) {
        period.value = 'PM'
        hour.value = (h === 12 ? 12 : h - 12).toString().padStart(2, '0')
      } else {
        period.value = 'AM'
        hour.value = (h === 0 ? 12 : h).toString().padStart(2, '0')
      }
    }
  }
}

watch(() => props.modelValue, parseModelValue, { immediate: true })

const updateValue = () => {
  const h = hour.value.padStart(2, '0')
  const m = minute.value.padStart(2, '0')
  emit('update:modelValue', `${h}:${m} ${period.value}`)
}

watch([hour, minute, period], () => {
  updateValue()
})

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    openPopover.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}
</style>
