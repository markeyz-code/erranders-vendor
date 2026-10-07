<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full md:translate-y-0 md:translate-x-full"
      enter-to-class="translate-y-0 md:translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0 md:translate-x-0"
      leave-to-class="translate-y-full md:translate-y-0 md:translate-x-full"
    >
      <div v-if="isOpen" class="fixed inset-x-0 bottom-0 md:top-4 md:bottom-4 md:right-4 md:left-auto z-[101] bg-white rounded-t-[2rem] md:rounded-md md:w-[600px] flex flex-col max-h-[90vh] md:max-h-[calc(100vh-2rem)] border border-gray-25 overflow-hidden h-full">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <h2 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2"><Info class="w-4 h-4 text-parentPrimary"/> Basic Information</h3>
            
            <div class="grid gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Service Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. Classic European Massage" class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-md focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all" />
              </div>
              <div>
                <SelectInput 
                  v-model="form.category" 
                  label="Category" 
                  :options="categories" 
                  description="Select a category"
                  required 
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Briefly describe what this service includes..." class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-md focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all"></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1.5">Base Price (₦)</label>
                  <input :value="formatPrice(form.price)" @input="form.price = parsePrice($event.target.value)" type="text" placeholder="30,000" class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-md focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1.5">Base Duration (Mins)</label>
                  <input v-model.number="form.durationInMinutes" type="number" placeholder="60" class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-md focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all" />
                </div>
              </div>
              
              <div class="pt-2">
                <label class="block text-sm font-bold text-gray-700 mb-2">Service Media (Optional)</label>
                <div class="flex items-center gap-3">
                  <button type="button" @click="triggerImageUpload(-1)" class="h-20 w-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0 relative overflow-hidden group">
                    <template v-if="uploadingImageIdx === -1">
                      <Loader2 class="w-5 h-5 animate-spin text-gray-400" />
                    </template>
                    <template v-else-if="form.image">
                      <img :src="form.image" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 class="w-5 h-5 text-white" />
                      </div>
                    </template>
                    <template v-else>
                      <ImageIcon class="w-5 h-5 text-gray-400 mb-1" />
                      <span class="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Image</span>
                    </template>
                  </button>
                  
                  <button type="button" @click="triggerVideoUpload(-1)" class="h-20 w-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0 relative overflow-hidden group">
                    <template v-if="uploadingVideoIdx === -1">
                      <Loader2 class="w-5 h-5 animate-spin text-gray-400" />
                    </template>
                    <template v-else-if="form.video">
                      <video :src="form.video" class="w-full h-full object-cover"></video>
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 class="w-5 h-5 text-white" />
                      </div>
                    </template>
                    <template v-else>
                      <VideoIcon class="w-5 h-5 text-gray-400 mb-1" />
                      <span class="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Video</span>
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-100" />

          <!-- Variants -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2"><Layers class="w-4 h-4 text-blue-500"/> Service Variants</h3>
              <button @click="addVariant" class="text-sm font-bold text-parentPrimary hover:underline">Add Variant</button>
            </div>
            <p class="text-sm text-gray-500">Provide different duration/price options (e.g. "Pick me up - 30mins", "Classic - 1hr"). If left empty, the base price/duration is used.</p>
            
            <div v-for="(v, idx) in form.variants" :key="idx" class="p-4 bg-gray-50 border border-gray-50 rounded-md space-y-3 relative group">
              <button @click="removeVariant(idx)" class="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 class="w-3.5 h-3.5"/></button>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Variant Name</label>
                <input v-model="v.name" type="text" placeholder="e.g. A little longer" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Price (₦)</label>
                  <input :value="formatPrice(v.price)" @input="v.price = parsePrice($event.target.value)" type="text" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Duration (Mins)</label>
                  <input v-model.number="v.durationInMinutes" type="number" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
                </div>
              </div>
              <div class="mt-3">
                <label class="block text-sm font-bold text-gray-700 mb-2">Variant Media (Optional)</label>
                <div class="flex items-center gap-3">
                  <button type="button" @click="triggerImageUpload(idx)" class="h-16 w-16 rounded-lg bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0 relative overflow-hidden group">
                    <template v-if="uploadingImageIdx === idx">
                      <Loader2 class="w-4 h-4 animate-spin text-gray-400" />
                    </template>
                    <template v-else-if="v.image">
                      <img :src="v.image" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 class="w-4 h-4 text-white" />
                      </div>
                    </template>
                    <template v-else>
                      <ImageIcon class="w-4 h-4 text-gray-400 mb-1" />
                      <span class="text-[9px] font-medium text-gray-500 uppercase tracking-wider">Image</span>
                    </template>
                  </button>
                  
                  <button type="button" @click="triggerVideoUpload(idx)" class="h-16 w-16 rounded-lg bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0 relative overflow-hidden group">
                    <template v-if="uploadingVideoIdx === idx">
                      <Loader2 class="w-4 h-4 animate-spin text-gray-400" />
                    </template>
                    <template v-else-if="v.video">
                      <video :src="v.video" class="w-full h-full object-cover"></video>
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 class="w-4 h-4 text-white" />
                      </div>
                    </template>
                    <template v-else>
                      <VideoIcon class="w-4 h-4 text-gray-400 mb-1" />
                      <span class="text-[9px] font-medium text-gray-500 uppercase tracking-wider">Video</span>
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-100" />

          <!-- Extras -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2"><Sparkles class="w-4 h-4 text-amber-500"/> Extra Add-ons</h3>
              <button @click="addExtra" class="text-sm font-bold text-amber-500 hover:underline">Add Extra</button>
            </div>
            <p class="text-sm text-gray-500">Suggest optional upsells clients can add to this service (e.g. "TNC Signature Pedicure").</p>
            
            <div v-for="(ext, idx) in form.extras" :key="idx" class="p-4 bg-amber-50/50 border border-amber-100 rounded-md space-y-3 relative group">
              <button @click="removeExtra(idx)" class="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 class="w-3.5 h-3.5"/></button>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Extra Name</label>
                <input v-model="ext.name" type="text" placeholder="e.g. Pedicure" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Extra Price (₦)</label>
                  <input :value="formatPrice(ext.price)" @input="ext.price = parsePrice($event.target.value)" type="text" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Added Duration (Mins)</label>
                  <input v-model.number="ext.durationInMinutes" type="number" class="w-full bg-white border border-gray-25 text-gray-900 text-base rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button 
            @click="handleSubmit" 
            :disabled="loading"
            class="w-full py-2.5 bg-parentPrimary text-white rounded-md text-sm font-bold hover:brightness-110 hover: transition-all flex items-center justify-center disabled:opacity-50"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span v-else>{{ isEditing ? 'Save Changes' : 'Publish Service' }}</span>
          </button>
        </div>
      </div>
    </Transition>
    <input type="file" ref="fileInputRef" class="hidden" @change="handleImageUpload" accept="image/*" />
    <input type="file" ref="videoInputRef" class="hidden" @change="handleVideoUpload" accept="video/mp4,video/quicktime" />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Info, Layers, Sparkles, Trash2, Loader2, Image as ImageIcon, Video as VideoIcon, Edit2 } from 'lucide-vue-next';
