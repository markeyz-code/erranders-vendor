<template>
 <div class="py-5 pb-10 containter mx-auto animate-fade-in space-y-6 w-full">
  <!-- ─── Header ─── -->
  <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
   <div>
    <h1 class="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">{{ isFoodVendor ? 'Menu & Inventory' : 'Products' }}</h1>
    <p class="text-sm text-gray-400 font-medium mt-1">Manage your catalog, categories &amp; stock in one place.</p>
   </div>
   <div class="flex flex-wrap items-center gap-3">
    <button v-if="activeTab === 'items'" @click="isCategoryDrawerOpen = true" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-white text-gray-600 border border-gray-25 hover:border-gray-200 hover:bg-gray-50">
     <FolderPlus class="w-4 h-4" /> Categories
    </button>
    <button v-if="activeTab === 'items'" @click="openAddProduct" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md">
     <Plus class="w-4 h-4" /> Add Product
    </button>
    <button v-if="activeTab === 'packs'" @click="openAddPack" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md">
     <Plus class="w-4 h-4" /> Add Combo Pack
    </button>
    <button v-if="activeTab === 'addons'" @click="openAddAddOn" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md">
     <Plus class="w-4 h-4" /> Add Add-on Group
    </button>
   </div>
  </header>

  <!-- ─── Stats Row ─── -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
   <div class="bg-white border border-gray-25 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-gray-200">
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
     <Package class="w-5 h-5" />
    </div>
    <div>
     <p class="text-2xl font-bold text-gray-900 leading-none tracking-tight mb-1">{{ products.length }}</p>
     <p class="text-xs text-gray-500 font-medium">Total Products</p>
    </div>
   </div>
   <div class="bg-white border border-gray-25 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-gray-200">
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-500">
     <CheckCircle class="w-5 h-5" />
    </div>
    <div>
     <p class="text-2xl font-bold text-gray-900 leading-none tracking-tight mb-1">{{ availableCount }}</p>
     <p class="text-xs text-gray-500 font-medium">Available</p>
    </div>
   </div>
   <div class="bg-white border border-gray-25 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-gray-200">
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
     <AlertTriangle class="w-5 h-5" />
    </div>
    <div>
     <p class="text-2xl font-bold text-gray-900 leading-none tracking-tight mb-1">{{ lowStockCount }}</p>
     <p class="text-xs text-gray-500 font-medium">Low Stock</p>
    </div>
   </div>
   <div class="bg-white border border-gray-25 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-gray-200">
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-500">
     <Layers class="w-5 h-5" />
    </div>
    <div>
     <p class="text-2xl font-bold text-gray-900 leading-none tracking-tight mb-1">{{ categories.length }}</p>
     <p class="text-xs text-gray-500 font-medium">Categories</p>
    </div>
   </div>
  </div>

  <!-- ─── Master Tabs (food vendors only) ─── -->
  <div v-if="isFoodVendor" class="flex gap-1.5 bg-gray-50 rounded-xl p-1 mb-5 w-fit">
   <button
    v-for="tab in masterTabs"
    :key="tab.key"
    @click="activeTab = tab.key"
    class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold border-none transition-all whitespace-nowrap"
    :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'"
   >
    <component :is="tab.icon" class="w-4 h-4" />
    {{ tab.label }}
   </button>
  </div>

  <!-- ─── Toolbar: Search + Category Filter ─── -->
  <div v-if="activeTab === 'items'" class="flex flex-col sm:flex-row items-center gap-4 mb-5">
   <div class="relative w-full sm:w-auto sm:flex-1 sm:min-w-[220px] sm:max-w-sm">
    <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
    <input
     v-model="searchQuery"
     type="text"
     placeholder="Search products..."
     class="w-full py-2.5 pl-10 pr-10 border border-gray-25 rounded-xl text-[13px] font-medium text-gray-900 bg-white outline-none transition-all focus:border-gray-25focus:ring-1 focus:ring-gray-900"
    />
    <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
     <X class="w-3.5 h-3.5" />
    </button>
   </div>

   <div class="flex gap-1.5 overflow-x-auto w-full sm:flex-1 no-scrollbar pb-2 sm:pb-0">
    <button
     @click="activeCategory = 'all'"
     class="shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all"
     :class="activeCategory === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700'"
    >
     All
    </button>
    <button
     v-for="cat in categories"
     :key="cat._id"
     @click="activeCategory = cat.name"
     class="shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all"
     :class="activeCategory === cat.name ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700'"
    >
     {{ cat.name }}
    </button>
   </div>
  </div>

  <!-- ═══════════════════════════════════════════ -->
  <!-- PRODUCTS TABLE (Items Tab)                 -->
  <!-- ═══════════════════════════════════════════ -->
  <div v-if="activeTab === 'items'" class="bg-white rounded-2xl border border-gray-25 shadow-sm overflow-hidden mt-4">
   <UiTable
    :columns="productColumns"
    :items="filteredProducts"
    :loading="loadingProds"
    empty-title="No products yet"
    empty-subtitle="Add your first product to start selling."
    :has-actions="true">
    <template #name="{ item }">
     <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-lg overflow-hidden bg-gray-50 shrink-0">
       <img :src="(item as any).image || (item as any).images?.[0] || '/placeholder-food.jpg'" :alt="(item as any).name" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col">
       <p class="text-sm font-bold text-gray-900 mb-0.5">{{ (item as any).name }}</p>
       <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{{ (item as any).category?.name || (item as any).categoryId?.name || (item as any).category || 'Uncategorized' }}</p>
      </div>
     </div>
    </template>

    <template #price="{ item }">
     <span class="text-sm font-bold text-gray-900">₦{{ ((item as any).pricePerPortion || (item as any).price || 0).toLocaleString() }}</span>
    </template>

    <template #stock="{ item }">
     <div class="flex items-center gap-1.5 text-[13px] font-bold">
      <span class="w-1.5 h-1.5 rounded-full" :class="stockDotClass(item as any)"></span>
      <span :class="stockTextClass(item as any)">{{ stockLabel(item as any) }}</span>
     </div>
    </template>

    <template #status="{ item }">
     <span
      class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider cursor-pointer"
      :class="(item as any).isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
      @click.stop="quickToggleAvailability(item as any)"
     >
      {{ (item as any).isAvailable ? 'Available' : 'Unavailable' }}
     </span>
    </template>

    <template #actions="{ item }">
     <div class="flex items-center gap-1.5">
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100" @click.stop="viewProductDetails(item as any)">
       <Eye class="w-3.5 h-3.5" /> View
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" @click.stop="editProduct(item as any)">
       <Edit2 class="w-3.5 h-3.5" /> Edit
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-red-50 text-red-600 border-red-100 hover:bg-red-100" @click.stop="confirmDelete(item as any)">
       <Trash2 class="w-3.5 h-3.5" /> Delete
      </button>
     </div>
    </template>
   </UiTable>
  </div>

  <!-- ═══════════════════════════════════════════ -->
  <!-- COMBO PACKS TAB                            -->
  <!-- ═══════════════════════════════════════════ -->
  <div v-if="activeTab === 'packs'" class="bg-white rounded-2xl border border-gray-25 shadow-sm overflow-hidden mt-4">
   <UiTable
    :columns="[{ key: 'name', label: 'Pack Details' }, { key: 'price', label: 'Bundle Price' }, { key: 'items', label: 'Items' }]"
    :items="packs"
    :loading="loadingPacks"
    empty-title="No combo packs found"
    empty-subtitle="Create combo packs to bundle products together."
    :has-actions="true">
    <template #name="{ item }">
     <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-lg overflow-hidden bg-gray-50 shrink-0">
       <img :src="(item as any).imageUrl || profile?.logo || profile?.bannerUrl || '/placeholder-food.jpg'" :alt="(item as any).name" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col">
       <p class="text-sm font-bold text-gray-900 mb-0.5">{{ (item as any).name }}</p>
       <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{{ (item as any).description || '—' }}</p>
      </div>
     </div>
    </template>
    <template #price="{ item }">
     <span class="text-sm font-bold text-gray-900">₦{{ ((item as any).bundlePrice || 0).toLocaleString() }}</span>
    </template>
    <template #items="{ item }">
     <span class="text-sm text-gray-500 font-semibold">{{ (item as any).items?.length || 0 }} items</span>
    </template>
    <template #actions="{ item }">
     <div class="flex items-center gap-1.5">
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100" @click.stop="editPack(item)">
       <Eye class="w-3.5 h-3.5" /> View
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" @click.stop="editPack(item)">
       <Edit2 class="w-3.5 h-3.5" /> Edit
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-red-50 text-red-600 border-red-100 hover:bg-red-100" @click.stop="deletePack(item._id)">
       <Trash2 class="w-3.5 h-3.5" /> Delete
      </button>
     </div>
    </template>
   </UiTable>
  </div>

  <!-- ═══════════════════════════════════════════ -->
  <!-- ADD-ON GROUPS TAB                          -->
  <!-- ═══════════════════════════════════════════ -->
  <div v-if="activeTab === 'addons'" class="bg-white rounded-2xl border border-gray-25 shadow-sm overflow-hidden mt-4">
   <UiTable
    :columns="[{ key: 'name', label: 'Group Name' }, { key: 'type', label: 'Selection Type' }, { key: 'options', label: 'Options' }]"
    :items="addOnGroups"
    :loading="loadingAddOns"
    empty-title="No add-on groups found"
    empty-subtitle="Create add-on groups to offer optional extras."
    :has-actions="true">
    <template #name="{ item }">
     <p class="text-sm font-bold text-gray-900 mb-0.5">{{ (item as any).name }}</p>
    </template>
    <template #type="{ item }">
     <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600">
      {{ (item as any).selectionType === 'single' ? 'Select One' : 'Multi Select' }}
     </span>
    </template>
    <template #options="{ item }">
     <span class="text-sm text-gray-500 font-semibold">{{ (item as any).options?.length || 0 }} options</span>
    </template>
    <template #actions="{ item }">
     <div class="flex items-center gap-1.5">
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100" @click.stop="editAddOn(item)">
       <Eye class="w-3.5 h-3.5" /> View
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" @click.stop="editAddOn(item)">
       <Edit2 class="w-3.5 h-3.5" /> Edit
      </button>
      <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all bg-red-50 text-red-600 border-red-100 hover:bg-red-100" @click.stop="deleteAddOnGroup(item._id)">
       <Trash2 class="w-3.5 h-3.5" /> Delete
      </button>
     </div>
    </template>
   </UiTable>
  </div>
 </div>

 <!-- ─── Drawers & Modals ─── -->
 <ProductDrawer
  :isOpen="isProductDrawerOpen"
  :isSaving="isSavingProduct"
  :usesMenuApi="isFoodVendor"
  :product="selectedProduct"
  :categories="categories"
  :addOnGroups="addOnGroups"
  :requiresPrepTime="profile?.requiresPrepTime"
  :requiresTakeawayPack="profile?.requiresTakeawayPack"
  @close="closeProductDrawer"
  @save="handleSaveProduct"
  @createCategory="isCategoryDrawerOpen = true"
  @createAddOnGroup="isAddOnDrawerOpen = true; selectedAddOn = null"
  @editAddOnGroup="editAddOn"
  @deleteAddOnGroup="deleteAddOnGroup"
 />

 <PackDrawer :isOpen="isPackDrawerOpen" :pack="selectedPack" :categories="categories" :addOnGroups="addOnGroups" :products="products" @close="isPackDrawerOpen = false; fetchPacks();" @createCategory="isCategoryDrawerOpen = true" />
 <AddOnGroupDrawer :isOpen="isAddOnDrawerOpen" :group="selectedAddOn" @close="isAddOnDrawerOpen = false; fetchAddOnGroups();" />

 <CategoryDrawer
  :isOpen="isCategoryDrawerOpen"
  :categories="categories"
  @close="isCategoryDrawerOpen = false"
  @save="handleSaveCategory"
 />

 <ConfirmModal
  :isOpen="isDeleteModalOpen"
  title="Delete Product?"
  :message="`Are you sure you want to remove '${(productToDelete as any)?.name}'? This action cannot be undone.`"
  variant="danger"
  confirm-text="Delete Product"
  @confirm="handleDeleteProduct"
  @cancel="isDeleteModalOpen = false"
 />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
 Plus, Search, FolderPlus, X,
 Edit2, Trash2, CheckCircle, AlertTriangle,
 Package, Layers, ShoppingBag, Gift, Puzzle, Eye
} from 'lucide-vue-next';
import { useVendorProducts, useVendorCategories, useVendorAddOnGroups, useVendorPacks } from '@/composables/modules/products';
import { useVendorProfile } from '@/composables/modules/vendors';
import ProductDrawer from '@/components/dashboard/ProductDrawer.vue';
import PackDrawer from '@/components/dashboard/PackDrawer.vue';
import AddOnGroupDrawer from '@/components/dashboard/AddOnGroupDrawer.vue';
import CategoryDrawer from '@/components/dashboard/CategoryDrawer.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import UiTable from '@/components/ui/UiTable.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Products - Errander Vendor' });

