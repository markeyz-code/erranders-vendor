<template>
 <div class="space-y-4 animate-fade-in w-full pb-10 px-4 sm:px-8 pt-6">
 <!-- Header with Search Bar -->
 <div class="flex items-center justify-between gap-4 mb-4 mt-2">
 <div class="flex-1 relative max-w-2xl">
 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search items by name, category, or description" 
 class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-md text-base font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
 />
 <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
 <kbd class="px-1.5 py-0.5 text-sm font-bold bg-white text-gray-400 rounded-md border border-gray-25">⌘</kbd>
 <kbd class="px-1.5 py-0.5 text-sm font-bold bg-white text-gray-400 rounded-md border border-gray-25">K</kbd>
 </div>
 </div>
 <div class="flex items-center gap-4">
 <span class="text-sm font-medium text-gray-500 hidden md:block">Total Products: <strong class="text-gray-900">{{ products.length }}</strong></span>
 </div>
 </div>

 <div class="mb-6">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
  <div>
  <h1 class="text-xl font-bold text-gray-900 tracking-tight font-display mb-1">Product Catalog</h1>
  <p class="text-gray-500 text-sm font-medium">Manage your store's menu, inventory availability, and pricing.</p>
  </div>
  <div class="flex items-center gap-2">
    <NuxtLink to="/products/bulk-add" class="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-25 rounded-md font-bold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center gap-2">
      <Search class="w-4 h-4" /> Add from Catalog
    </NuxtLink>
    <button @click="openAddDrawer" class="px-6 py-2.5 bg-parentPrimary text-white rounded-md font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2">
    <span class="text-lg leading-none">+</span> New Product
    </button>
  </div>
  </div>

 <div class="flex items-center gap-4">
 <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700 transition-colors border border-gray-25">
 <ListFilter class="w-4 h-4" />
 Filters
 </button>
 <span class="text-sm font-medium text-gray-400">Category filter applied</span>
 
 <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
 <button
 v-for="cat in categories"
 :key="cat"
 @click="activeCategory = cat"
 class="px-4 py-1.5 rounded-md text-sm font-bold transition-all r whitespace-nowrap"
 :class="activeCategory === cat ? 'bg-parentPrimary text-white ' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
 >
 {{ cat }}
 </button>
 </div>
 </div>
 </div>


 <!-- Product List -->
 <div v-if="loading" class="p-10 text-center">
 <div class="space-y-4">
 <div v-for="i in 8" :key="i" class="h-12 bg-gray-100 rounded-md animate-pulse"></div>
 </div>
 </div>

 <div v-else-if="filteredProducts.length === 0">
 <EmptyState 
 :title="products.length === 0 ? 'Your store is empty' : 'No match found'" 
 description="Add your first campus favorite to start receiving orders!"
 actionLabel="Create First Product"
 @action="openAddDrawer"
 >
 <template #icon>
 🍔
 </template>
 </EmptyState>
 </div>

 <div v-else class="bg-white rounded-xl border border-gray-50 shadow-sm overflow-hidden w-full min-w-0">
 <div class="overflow-x-auto w-full hide-scrollbar">
 <table class="w-full text-left border-collapse">
 <thead class="bg-gray-50/50">
 <tr class="border-b border-gray-100">
 <th class="py-4 px-4 font-bold text-gray-400 text-[11px] uppercase tracking-wider whitespace-nowrap">Product</th>
 <th class="py-4 px-4 font-bold text-gray-400 text-[11px] uppercase tracking-wider whitespace-nowrap">Category</th>
 <th class="py-4 px-4 font-bold text-gray-400 text-[11px] uppercase tracking-wider whitespace-nowrap text-right">Price</th>
 <th class="py-4 px-4 font-bold text-gray-400 text-[11px] uppercase tracking-wider whitespace-nowrap text-right">Status</th>
 <th class="py-4 px-4 font-bold text-gray-400 text-[11px] uppercase tracking-wider whitespace-nowrap"></th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="product in filteredProducts" :key="product._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedProduct = product">
 <td class="py-4 px-2 min-w-[250px]">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-25">
 <img :src="product.image || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
 </div>
 <div class="min-w-0">
 <h3 class="font-bold text-gray-900 text-[13px] tracking-tight truncate">{{ product.name }}</h3>
 <p class="text-[11px] text-gray-500 font-medium truncate max-w-[200px]">{{ product.description }}</p>
 </div>
 </div>
 </td>
 <td class="py-4 px-2">
 <span class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-bold border border-gray-25/50">{{ product.category }}</span>
 </td>
 <td class="py-4 px-2 text-right">
 <p class="text-[13px] font-bold text-gray-900 tracking-tighter">₦{{ product.price?.toLocaleString() }}</p>
 </td>
 <td class="py-4 px-2 text-right">
 <span :class="product.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'" class="text-sm font-bold px-2.5 py-1 rounded-md border inline-block">
 {{ product.isAvailable ? 'Live & Active' : 'Offline' }}
 </span>
 </td>
 <td class="py-4 px-2 text-right w-10">
 <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

  <!-- SideDrawer for Product Details & Editing -->
  <ProductDrawer
    :isOpen="showAddDrawer || !!selectedProduct"
    :product="selectedProduct"
    :categories="availableCategories"
    :usesMenuApi="isFoodVendor"
    :requiresPrepTime="isRestaurant"
    :requiresTakeawayPack="isRestaurant"
    :isSaving="isSaving"
    @close="closeProductDrawer"
    @save="handleSaveProduct"
    @delete="handleDelete"
  />
 </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useVendorProducts } from '@/composables/modules/products';
