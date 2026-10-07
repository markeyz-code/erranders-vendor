<template>
  <Modal :isOpen="isOpen" @close="$emit('close')" title="Combo Pack" size="lg">
    <div class="space-y-8 py-2">

      <!-- 1. BASIC INFO -->
      <section class="space-y-5">
        <div>
          <label class="text-sm font-semibold text-gray-800 block mb-1.5">Pack Name</label>
          <input type="text" v-model="form.name" placeholder="e.g. Student Special" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all" required />
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-800 block mb-1.5">Description</label>
          <textarea v-model="form.description" placeholder="e.g. 2 plates Fried Rice + Zobo — bundle discount" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all resize-none h-20"></textarea>
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-800 block">Category</label>
              <p class="text-[13px] text-gray-500 mt-0.5">e.g. Combo Packs</p>
            </div>
            <button type="button" @click="$emit('createCategory')" class="shrink-0 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5">
              <Plus class="w-4 h-4" /> Create
            </button>
          </div>
          <select v-model="form.categoryId" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all">
            <option value="">Select a category</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
        </div>
      </section>

      <!-- 2. IMAGE -->
      <section class="space-y-3">
        <div>
          <h3 class="text-sm font-semibold text-gray-800">Pack Image</h3>
          <p class="text-[13px] text-gray-500 mt-0.5">Upload a photo for this combo</p>
        </div>
        <div class="flex gap-2">
          <div v-if="form.imageUrl" class="h-20 w-20 rounded-lg bg-gray-50 border border-gray-25 overflow-hidden group relative shrink-0">
            <img :src="form.imageUrl" class="w-full h-full object-cover" />
            <button @click.stop="form.imageUrl = ''" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 class="w-4 h-4 text-white" />
            </button>
          </div>
          <button v-if="!form.imageUrl" type="button" @click="triggerImageUpload" class="h-20 w-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0">
            <template v-if="uploadingImage">
              <div class="w-5 h-5 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </template>
            <template v-else>
              <ImageIcon class="w-5 h-5 text-gray-400 mb-1" />
              <span class="text-[9px] font-medium text-gray-400">Photo</span>
            </template>
            <input type="file" ref="imageRef" class="hidden" @change="handleImageUpload" accept="image/*" />
          </button>
        </div>
      </section>

      <!-- 3. BUNDLE PRICE -->
      <section class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Bundle Pricing</h3>
        <div>
          <label class="text-sm font-semibold text-gray-800 block mb-1.5">Fixed Bundle Price (₦)</label>
          <p class="text-sm text-gray-500 mb-2">This is the total price customers pay — NOT the sum of individual items.</p>
          <input type="number" v-model.number="form.bundlePrice" placeholder="e.g. 5200" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all" />
        </div>
        
        <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-50">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-700">Available for order</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.isAvailable" class="sr-only peer" />
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>

        <div class="flex items-start gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-50 mt-3">
          <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input type="checkbox" v-model="form.isPackagingFeeIncluded" class="sr-only peer" />
            <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <div>
            <span class="text-sm font-semibold text-gray-700 block">Packaging Fee Included in Price</span>
            <span class="text-[11px] text-gray-500 block">If toggled, users will not pay an extra pack fee for this combo pack</span>
          </div>
        </div>
      </section>

      <!-- 4. COMPONENTS (Items + Portions) -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Included Items</h3>
            <p class="text-sm text-gray-500">Select menu items and how many portions of each are in the pack.</p>
          </div>
          <button type="button" @click="addComponent" class="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">
            + Add Item
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="(comp, idx) in form.components" :key="idx" class="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
            <select v-model="comp.itemId" class="flex-1 px-3 py-2 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900">
              <option disabled value="">Select an Item</option>
              <option v-for="prod in products" :key="prod._id" :value="prod._id">{{ prod.name }} (₦{{ prod.pricePerPortion || prod.price }})</option>
            </select>
            <div class="flex items-center gap-1 bg-white border border-gray-25 rounded-lg px-2">
              <span class="text-gray-500 text-sm">Portions</span>
              <input type="number" v-model.number="comp.portions" min="1" placeholder="1" class="w-14 px-1 py-2 text-base focus:outline-none" />
            </div>
            <button type="button" @click="removeComponent(idx)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>
          <p v-if="form.components.length === 0" class="text-sm text-gray-400 text-center py-4">No items added yet. Click "+ Add Item" above.</p>
        </div>

        <!-- Calculated à la carte comparison -->
        <div v-if="alaCarteTotal > 0" class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p class="text-sm text-blue-700">
            <span class="font-bold">À la carte total:</span> ₦{{ alaCarteTotal.toLocaleString() }}
            <span v-if="form.bundlePrice > 0 && form.bundlePrice < alaCarteTotal" class="ml-2 text-green-700 font-bold">
              (Saving ₦{{ (alaCarteTotal - form.bundlePrice).toLocaleString() }})
            </span>
          </p>
        </div>
      </section>

      <!-- 5. ADD-ON GROUPS -->
      <section class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Add-on Groups</h3>
          <p class="text-sm text-gray-500 mt-1">Select reusable add-on groups applicable to this pack.</p>
        </div>
        <div v-if="addOnGroups && addOnGroups.length > 0" class="grid grid-cols-2 gap-3">
          <label v-for="group in addOnGroups" :key="group._id" class="flex items-center gap-2 p-3 bg-white border border-gray-25 rounded-xl cursor-pointer hover:border-gray-300">
            <input type="checkbox" :value="group._id" v-model="form.addOnGroupIds" class="rounded text-gray-900 focus:ring-gray-900" />
            <span class="text-sm font-semibold text-gray-700">{{ group.name }}</span>
          </label>
        </div>
        <p v-else class="text-sm text-gray-400">No add-on groups available.</p>
      </section>
    </div>

    <template #footer>
      <div class="flex items-center gap-4 w-full">
        <button @click="$emit('close')" type="button" class="flex-1 py-3 bg-white border border-gray-25 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
        <button @click="handleSubmit" type="button" class="flex-[2] py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
          {{ pack ? 'Update Pack' : 'Create Pack' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { Plus, Trash2, X, ImageIcon } from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';
import { useVendorPacks } from '@/composables/modules/products';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  isOpen: boolean;
  pack?: any;
  categories?: any[];
  products: any[];
  addOnGroups: any[];
}>();

const emit = defineEmits(['close', 'save', 'createCategory']);
const { createPack, updatePack } = useVendorPacks();
const { showToast } = useCustomToast();

const uploadingImage = ref(false);
const imageRef = ref<HTMLInputElement | null>(null);

const form = reactive({
  name: '',
  description: '',
  categoryId: '',
  bundlePrice: 0,
  components: [] as { itemId: string; portions: number }[],
  addOnGroupIds: [] as string[],
  imageUrl: '',
  isAvailable: true,
  isPackagingFeeIncluded: false,
});

// Calculate à la carte total for comparison
const alaCarteTotal = computed(() => {
  let total = 0;
  for (const comp of form.components) {
    const product = props.products?.find((p: any) => p._id === comp.itemId);
    if (product) {
      total += (product.pricePerPortion || product.price || 0) * (comp.portions || 1);
    }
  }
  return total;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.pack) {
      const p = JSON.parse(JSON.stringify(props.pack));
      form.name = p.name || '';
      form.description = p.description || '';
      form.categoryId = p.categoryId?._id || p.categoryId || '';
      form.bundlePrice = p.bundlePrice || 0;
      form.imageUrl = p.imageUrl || '';
      form.isAvailable = p.isAvailable !== false;
      form.isPackagingFeeIncluded = !!p.isPackagingFeeIncluded;
      // Map components safely
      form.components = (p.components || []).map((c: any) => ({
        itemId: c.itemId?._id || c.itemId || '',
        portions: c.portions || 1,
      }));
      // Map addOnGroupIds safely
      form.addOnGroupIds = (p.addOnGroupIds || []).map((g: any) =>
        typeof g === 'object' ? g._id : g
      );
    } else {
      form.name = '';
      form.description = '';
      form.categoryId = '';
      form.bundlePrice = 0;
      form.components = [];
      form.addOnGroupIds = [];
      form.imageUrl = '';
      form.isAvailable = true;
      form.isPackagingFeeIncluded = false;
    }
  }
});