const { products, loading: loadingProds, fetchProducts, createProduct, updateProduct, deleteProduct, toggleAvailability, isFoodVendor } = useVendorProducts();
const { categories, fetchCategories, createCategory } = useVendorCategories();
const { addOnGroups, loading: loadingAddOns, fetchAddOnGroups, deleteAddOnGroup } = useVendorAddOnGroups();
const { packs, loading: loadingPacks, fetchPacks, deletePack } = useVendorPacks();
const { profile } = useVendorProfile();

const activeTab = ref<'items' | 'packs' | 'addons'>('items');
const masterTabs = [
 { key: 'items' as const, label: 'Products', icon: ShoppingBag },
 { key: 'packs' as const, label: 'Combo Packs', icon: Gift },
 { key: 'addons' as const, label: 'Add-on Groups', icon: Puzzle },
];

const isPackDrawerOpen = ref(false);
const isAddOnDrawerOpen = ref(false);
const selectedPack = ref(null);
const selectedAddOn = ref(null);
const isProductDrawerOpen = ref(false);
const isCategoryDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);
const searchQuery = ref('');
const activeCategory = ref('all');

// ─── Computed ───
const availableCount = computed(() => products.value.filter((p: any) => p.isAvailable).length);
const lowStockCount = computed(() => products.value.filter((p: any) => p.trackStock && p.stockQuantity !== undefined && p.stockQuantity >= 0 && p.stockQuantity < 5).length);

