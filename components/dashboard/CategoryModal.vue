<template>
 <UiModal :isOpen="isOpen" :title="category ? 'Edit Category' : 'New Category'" description="Organize your menu with beautiful categories" size="sm" @close="$emit('close')">
 <form @submit.prevent="handleSubmit" class="space-y-6">
 <!-- Icon/Image (Optional) -->
 <div class="flex justify-center">
 <div 
 @click="triggerImageUpload"
 class="w-24 h-24 rounded-md bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF5C1A]/30 hover:bg-[#FF5C1A]/5 transition-all overflow-hidden relative group"
 >
 <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
 <div v-else class="text-center p-2">
 <Plus class="w-5 h-5 text-gray-400 mx-auto" />
 <p class="text-sm font-medium text-gray-400 mt-1">ICON</p>
 </div>
 <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" v-if="previewImage">
 <Camera class="w-5 h-5 text-white" />
 </div>
 <input type="file" ref="imageRef" class="hidden" @change="handleFileUpload" accept="image/*" />
 </div>
 </div>

 <div class="space-y-4">
 <UiAnimatedInput v-model="form.name" label="Category Name" placeholder="e.g. Traditional Soups, Buka Specials" required />
 <UiAnimatedInput v-model="form.description" type="textarea" label="Quick Description" placeholder="Optional" />
 </div>

 <div class="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-50">
 <span class="text-sm font-bold text-gray-700">Display this category</span>
 <input type="checkbox" v-model="form.isActive" class="w-5 h-5 rounded-md border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]" />
 </div>
 </form>

 <template #footer>
 <button @click="$emit('close')" class="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
 <button @click="handleSubmit" :disabled="loading" class="px-6 py-2.5 bg-[#FF5C1A] text-white rounded-md font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
 <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin" />
 {{ category ? 'Update' : 'Create' }}
 </button>
 </template>
 </UiModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Plus, Camera, Loader2 } from 'lucide-vue-next';
import UiModal from '@/components/ui/Modal.vue';
import { vendors_api } from '@/api_factory/modules/vendors';

const props = defineProps<{
 isOpen: boolean;
 category?: any;
}>();

const emit = defineEmits(['close', 'save']);
const loading = ref(false);
const imageRef = ref<HTMLInputElement | null>(null);
const previewImage = ref('');

const form = reactive({
 name: '',
 description: '',
 image: '',
 isActive: true
});

watch(() => props.category, (c) => {
 if (c) {
 Object.assign(form, { ...c });
 previewImage.value = c.image || '';
 } else {
 Object.assign(form, { name: '', description: '', image: '', isActive: true });
 previewImage.value = '';
 }
}, { immediate: true });

const triggerImageUpload = () => imageRef.value?.click();

const handleFileUpload = async (e: Event) => {
 const file = (e.target as HTMLInputElement).files?.[0];
 if (!file) return;

 loading.value = true;
 try {
 const res = await vendors_api.uploadImage(file);
 const url = res.data.url || res.data.secure_url;
 if (url) {
 form.image = url;
 previewImage.value = url;
 }
 } finally {
 loading.value = false;
 }
};

const handleSubmit = () => {
 emit('save', { ...form });
};
</script>
