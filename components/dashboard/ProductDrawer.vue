<template>
  <div>
 <Modal 
 :isOpen="isOpen" 
 :title="product ? 'Edit Item' : 'Create Item'" 
 :description="product ? 'Update item details' : ''"
 size="lg"
 @close="$emit('close')"
 >
 <div class="space-y-4 py-2">

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 1. BASIC INFO -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-3">
   <!-- <AnimatedInput 
    v-model="form.name" 
    label="Item name" 
    description=""
    :placeholder="(requiresPrepTime || usesMenuApi) ? 'Food type name like:Beans' : 'e.g., Ergonomic Wireless Mouse'"
    required 
   /> -->
      <AnimatedInput 
    v-model="form.name" 
    label="Item name" 
    description=""
    required 
   />

   <!-- <AnimatedInput 
    v-model="form.description" 
    type="textarea" 
    label="Description" 
    description=""
    :placeholder="(requiresPrepTime || usesMenuApi) ? 'Ewa agonyi, sells from 200 per portion' : 'e.g., Premium ergonomic mouse with silent clicks'"
   /> -->

      <AnimatedInput 
    v-model="form.description" 
    type="textarea" 
    label="Description" 
    description=""
   />


   <div class="space-y-2">
    <div class="flex items-start justify-between gap-4">
     <div>
      <label class="text-sm font-semibold text-gray-800 block">Category</label>
      <p class="text-[13px] text-gray-500 mt-0.5">{{ (requiresPrepTime || usesMenuApi) ? 'e.g. Main Dishes, Soups, Drinks, Extras' : 'e.g. Electronics, Groceries, Accessories' }}</p>
     </div>
     <button type="button" @click="$emit('createCategory')" class="shrink-0 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5">
       <Plus class="w-4 h-4" /> Create category
     </button>
    </div>
    <SelectInput 
     v-model="form.category" 
     :options="categories" 
     required 
    />
   </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 2. PHOTOS & VIDEOS (Compact Horizontal) -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-3">
   <div>
    <h3 class="text-sm font-semibold text-gray-800">Photos & Videos</h3>
    <p class="text-[13px] text-gray-500 mt-0.5">Upload the picture of the item</p>
   </div>
   <div class="flex flex-wrap gap-2">
    <div 
     v-for="(img, idx) in allImages" :key="idx"
     class="h-20 w-20 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden group relative shrink-0"
    >
     <img :src="img" class="w-full h-full object-cover" />
     <button @click.stop="removeImage(idx)" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
      <Trash2 class="w-4 h-4 text-white" />
     </button>
    </div>
    <div 
     v-for="(vid, idx) in allVideos" :key="`vid-${idx}`"
     class="h-20 w-20 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden group relative shrink-0"
    >
     <video :src="vid" class="w-full h-full object-cover" muted loop playsinline></video>
     <button @click.stop="removeVideo(idx)" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
      <Trash2 class="w-4 h-4 text-white" />
     </button>
    </div>
    <button type="button" @click="triggerImageUpload" class="h-20 w-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0">
     <template v-if="uploadingImage">
      <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
     </template>
     <template v-else>
      <ImageIcon class="w-5 h-5 text-gray-400 mb-1" />
      <span class="text-[9px] font-medium text-gray-400">Photo</span>
     </template>
     <input type="file" ref="imageRef" class="hidden" @change="handleFileUpload" accept="image/*" multiple />
    </button>
    <button v-if="allVideos.length < 3" type="button" @click="triggerVideoUpload" class="h-20 w-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center transition-all hover:bg-blue-50 hover:border-blue-300 shrink-0">
     <template v-if="uploadingVideo">
      <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
     </template>
     <template v-else>
      <VideoIcon class="w-5 h-5 text-gray-400 mb-1" />
      <span class="text-[9px] font-medium text-gray-400">Video</span>
     </template>
     <input type="file" ref="videoRef" class="hidden" @change="handleVideoUpload" accept="video/mp4,video/quicktime" multiple />
    </button>
   </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 3. TRACK STOCK -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-4">
   <div class="flex items-center justify-between">
    <h3 class="text-lg font-bold text-gray-900">Track stock</h3>
    <label class="relative inline-flex items-center cursor-pointer">
     <input type="checkbox" v-model="form.trackStock" class="sr-only peer" />
     <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
   </div>
    <Transition name="slide-fade">
     <div v-if="form.trackStock" class="space-y-4">
      <div>
       <label class="text-sm font-semibold text-gray-800 block mb-1.5">In stock ({{ requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Portions' : 'Units' }})</label>
       <input type="number" v-model.number="form.stockQuantity" placeholder="e.g. 50" class="w-full px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" />
      </div>
     </div>
    </Transition>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 4. PRICING -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-4">
   <h3 class="text-lg font-bold text-gray-900">Pricing</h3>
   <div class="grid grid-cols-2 gap-4">
    <div>
     <label class="text-sm font-semibold text-gray-800 block mb-1.5">{{ requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Price Per Portion (₦)' : 'Price (₦)' }}</label>
     <input type="number" v-model.number="form.pricePerPortion" placeholder="e.g. 2500" class="w-full px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" required />
    </div>
    <div>
     <label class="text-sm font-semibold text-gray-800 block mb-1.5">{{ requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Portion Unit' : 'Unit' }}</label>
     <select v-model="form.portionUnit" class="w-full px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all">
      <option value="plate" v-if="requiresTakeawayPack || requiresPrepTime || usesMenuApi">Plate</option>
      <option value="wrap" v-if="requiresTakeawayPack || requiresPrepTime || usesMenuApi">Wrap</option>
      <option value="piece">Piece</option>
       <option value="pack">Pack</option>
      <option value="bottle">Bottle</option>
      <option value="jar">Jar</option>
      <option value="pouch">Pouch</option>
      <option value="portion" v-if="requiresTakeawayPack || requiresPrepTime || usesMenuApi">Portion</option>
      <option value="item" v-if="!requiresTakeawayPack && !requiresPrepTime && !usesMenuApi">Item</option>
      <option value="pair" v-if="!requiresTakeawayPack && !requiresPrepTime && !usesMenuApi">Pair</option>
      <option value="kg" v-if="!requiresTakeawayPack && !requiresPrepTime && !usesMenuApi">Kg</option>
     </select>
    </div>
   </div>
   <div class="grid grid-cols-2 gap-4">
    <div>
     <label class="text-sm font-semibold text-gray-800 block mb-1.5">{{ requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Max Portions per Order' : 'Max Quantity per Order' }}</label>
     <input type="number" v-model.number="form.maxPortionsPerOrder" placeholder="0 for unlimited" class="w-full px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" />
    </div>
    <div v-if="requiresPrepTime || usesMenuApi">
     <label class="text-sm font-semibold text-gray-800 block mb-1.5">Prep Time (mins)</label>
     <input type="number" v-model.number="form.prepTimeMinutes" placeholder="e.g. 20" class="w-full px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" />
    </div>
   </div>
   <div class="pt-2">
    <div class="flex items-center gap-3">
     <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" v-model="form.isPackagingFeeIncluded" class="sr-only peer" />
      <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
     </label>
     <div>
       <span class="text-sm font-semibold text-gray-700 block">Packaging Fee Included in Price</span>
       <span class="text-[11px] text-gray-500 block">If toggled, users will not pay an extra pack fee for this item</span>
     </div>
    </div>
   </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 5. TAKEAWAY PACK SIZES (Auto-mapped to Modifiers) -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-4" v-if="requiresTakeawayPack">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-900">Takeaway Pack Sizes</h3>
        <p class="text-xs text-gray-500">Configure required takeaway container fees</p>
      </div>
    </div>
    
    <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
      <div class="flex items-center gap-3">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="form.hasPackFee" class="sr-only peer" />
          <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
        </label>
        <span class="text-sm font-semibold text-gray-700">Requires Takeaway Pack</span>
      </div>

      <div v-if="form.hasPackFee" class="pt-3 border-t border-gray-200 space-y-3">
        <div v-for="(opt, oIdx) in form.packOptions" :key="oIdx" class="flex items-center gap-2">
          <input type="text" v-model="opt.name" placeholder="Pack Name (e.g. Small Pack)" class="flex-1 px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:border-[#FF5C1A]" />
          <input type="number" v-model.number="opt.price" placeholder="Price (+₦)" class="w-24 px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:border-[#FF5C1A]" />
          <button type="button" @click="removePackOption(oIdx)" class="p-2 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 class="w-4 h-4" /></button>
        </div>
        <button type="button" @click="addPackOption" class="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <Plus class="w-4 h-4" /> Add Pack Size
        </button>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 5. MODIFIERS (Required Options like Pack Size) -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-900">Required Options (Modifiers)</h3>
        <p class="text-xs text-gray-500">{{ requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'e.g. Pack Size, Spice Level' : 'e.g. Size, Color, Storage Capacity' }}</p>
      </div>
      <button type="button" @click="addModifier" class="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1">
        <Plus class="w-3 h-3" /> Add Option
      </button>
    </div>
    
    <div v-for="(mod, mIdx) in form.modifiers" :key="mIdx" class="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
      <div class="flex items-center gap-2">
        <input type="text" v-model="mod.name" :placeholder="requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Option Name (e.g. Pack Size)' : 'Option Name (e.g. Storage Capacity)'" class="flex-1 px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-lg text-base focus:outline-none focus:border-[#FF5C1A]" />
        <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
          <input type="checkbox" v-model="mod.isRequired" class="rounded text-gray-900 focus:ring-gray-900" /> Required
        </label>
        <button type="button" @click="removeModifier(mIdx)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 class="w-4 h-4" /></button>
      </div>
      
      <div class="pl-4 border-l-2 border-gray-200 space-y-2">
        <div v-for="(opt, oIdx) in mod.options" :key="oIdx" class="flex items-center gap-2">
          <input type="text" v-model="opt.name" :placeholder="requiresPrepTime || requiresTakeawayPack || usesMenuApi ? 'Choice (e.g. Big Pack)' : 'Choice (e.g. 512GB)'" class="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#FF5C1A]" />
          <input type="number" v-model.number="opt.priceDelta" placeholder="Price (+₦)" class="w-24 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#FF5C1A]" />
          <button type="button" @click="removeModifierOption(mIdx, oIdx)" class="p-1.5 text-gray-400 hover:text-red-500"><X class="w-3 h-3" /></button>
        </div>
        <button type="button" @click="addModifierOption(mIdx)" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
          <Plus class="w-3 h-3" /> Add Choice
        </button>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 6. ADD-ONS (Optional Extras) -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-4" v-if="requiresPrepTime || requiresTakeawayPack || usesMenuApi">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-900">Optional Extras (Add-ons)</h3>
        <p class="text-xs text-gray-500">Link reusable add-on groups</p>
      </div>
      <button type="button" @click="$emit('createAddOnGroup')" class="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1">
        <Plus class="w-3 h-3" /> Create Group
      </button>
    </div>
    <div class="space-y-3">
      <label v-for="group in addOnGroups" :key="group._id" class="block p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div class="flex items-center gap-3">
            <input type="checkbox" :value="group._id" v-model="form.addOnGroupIds" class="rounded text-gray-900 focus:ring-gray-900 w-4 h-4" />
            <span class="text-sm font-bold text-gray-900">{{ group.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wide mr-1">{{ group.selectionType === 'single' ? 'Select 1' : 'Multi Select' }}</span>
            <button type="button" @click.prevent.stop="$emit('editAddOnGroup', group)" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
              <Edit2 class="w-3.5 h-3.5" />
            </button>
            <button type="button" @click.prevent.stop="confirmDeleteAddOn(group)" class="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div v-if="group.options && group.options.length" class="space-y-2 pl-7">
          <div v-for="(opt, idx) in group.options" :key="idx" class="flex items-center justify-between text-xs">
            <span class="font-medium text-gray-700">{{ opt.name }}</span>
            <span v-if="(opt.price || opt.priceDelta) > 0" class="text-gray-500 font-bold">+₦{{ (opt.price || opt.priceDelta).toLocaleString() }}</span>
            <span v-else class="text-gray-400 font-medium">Free</span>
          </div>
        </div>
      </label>
      <p v-if="!addOnGroups || addOnGroups.length === 0" class="text-xs text-gray-500">No add-on groups found. Create them in your inventory.</p>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- 8. TOGGLES -->
  <!-- ═══════════════════════════════════════════════ -->
  <section class="space-y-3">
   <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
    <div class="flex items-center gap-3">
     <Star class="w-4 h-4 text-amber-500" />
     <span class="text-sm font-semibold text-gray-700">Feature on menu</span>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
     <input type="checkbox" v-model="form.isFeatured" class="sr-only peer" />
     <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
    </label>
   </div>
   <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
    <div class="flex items-center gap-3">
     <CheckCircle class="w-4 h-4 text-emerald-500" />
     <span class="text-sm font-semibold text-gray-700">Available for order</span>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
     <input type="checkbox" v-model="form.isAvailable" class="sr-only peer" />
     <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
    </label>
   </div>
  </section>

 </div>

 <template #footer>
  <div class="flex items-center gap-4 w-full">
   <button v-if="product" @click="$emit('delete', product)" type="button" class="flex-none py-3 px-4 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all flex items-center justify-center" title="Delete Product">
    <Trash2 class="w-5 h-5" />
   </button>
   <button @click="$emit('close')" type="button" class="flex-1 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
   <button @click="handleSubmit" type="button" :disabled="uploadingImage || uploadingVideo || uploading || isSaving || localSaving" class="flex-[2] py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
    <Loader2 v-if="uploadingImage || uploadingVideo || uploading || isSaving || localSaving" class="w-5 h-5 animate-spin" />
    <span v-else>{{ product ? 'Update Product' : 'Save Product' }}</span>
   </button>
  </div>
 </template>
 </Modal>

  <CreatePackModal
    :isOpen="isCreatePackOpen"
    @close="isCreatePackOpen = false"
    @save="handleCreatePack"
  />

  </div>
 </template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { Plus, X, UploadCloud, Info, Trash2, Settings2, Edit2, Star, ImageIcon, Video as VideoIcon, CheckCircle, Loader2 } from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useConfirmModal } from '@/composables/core/useConfirmModal';

const props = defineProps<{
 isOpen: boolean;
 product?: any;
 categories: any[];
 addOnGroups?: any[];
 requiresPrepTime?: boolean;
 requiresTakeawayPack?: boolean;
 isSaving?: boolean;
 usesMenuApi?: boolean;
}>();

const emit = defineEmits(['close', 'save', 'delete', 'createCategory', 'createAddOnGroup', 'editAddOnGroup', 'deleteAddOnGroup']);
const { showToast } = useCustomToast();
const { confirm } = useConfirmModal();

const isCreatePackOpen = ref(false);
const handleCreatePack = (pack: any) => {
  if (!form.packOptions) {
    form.packOptions = [];
  }
  form.packOptions.push(pack);
  isCreatePackOpen.value = false;
};
const uploading = ref(false);
const uploadingImage = ref(false);
const uploadingVideo = ref(false);
const tagsOpen = ref(false);
const imageRef = ref<HTMLInputElement | null>(null);
const videoRef = ref<HTMLInputElement | null>(null);

// Tags dropdowns
const tagsDropdownRef = ref<HTMLElement | null>(null);

const availableTags = ['African', 'Breakfast', 'Snacks', 'Meat', 'Lunch', 'Fries', 'Vegetables', 'Rice', 'Soup', 'Pasta', 'Drinks', 'Desserts', 'Grills', 'Seafood', 'Vegan', 'Spicy'];

const form = reactive({
 name: '',
 description: '',
 pricePerPortion: 0,
 portionUnit: 'plate',
 category: '',
 prepTimeMinutes: 15,
 trackStock: false,
 stockQuantity: null as number | null,
 maxPortionsPerOrder: 0,
 hasPackFee: false,
 packOptions: [{ name: 'Standard Pack', price: 150 }],
 variations: [] as any[],
 modifiers: [] as any[],
 addOnGroupIds: [] as string[],
 tags: [] as string[],
 isAvailable: true,
 isFeatured: false,
 image: '',
 images: [] as string[],
 videos: [] as string[],
 isPackagingFeeIncluded: false
});

const addPackOption = () => form.packOptions.push({ name: '', price: 0 });
const removePackOption = (idx: number) => form.packOptions.splice(idx, 1);

const addModifier = () => {
 form.modifiers.push({ name: '', isRequired: true, options: [{ name: '', priceDelta: 0 }] });
};
const removeModifier = (idx: number) => {
 form.modifiers.splice(idx, 1);
};
const addModifierOption = (mIdx: number) => {
 form.modifiers[mIdx].options.push({ name: '', priceDelta: 0 });
};
const removeModifierOption = (mIdx: number, oIdx: number) => {
 form.modifiers[mIdx].options.splice(oIdx, 1);
};

const allImages = ref<string[]>([]);
const allVideos = ref<string[]>([]);

const defaultForm = () => ({
  name: '', description: '', pricePerPortion: 0, 
  portionUnit: (!props.requiresPrepTime && !props.requiresTakeawayPack && !props.usesMenuApi) ? 'item' : 'plate', 
  category: '',
  prepTimeMinutes: 15, trackStock: false, stockQuantity: null, maxPortionsPerOrder: 0,
  hasPackFee: false, packOptions: [{ name: 'Standard Pack', price: 150 }],
  isAvailable: true, isFeatured: false,
  image: '', images: [], videos: [], modifiers: [], addOnGroupIds: [],
  tags: [], isPackagingFeeIncluded: false,
 });

watch(() => props.isOpen, (isOpen) => {
 if (isOpen) {
   if (props.product) {
    const p = JSON.parse(JSON.stringify(props.product));
    
    // Extract pack configuration from modifiers
    let hasPackFee = false;
    let packOptions = [{ name: 'Standard Pack', price: 150 }];
    const packModIdx = p.modifiers?.findIndex((m: any) => m.name.toLowerCase().includes('pack'));
    
    if (packModIdx !== -1 && packModIdx !== undefined) {
      hasPackFee = true;
      packOptions = p.modifiers[packModIdx].options.map((o: any) => ({ name: o.name, price: o.priceDelta || 0 }));
      // Remove pack from regular modifiers to avoid duplicate UI
      p.modifiers.splice(packModIdx, 1);
    }
    
    // Normalize category mapping for editing
    if (p.categoryId && typeof p.categoryId === 'object') {
      p.category = p.categoryId.name;
    } else if (p.category && typeof p.category === 'object') {
      p.category = p.category.name;
    }
    
    Object.assign(form, { ...defaultForm(), ...p, hasPackFee, packOptions });
    allImages.value = p.images?.length ? [...p.images] : (p.image ? [p.image] : []);
    allVideos.value = p.videos?.length ? [...p.videos] : [];
   } else {
    Object.assign(form, defaultForm());
    allImages.value = [];
    allVideos.value = [];
   }
 }
});



// ── Tags ──
const toggleTag = (tag: string) => {
 const idx = form.tags.indexOf(tag);
 if (idx >= 0) form.tags.splice(idx, 1);
 else form.tags.push(tag);
};

// ── Click outside to close dropdowns ──
const handleClickOutside = (e: MouseEvent) => {
 if (tagsDropdownRef.value && !tagsDropdownRef.value.contains(e.target as Node)) tagsOpen.value = false;
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

// ── Image upload ──
const triggerImageUpload = () => imageRef.value?.click();
const handleFileUpload = async (e: Event) => {
 const files = (e.target as HTMLInputElement).files;
 if (!files) return;
 for (const file of Array.from(files)) {
  uploadingImage.value = true;
  try {
   const res = await vendors_api.uploadImage(file);
   const url = res.data.url || res.data.secure_url;
   if (url) allImages.value.push(url);
  } finally {
   uploadingImage.value = false;
  }
 }
};
const removeImage = (idx: number) => allImages.value.splice(idx, 1);

// ── Video upload ──
const triggerVideoUpload = () => videoRef.value?.click();
const handleVideoUpload = async (e: Event) => {
 const files = (e.target as HTMLInputElement).files;
 if (!files) return;
 for (const file of Array.from(files)) {
  if (allVideos.value.length >= 3) {
   showToast({ title: 'Limit Reached', message: 'You can only upload up to 3 videos per product.', toastType: 'error' });
   break;
  }
  if (file.size > 10 * 1024 * 1024) {
   showToast({ title: 'File Too Large', message: 'Each video must be 10MB or smaller.', toastType: 'error' });
   continue;
  }
  uploadingVideo.value = true;
  try {
   const res = await vendors_api.uploadVideo(file);
   const url = res.data.url || res.data.secure_url;
   if (url) allVideos.value.push(url);
  } catch (e: any) {
   showToast({ title: 'Upload Failed', message: e?.response?.data?.message || 'Could not upload video.', toastType: 'error' });
  } finally {
   uploadingVideo.value = false;
  }
 }
};
const removeVideo = (idx: number) => allVideos.value.splice(idx, 1);

const confirmDeleteAddOn = async (group: any) => {
  const isConfirmed = await confirm({ title: 'Delete Add-on Group', message: `Are you sure you want to delete the add-on group "${group.name}"? This will remove it from all items.`, variant: 'danger', confirmText: 'Delete' });
  if (isConfirmed) {
    emit('deleteAddOnGroup', group._id);
  }
};

// ── Submit ──
 const localSaving = ref(false);
 const handleSubmit = async () => {
  if (localSaving.value || props.isSaving) return;
  localSaving.value = true;
  setTimeout(() => { localSaving.value = false; }, 2000);
  form.image = allImages.value[0] || '';
  form.images = [...allImages.value];
  form.videos = [...allVideos.value];
  
  const payload = JSON.parse(JSON.stringify(form));
  
  // Re-inject Pack Config into modifiers
  if (payload.hasPackFee && payload.packOptions?.length > 0) {
    payload.modifiers.unshift({
      name: 'Pack Size',
      isRequired: true,
      options: payload.packOptions.map((p: any) => ({ name: p.name, priceDelta: p.price }))
    });
  }
  
  delete payload.hasPackFee;
  delete payload.packOptions;
  
  if (!props.usesMenuApi) {
    // For non-food vendors (products API)
    if (payload.pricePerPortion !== undefined) {
      payload.price = payload.pricePerPortion;
    }
    if (payload.portionUnit !== undefined) {
      payload.unit = payload.portionUnit;
    }
    if (payload.maxPortionsPerOrder) {
      payload.maxOrderQty = payload.maxPortionsPerOrder;
    }
    // Clean up menu-item specific fields
    delete payload.pricePerPortion;
    delete payload.portionUnit;
    delete payload.maxPortionsPerOrder;
    delete payload.prepTimeMinutes;
    delete payload.modifiers;
    delete payload.addOnGroupIds;
  } else {
    // For food vendors (menu-items API)
    // Strip product-specific fields to avoid 400 Bad Request from strict DTO validation
    delete payload.variations;
    delete payload.isFeatured;
    delete payload.price;
    delete payload.unit;
    delete payload.maxOrderQty;
  }
  
  // Extract raw IDs from populated objects
  if (payload.categoryId && typeof payload.categoryId === 'object') {
    payload.categoryId = payload.categoryId._id;
  }
  
  // For Menu API, map category string back to categoryId ObjectId
  if (props.usesMenuApi && payload.category) {
    const selectedCat = props.categories.find(c => c.name === payload.category);
    if (selectedCat) {
      payload.categoryId = selectedCat._id;
    }
  }

  if (payload.addOnGroupIds) {
    payload.addOnGroupIds = payload.addOnGroupIds.map((g: any) => typeof g === 'object' ? g._id : g);
  }
  // Strip read-only fields
  delete payload._id;
  delete payload.__v;
  delete payload.vendorId;
  delete payload.createdAt;
  delete payload.updatedAt;
  
  emit('save', payload);
 };
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
 transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
 opacity: 0;
 transform: translateY(-4px);
}
</style>
