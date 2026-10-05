<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="dialog">
      <div class="fixed inset-0 bg-black/40 transition-opacity" @click="$emit('close')"></div>

      <div class="relative bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all shadow-xl">
        <div class="p-6 sm:p-8 space-y-6">
          <h2 class="text-2xl font-bold  text-gray-800 tracking-tight mb-2">CREATE PACK</h2>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Name</label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Centimeters" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Description</label>
              <input 
                v-model="form.description" 
                type="text" 
                placeholder="Enter a description" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Price</label>
              <input 
                v-model="form.price" 
                type="number" 
                placeholder="Enter a price" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Maximum volume</label>
              <input 
                v-model="form.maxVolume" 
                type="text" 
                placeholder="Enter a maximum volume" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>
          </div>
          
          <div class="border-t border-gray-100 pt-6 mt-2">
            <div class="flex items-center justify-between">
              <button 
                type="button" 
                @click="$emit('close')"
                class="px-6 py-2.5 bg-[#E3E4E8] text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              
              <button 
                type="button" 
                @click="handleSubmit"
                :disabled="!isFormValid"
                class="px-6 py-2.5 bg-[#AEC5BB] text-white text-sm font-bold rounded-lg hover:bg-[#9db5ab] transition-all disabled:opacity-60"
              >
                Create pack
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'save']);

const form = reactive({
  name: '',
  description: '',
  price: '',
  maxVolume: ''
});

const isFormValid = computed(() => {
  return form.name.trim() !== '' && form.price !== '';
});

watch(() => props.isOpen, (val) => {
  if (val) {
    form.name = '';
    form.description = '';
    form.price = '';
    form.maxVolume = '';
  }
});

const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit('save', { ...form });
  emit('close');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}
</style>