const filteredProducts = computed(() => {
 let list = products.value;
 if (activeCategory.value !== 'all') {
  list = list.filter((p: any) => {
   const catName = p.category?.name || p.categoryId?.name || p.category;
   return catName === activeCategory.value;
  });
 }
 if (searchQuery.value) {
  const q = searchQuery.value.toLowerCase();
  list = list.filter((p: any) => {
   const catName = p.category?.name || p.categoryId?.name || p.category;
   return (
    p.name?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    catName?.toLowerCase().includes(q)
   );
  });
 }
 return list;
});

// ─── Stock helpers ───
const stockLabel = (item: any) => {
 if (!item.trackStock) return 'Unlimited';
 if (item.stockQuantity === 0) return 'Out of stock';
 return `${item.stockQuantity} left`;
};

const stockClass = (item: any) => {
 if (!item.trackStock) return '';
 if (item.stockQuantity === 0) return 'inv-product-card__stock--danger';
 if (item.stockQuantity < 5) return 'inv-product-card__stock--warn';
 return '';
};

const stockDotClass = (item: any) => {
 if (!item.trackStock) return 'bg-emerald-400';
 if (item.stockQuantity === 0) return 'bg-red-500';
 if (item.stockQuantity < 5) return 'bg-amber-400';
 return 'bg-emerald-400';
};