import SelectInput from '@/components/ui/SelectInput.vue';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  isOpen: boolean;
  service?: any;
  categories?: any[];
}>();

const emit = defineEmits(['close', 'save']);

const loading = ref(false);
const isEditing = ref(false);
const { showToast } = useCustomToast();

const uploadingImageIdx = ref<number | null>(null);
const uploadingVideoIdx = ref<number | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);

const formatPrice = (val: number | string) => {
  if (!val) return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parsePrice = (val: string) => {
  const num = parseInt(val.replace(/,/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

const form = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  durationInMinutes: 30,
  image: '',
  video: '',
  variants: [] as any[],
  extras: [] as any[]
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.service) {
      isEditing.value = true;
      form.value = { 
        ...props.service,
        variants: props.service.variants ? [...props.service.variants] : [],
        extras: props.service.extras ? [...props.service.extras] : []
      };
    } else {
      isEditing.value = false;
      form.value = {
        name: '',
        category: '',
        description: '',
        price: 0,
        durationInMinutes: 30,
        image: '',
        video: '',
        variants: [],
        extras: []
      };
    }
  }
});

const addVariant = () => form.value.variants.push({ name: '', price: 0, durationInMinutes: 30, image: '', video: '' });
const removeVariant = (idx: number) => form.value.variants.splice(idx, 1);

const triggerImageUpload = (idx: number) => {
  uploadingImageIdx.value = idx;
  fileInputRef.value?.click();
};

const triggerVideoUpload = (idx: number) => {
  uploadingVideoIdx.value = idx;
  videoInputRef.value?.click();
};

const handleImageUpload = async (e: Event) => {
  if (uploadingImageIdx.value === null) return;
  const idx = uploadingImageIdx.value;
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const res = await vendors_api.uploadImage(file);
    const url = res.data?.url || res.data?.data?.url || res.data;
    if (idx === -1) {
      form.value.image = url;
    } else if (form.value.variants[idx]) {
      form.value.variants[idx].image = url;
    }
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to upload image.', toastType: 'error' });
  } finally {
    uploadingImageIdx.value = null;
    if (fileInputRef.value) fileInputRef.value.value = '';
  }
};

const handleVideoUpload = async (e: Event) => {
  if (uploadingVideoIdx.value === null) return;
  const idx = uploadingVideoIdx.value;
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    showToast({ title: 'Too large', message: 'Video must be less than 20MB', toastType: 'error' });
    return;
  }

  try {
    const res = await vendors_api.uploadVideo(file);
    const url = res.data?.url || res.data?.data?.url || res.data;
    if (idx === -1) {
      form.value.video = url;
    } else if (form.value.variants[idx]) {
      form.value.variants[idx].video = url;
    }
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to upload video.', toastType: 'error' });
  } finally {
    uploadingVideoIdx.value = null;
    if (videoInputRef.value) videoInputRef.value.value = '';
  }
};

const addExtra = () => form.value.extras.push({ name: '', price: 0, durationInMinutes: 0 });
const removeExtra = (idx: number) => form.value.extras.splice(idx, 1);

const handleSubmit = async () => {
  loading.value = true;
  try {
    emit('save', form.value);
  } finally {
    setTimeout(() => { loading.value = false; }, 1000); // Simulate network if emit doesn't await
  }
};
</script>
