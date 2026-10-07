<template>
  <div class="relative w-full z-[9999]">
    <div class="relative z-[95] group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300" :class="isOpen ? 'text-parentPrimary' : 'text-gray-400'">
        <MapPin class="h-4 w-4" />
      </div>
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        :placeholder="placeholder"
        :required="required"
        class="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-100 focus:bg-gray-100 rounded-2xl text-sm md:text-sm font-medium text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        <button 
          v-if="modelValue && !loading" 
          @click="clearInput" 
          class="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
        <div v-if="loading" class="pr-2">
          <Loader2 class="h-4 w-4 text-parentPrimary animate-spin" />
        </div>
      </div>
    </div>

    <!-- Dropdown -->
    <Transition name="slide-fade">
      <div 
        v-if="isOpen && (suggestions.length > 0 || loading || error || (!loading && modelValue.length > 2 && suggestions.length === 0))" 
        class="absolute z-[99999] w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-50 overflow-hidden"
      >
        <div class="p-2">
          <!-- Loading State inside dropdown -->
          <div v-if="loading && suggestions.length === 0" class="flex flex-col items-center justify-center py-6 gap-2 text-gray-400">
            <Loader2 class="h-6 w-6 text-parentPrimary/50 animate-spin" />
            <p class="text-sm font-medium">Searching map...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex flex-col items-center justify-center py-6 gap-2 text-rose-400">
            <AlertCircle class="h-6 w-6" />
            <p class="text-sm font-medium">{{ error }}</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && modelValue.length > 2 && suggestions.length === 0" class="flex flex-col items-center justify-center py-6 gap-2 text-gray-400">
            <Map class="h-6 w-6 opacity-50" />
            <p class="text-sm font-medium">No locations found</p>
          </div>

          <!-- Suggestions List -->
          <ul v-else-if="suggestions.length > 0" class="max-h-64 overflow-y-auto custom-scrollbar">
            <li 
              v-for="suggestion in suggestions" 
              :key="suggestion.id"
              @click="selectSuggestion(suggestion)"
              @touchstart.passive="selectSuggestion(suggestion)"
              class="px-3 py-3 hover:bg-parentPrimary/5 rounded-xl cursor-pointer flex items-center gap-3 transition-colors mb-1 last:mb-0 group/item"
            >
              <div class="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover/item:bg-parentPrimary/10 group-hover/item:text-parentPrimary transition-colors text-gray-400">
                <MapPin class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">{{ suggestion.text }}</p>
                <p class="text-[11px] font-medium text-gray-500 truncate">{{ suggestion.place_name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
    
    <!-- Backdrop to close dropdown -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[90]" 
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { MapPin, Loader2, X, AlertCircle, Map } from 'lucide-vue-next';
import { useRuntimeConfig } from '#app';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search for your address...'
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const loading = ref(false);
const error = ref('');
const suggestions = ref<any[]>([]);

let debounceTimeout: any = null;

const fetchSuggestions = async (query: string) => {
  if (!query.trim() || query.length < 3) {
    suggestions.value = [];
    error.value = '';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const config = useRuntimeConfig();
    const token = config.public.mapboxToken;
    
    if (!token) {
      error.value = 'Mapbox token is missing. Please contact support.';
      console.error('Mapbox token is missing');
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=ng&limit=5&types=address,poi,place,neighborhood`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch data');
    
    const data = await res.json();
    suggestions.value = (data.features || []).map((item: any) => ({
      id: item.id,
      text: item.text,
      place_name: item.place_name,
      center: item.center
    }));
    isOpen.value = true;
  } catch (err: any) {
    console.error('Mapbox geocoding error:', err);
    error.value = 'Could not load suggestions. Check connection.';
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  emit('update:modelValue', val);
  
  clearTimeout(debounceTimeout);
  
  if (val.length < 3) {
    suggestions.value = [];
    error.value = '';
    return;
  }
  
  isOpen.value = true;
  debounceTimeout = setTimeout(() => {
    fetchSuggestions(val);
  }, 400);
};

const handleFocus = () => {
  isOpen.value = true;
  if (props.modelValue && props.modelValue.length >= 3 && suggestions.value.length === 0) {
    fetchSuggestions(props.modelValue);
  }
};

const clearInput = () => {
  emit('update:modelValue', '');
  suggestions.value = [];
  error.value = '';
  isOpen.value = false;
  if (inputRef.value) inputRef.value.focus();
};

const selectSuggestion = (suggestion: any) => {
  const address = suggestion.place_name;
  const coordinates = suggestion.center; // [longitude, latitude]
  
  emit('update:modelValue', address);
  emit('select', { address, coordinates });
  
  suggestions.value = [];
  error.value = '';
  isOpen.value = false;
};

onUnmounted(() => {
  clearTimeout(debounceTimeout);
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #d1d5db;
}
</style>