const stockTextClass = (item: any) => {
 if (!item.trackStock) return 'text-gray-600';
 if (item.stockQuantity === 0) return 'text-red-600';
 if (item.stockQuantity < 5) return 'text-amber-600';
 return 'text-emerald-600';
};

// ─── Columns ───
const productColumns = [
 { key: 'name', label: 'Product' },
 { key: 'price', label: 'Price' },
 { key: 'stock', label: 'Stock' },
 { key: 'status', label: 'Status' }
];

// ─── Actions ───
const openAddProduct = () => { selectedProduct.value = null; isProductDrawerOpen.value = true; };
const viewProductDetails = (product: any) => { selectedProduct.value = { ...product }; isProductDrawerOpen.value = true; }; // Re-using drawer for viewing
const editProduct = (product: any) => { selectedProduct.value = { ...product }; isProductDrawerOpen.value = true; };
const closeProductDrawer = () => { isProductDrawerOpen.value = false; selectedProduct.value = null; };

const isSavingProduct = ref(false);
const handleSaveProduct = async (formData: any) => {
 isSavingProduct.value = true;
 try {
  if (selectedProduct.value) {
   await updateProduct((selectedProduct.value as any)._id, formData);
  } else {
   await createProduct(formData);
  }
  closeProductDrawer();
 } finally {
  isSavingProduct.value = false;
 }
};

const confirmDelete = (product: any) => { productToDelete.value = product; isDeleteModalOpen.value = true; };
const handleDeleteProduct = async () => {
 if (productToDelete.value) {
  await deleteProduct((productToDelete.value as any)._id);
  isDeleteModalOpen.value = false;
  productToDelete.value = null;
 }
};

const handleSaveCategory = async (catData: any) => { await createCategory(catData); isCategoryDrawerOpen.value = false; };
const openAddPack = () => { selectedPack.value = null; isPackDrawerOpen.value = true; };
const editPack = (pack: any) => { selectedPack.value = { ...pack }; isPackDrawerOpen.value = true; };
const openAddAddOn = () => { selectedAddOn.value = null; isAddOnDrawerOpen.value = true; };
const editAddOn = (addon: any) => { selectedAddOn.value = { ...addon }; isAddOnDrawerOpen.value = true; };
const quickToggleAvailability = async (product: any) => { await toggleAvailability(product._id); };

// ─── Data Loading ───
const loadData = async () => {
 // Agressively fetch fresh profile to ensure businessType/vendorType is up-to-date
 await useVendorProfile().fetchProfile();
 
 fetchProducts();
 fetchCategories();
 fetchAddOnGroups();
 fetchPacks();
};

onMounted(() => {
 loadData();
});


</script>