const addComponent = () => {
  form.components.push({ itemId: '', portions: 1 });
};

const removeComponent = (idx: number) => {
  form.components.splice(idx, 1);
};

const triggerImageUpload = () => imageRef.value?.click();
const handleImageUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  uploadingImage.value = true;
  try {
    const res = await vendors_api.uploadImage(files[0]);
    const url = res.data.url || res.data.secure_url;
    if (url) form.imageUrl = url;
  } finally {
    uploadingImage.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.name) {
    showToast({ title: 'Error', message: 'Please provide a pack name.', toastType: 'error' });
    return;
  }
  
  const payload = {
    name: form.name,
    description: form.description,
    categoryId: form.categoryId || undefined,
    bundlePrice: form.bundlePrice,
    components: form.components.map(c => ({
      itemId: typeof c.itemId === 'object' ? (c.itemId as any)._id : c.itemId,
      portions: c.portions,
    })),
    addOnGroupIds: form.addOnGroupIds.map((g: any) => typeof g === 'object' ? g._id : g),
    imageUrl: form.imageUrl || undefined,
    isAvailable: form.isAvailable,
    isPackagingFeeIncluded: form.isPackagingFeeIncluded,
  };

  if (props.pack) {
    await updatePack(props.pack._id, payload);
  } else {
    await createPack(payload);
  }
  emit('close');
};
</script>