import { useVendorProfile } from '@/composables/modules/vendors';
import { Search, ListFilter, ChevronRight, Trash2 } from 'lucide-vue-next';
import ProductDrawer from '@/components/dashboard/ProductDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import { useConfirmModal } from '@/composables/core/useConfirmModal';


definePageMeta({
 layout: 'vendor'
})

const route = useRoute();
const { products, loading, isFoodVendor, fetchProducts, createProduct, updateProduct, deleteProduct } = useVendorProducts();
const { confirm } = useConfirmModal();

// Only restaurants need prep time & takeaway pack UI sections
// Mini-marts use the menu API but don't need those UI features
const { profile } = useVendorProfile();
const isRestaurant = computed(() => {
  const vt = (profile.value?.vendorType || '').toLowerCase();
  return vt === 'restaurant' || (!vt && isFoodVendor.value);
});
const showAddDrawer = ref(false);
const selectedProduct = ref<any>(null);
const searchQuery = ref('');
const activeCategory = ref('all');
const isSaving = ref(false);

const categories = computed(() => {
 const cats = new Set(products.value.map(p => p.category));
 return ['all', ...Array.from(cats)].filter(c => c);
});

const filteredProducts = computed(() => {
 let list = products.value;
 if (activeCategory.value !== 'all') {
 list = list.filter(p => p.category === activeCategory.value);
 }
 if (searchQuery.value) {
 const q = searchQuery.value.toLowerCase();
 list = list.filter(p => 
 p.name?.toLowerCase().includes(q) ||
 p.description?.toLowerCase().includes(q) ||
 p.category?.toLowerCase().includes(q)
 );
 }
 return list;
});

const availableCategories = computed(() => categories.value.filter(c => c !== 'all'));

const openAddDrawer = () => {
 showAddDrawer.value = true;
};

const closeProductDrawer = () => {
 showAddDrawer.value = false;
 selectedProduct.value = null;
};

const handleSaveProduct = async (formData: any) => {
 isSaving.value = true;
 try {
   if (selectedProduct.value) {
   await updateProduct(selectedProduct.value._id, formData);
   } else {
   await createProduct(formData);
   }
   closeProductDrawer();
 } finally {
   isSaving.value = false;
 }
};

const handleDelete = async (product: any) => {
 const id = typeof product === 'string' ? product : product._id;
 const isConfirmed = await confirm({ title: 'Delete Product', message: 'Permanently remove this item from your public catalog?', variant: 'danger', confirmText: 'Remove' });
 if (isConfirmed) {
 await deleteProduct(id);
 closeProductDrawer();
 }
};

onMounted(() => {
  fetchProducts();
  if (route.query.action === 'add') {
    showAddDrawer.value = true;
  }
});
useHead({ title: 'Menu Management - Errander Vendor' });
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-scale-in {
 animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(30px); }
 to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.9) translateY(10px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
