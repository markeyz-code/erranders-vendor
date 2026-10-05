<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="dialog">
      <div class="fixed inset-0 bg-black/40 transition-opacity" @click="$emit('close')"></div>

      <div class="relative bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all shadow-xl">
        <div class="p-6 sm:p-8 space-y-6">
          <h2 class="text-2xl font-bold  text-gray-800 tracking-tight mb-2 uppercase">{{ category ? 'EDIT CATEGORY' : 'CREATE CATEGORY' }}</h2>

          <div class="space-y-5">
            <!-- Image Upload -->
            <div class="flex items-center gap-4">
               <div 
                  @click="triggerImageUpload"
                  class="w-16 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all overflow-hidden relative shrink-0"
                  >
                  <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
                  <div v-else class="text-center">
                    <Camera class="w-5 h-5 text-gray-400 mx-auto" />
                  </div>
                  <input type="file" ref="imageRef" class="hidden" @change="handleFileUpload" accept="image/*" />
               </div>
               <div>
                  <p class="text-sm font-semibold text-gray-800">Category Icon</p>
                  <p class="text-xs text-gray-500 mt-0.5">Optional. PNG or JPG</p>
                  <div v-if="uploading" class="text-xs text-blue-500 mt-1 flex items-center gap-1 font-medium">
                     <Loader2 class="w-3 h-3 animate-spin" /> Uploading...
                  </div>
               </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Name</label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="e.g. Main Dishes, Soups" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Description <span class="text-xs text-gray-500 font-normal ml-1">(Optional)</span></label>
              <input 
                v-model="form.description" 
                type="text" 
                placeholder="Enter a description" 
                class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all"
              />
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-50">
               <div>
                 <p class="text-sm font-bold text-gray-900">Visibility Status</p>
                 <p class="text-xs text-gray-500 mt-0.5">Toggle to hide this category from the store.</p>
               </div>
               <button 
                @click="form.isActive = !form.isActive"
                class="relative w-12 h-7 rounded-full transition-all duration-300"
                :class="form.isActive ? 'bg-emerald-500' : 'bg-gray-300'"
                >
                <span 
                class="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300"
                :class="form.isActive ? 'left-6' : 'left-1'" 
                />
               </button>
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
                :disabled="loading || uploading || !form.name"
                class="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all disabled:opacity-40 disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
              >
                <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                {{ category ? 'Update category' : 'Create category' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Plus, Camera, Loader2 } from 'lucide-vue-next';
import { vendors_api } from '@/api_factory/modules/vendors';

const props = defineProps<{
 isOpen: boolean;
 category?: any;
}>();

const emit = defineEmits(['close', 'save']);
const loading = ref(false);
const uploading = ref(false);
const imageRef = ref<HTMLInputElement | null>(null);
const previewImage = ref('');

const form = reactive({
 name: '',
 description: '',
 image: '',
 isActive: true
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.category) {
      Object.assign(form, { ...props.category });
      previewImage.value = props.category.image || '';
    } else {
      Object.assign(form, { name: '', description: '', image: '', isActive: true });
      previewImage.value = '';
    }
  }
});

const triggerImageUpload = () => imageRef.value?.click();

const handleFileUpload = async (e: Event) => {
 const file = (e.target as HTMLInputElement).files?.[0];
 if (!file) return;

 uploading.value = true;
 try {
 const res = await vendors_api.uploadImage(file);
 const url = res.data.url || res.data.secure_url || res.data.data?.url;
 if (url) {
 form.image = url;
 previewImage.value = url;
 }
 } finally {
 uploading.value = false;
 }
};

const handleSubmit = () => {
 emit('save', { ...form });
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
