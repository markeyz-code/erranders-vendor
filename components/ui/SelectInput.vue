<template>
 <div class="relative" ref="containerRef">
 <!-- Header -->
 <div class="flex items-center justify-between mb-2 px-1">
 <label v-if="label" class="text-sm text-gray-400">
 {{ label }}
 </label>
 <div v-if="info" class="group relative">
 <Info class="w-3.5 h-3.5 text-gray-300 hover:text-[#FF5C1A] cursor-help transition-colors" />
 <div class="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
 {{ info }}
 </div>
 </div>
 </div>

 <!-- Select trigger -->
 <div
 @click="toggleDropdown"
 class="w-full h-12 px-4 bg-white border border-gray-50 rounded-md flex justify-between items-center cursor-pointer hover:border-[#FF5C1A] transition-all duration-300"
 :class="[ disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '', showDropdown ? 'ring-2 ring-[#FF5C1A]/10 border-[#FF5C1A] ' : '', (hasError || (errorMessage && showError)) ? 'border-red-500 ring-red-500/10' : '' ]"
 >
 <span v-if="selectedLabel" class="text-sm font-medium text-gray-900 truncate">
 <slot v-if="slots['selected-label'] && selectedOption" name="selected-label" :option="selectedOption" />
 <template v-else>{{ selectedLabel }}</template>
 </span>
 <span v-else class="text-sm font-medium text-gray-300">Select an option</span>
 
 <ChevronDown
 class="w-4 h-4 text-gray-400 transition-transform duration-300"
 :class="{ 'transform rotate-180 text-[#FF5C1A]': showDropdown }"
 />
 </div>

 <!-- Dropdown -->
 <Transition name="dropdown">
 <div
 v-if="showDropdown"
 class="absolute z-50 mt-2 w-full bg-white rounded-md border border-gray-50 overflow-hidden"
 >
 <!-- Search Input -->
 <div class="p-3 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md">
 <div class="relative">
 <Search class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
 <input
 ref="searchInputRef"
 v-model="searchQuery"
 type="text"
 class="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border-none rounded-md outline-none text-base font-medium text-gray-900 placeholder-gray-300"
 placeholder="Search options..."
 @click.stop
 />
 </div>
 </div>
 
 <!-- Options List -->
 <div class="max-h-60 overflow-y-auto hide-scrollbar p-1.5">
 <div
 v-for="(option, index) in filteredOptions"
 :key="index"
 @click="selectOption(option)"
 class="px-4 py-3 rounded-md cursor-pointer transition-all flex items-center justify-between group"
 :class="[ getValue(option) === modelValue ? 'bg-[#FF5C1A]/5 text-[#FF5C1A]' : 'text-gray-600 hover:bg-gray-50' ]"
 >
 <div class="flex-1 min-w-0">
 <slot v-if="slots.default" :option="option" :index="index" />
 <template v-else>
 <p class="text-[13px] font-bold truncate group-hover:translate-x-1 transition-transform">{{ getLabel(option) }}</p>
 </template>
 </div>
 <Check v-if="getValue(option) === modelValue" class="w-4 h-4 shrink-0" />
 </div>
 
 <div v-if="filteredOptions.length === 0" class="p-4 text-center">
 <div class="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center mx-auto mb-3">
 <Search class="w-5 h-5 text-gray-200" />
 </div>
 <p class="text-sm font-bold text-gray-400 mb-2">No results found</p>
 <button 
 v-if="allowCustom && searchQuery.trim()" 
 @click="selectCustomOption()"
 class="w-full py-2 px-4 bg-[#FF5C1A]/10 text-[#FF5C1A] text-sm font-bold rounded-md hover:bg-[#FF5C1A]/20 transition-colors"
 >
 Add "{{ searchQuery }}"
 </button>
 </div>
 </div>
 </div>
 </Transition>

 <!-- Footer Description -->
 <div class="flex items-start justify-between mt-1.5 px-1">
 <div v-if="description" class="text-sm font-medium text-gray-400">
 e.g. {{ description }}
 </div>
 <Transition name="slide-fade">
 <p v-if="errorMessage && showError" class="text-sm font-bold text-red-500 r">
 {{ errorMessage }}
 </p>
 </Transition>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, useId, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Search, Info, Check } from 'lucide-vue-next'

interface Props {
 modelValue?: string | number
 label: string
 options?: Array<string | { label?: string, value?: string | number, name?: string, code?: string, [key: string]: any }>
 info?: string
 description?: string
 disabled?: boolean
 errorMessage?: string
 showError?: boolean
 hasError?: boolean
 allowCustom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
 modelValue: '',
 options: () => [],
 disabled: false,
 errorMessage: '',
 showError: true,
 hasError: false,
 allowCustom: false
})

const slots = defineSlots<{
 default?: (props: { option: any, index: number }) => any
 'selected-label'?: (props: { option: any }) => any
}>()

const emit = defineEmits<{
 (e: 'update:modelValue', value: string | number): void
}>()

const showDropdown = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const inputId = useId()

const toggleDropdown = async () => {
 if (!props.disabled) {
 showDropdown.value = !showDropdown.value
 if (showDropdown.value) {
 await nextTick()
 searchInputRef.value?.focus()
 } else {
 searchQuery.value = ''
 }
 }
}

const selectOption = (option: any) => {
 emit('update:modelValue', getValue(option))
 showDropdown.value = false
 searchQuery.value = ''
}

const selectCustomOption = () => {
  const customVal = searchQuery.value.trim()
  if (customVal) {
    emit('update:modelValue', customVal)
    showDropdown.value = false
    searchQuery.value = ''
  }
}

const getLabel = (option: any): string => {
 if (typeof option === 'string') return option
 return option.label || option.name || option.value || option.code || String(option)
}

const getValue = (option: any): string | number => {
 if (typeof option === 'string') return option
 return option.value !== undefined ? option.value : option.code || option.name || option
}

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => getValue(opt) === props.modelValue)
  if (found) return getLabel(found)
  if (props.allowCustom && props.modelValue) return String(props.modelValue)
  return ''
})

const selectedOption = computed(() => {
 return props.options.find((opt) => getValue(opt) === props.modelValue)
})

const filteredOptions = computed(() => {
 if (!searchQuery.value.trim()) return props.options
 const query = searchQuery.value.toLowerCase()
 return props.options.filter((option) => getLabel(option).toLowerCase().includes(query))
})

const handleClickOutside = (event: MouseEvent) => {
 if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
 showDropdown.value = false
 searchQuery.value = ''
 }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active {
 transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
 transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
 opacity: 0;
 transform: translateY(-10px) scale(0.95);
}

.slide-fade-enter-active, .slide-fade-leave-active {
 transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
 opacity: 0;
 transform: translateY(-5px);
}

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>