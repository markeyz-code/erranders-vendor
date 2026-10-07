<template>
  <div class="min-h-screen bg-white text-gray-900 p-4 md:p-6 lg:p-8 font-sans">
    <div class="max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <!-- Header -->
      <header class="flex justify-between items-start mb-6">
        <div>
          <div v-if="isOnboarding" class="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500">
            <span class="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">4</span>
            Final Step
          </div>
          <h1 class="text-2xl font-bold mb-1">Add products</h1>
          <p class="text-sm text-gray-500">Tick items you stock, then set a price for each</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <button v-if="isOnboarding" @click="skipOnboarding" class="text-gray-500 hover:text-gray-900 underline text-sm mr-4">Skip for now</button>
          <span v-if="vendorProfile">{{ vendorProfile.storeName || 'Your Store' }}</span>
          <span v-else class="animate-pulse w-24 h-4 bg-gray-100 rounded"></span>
          <ChevronDown class="w-4 h-4 text-gray-400" />
        </div>
      </header>

      <!-- Search -->
      <div class="relative mb-6">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          v-model="searchQuery" 
          @input="debounceSearch"
          type="text" 
          placeholder="Search global catalog" 
          class="w-full bg-gray-50 text-gray-900 border border-gray-25 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 outline-none placeholder-gray-400 transition-all"
        />
      </div>

      <!-- Categories -->
      <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
          :class="activeCategory === cat ? 'bg-gray-900 text-white font-medium' : 'bg-transparent text-gray-500 border border-gray-25 hover:border-gray-400'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="flex-1 overflow-y-auto min-h-0 pb-24">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-8 h-8 border border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
        <div v-else-if="filteredProducts.length === 0" class="text-center py-12 text-gray-400">
          No products found.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div 
            v-for="product in filteredProducts" 
            :key="product._id"
            @click="toggleSelection(product)"
            class="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border"
            :class="selectedItems[product._id] ? 'bg-blue-50/60 border-blue-200' : 'bg-transparent border-gray-100 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-4 flex-1">
              <!-- Custom Checkbox -->
              <div 
                class="w-5 h-5 rounded flex items-center justify-center shrink-0"
                :class="selectedItems[product._id] ? 'bg-blue-600' : 'border border-gray-300'"
              >
                <Check v-if="selectedItems[product._id]" class="w-3.5 h-3.5 text-white" />
              </div>
              
              <!-- Image Placeholder -->
              <div class="w-12 h-12 bg-gray-100 rounded-xl shrink-0 overflow-hidden border border-gray-25">
                <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
              </div>
              
              <!-- Name -->
              <span class="text-sm font-medium" :class="selectedItems[product._id] ? 'text-gray-900' : 'text-gray-700'">
                {{ product.name }}
              </span>
            </div>

            <!-- Price Input (only visible when selected) -->
            <div v-if="selectedItems[product._id]" class="ml-4 flex items-center bg-white rounded-lg px-3 py-1.5 border border-gray-25" @click.stop>
              <span class="text-gray-400 text-sm mr-1">₦</span>
              <input 
                v-model.number="selectedItems[product._id].price"
                type="number"
                class="w-16 bg-transparent text-gray-900 text-base outline-none text-right font-medium"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <button @click="router.push('/products?action=add')" class="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Plus class="w-4 h-4" /> Can't find it? Add a new product manually
        </button>
      </div>

      <!-- Footer Bar -->
      <div class="fixed bottom-0 left-0 right-0 p-4 md:px-8 border-t border-gray-200 bg-white flex items-center justify-between z-10">
        <span class="text-sm text-gray-500">{{ selectedCount }} of {{ totalCount }} selected</span>
        <button 
          @click="submitBulkAdd"
          :disabled="isSubmitting || selectedCount === 0"
          class="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin"></span>
          {{ isOnboarding ? 'Complete Setup' : 'Save products' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, ChevronDown, Check, Plus } from 'lucide-vue-next';
import { useRouter, useRoute } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: false // Using custom layout for full page takeover
});

const router = useRouter();
const route = useRoute();
const isOnboarding = computed(() => route.query.onboarding === 'true');
const { showToast } = useCustomToast();

const skipOnboarding = () => {
  router.push('/dashboard');
};

const searchQuery = ref('');
const loading = ref(false);
const isSubmitting = ref(false);
const globalProducts = ref<any[]>([]);
const selectedItems = ref<Record<string, any>>({});
const activeCategory = ref('All');
const vendorProfile = ref<any>(null);

const categories = ['All', 'Noodles and food', 'Drinks', 'Toiletries', 'Stationery', 'Snacks'];

let searchTimeout: any;

const fetchVendorProfile = async () => {
  try {
    const res = await api.get('/vendors/mine');
    vendorProfile.value = res.data;
  } catch (error) {
    console.error('Failed to fetch profile', error);
  }
};

const fetchCatalog = async (q = '') => {
  loading.value = true;
  try {
    const res = await api.get(`/global-products/search?q=${encodeURIComponent(q)}`);
    globalProducts.value = res.data;
  } catch (error) {
    console.error('Failed to fetch catalog', error);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return globalProducts.value;
  return globalProducts.value.filter(p => {
    const cat = p.category?.toLowerCase() || '';
    if (activeCategory.value === 'Noodles and food') return cat.includes('noodle') || cat.includes('food');
    if (activeCategory.value === 'Drinks') return cat.includes('drink') || cat.includes('beverage');
    if (activeCategory.value === 'Toiletries') return cat.includes('toiletries') || cat.includes('personal care');
    if (activeCategory.value === 'Stationery') return cat.includes('stationery');
    if (activeCategory.value === 'Snacks') return cat.includes('snack');
    return false;
  });
});

const selectedCount = computed(() => Object.keys(selectedItems.value).length);
const totalCount = computed(() => globalProducts.value.length);

onMounted(() => {
  fetchCatalog();
  fetchVendorProfile();
});

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchCatalog(searchQuery.value);
  }, 500);
};

const toggleSelection = (product: any) => {
  if (selectedItems.value[product._id]) {
    delete selectedItems.value[product._id];
  } else {
    selectedItems.value[product._id] = {
      globalProductId: product._id,
      price: product.price || 0
    };
  }
};

const submitBulkAdd = async () => {
  const items = Object.values(selectedItems.value);
  if (items.some(item => !item.price || item.price <= 0)) {
    showToast({ title: 'Error', message: 'Please set a valid price for all selected items.', toastType: 'error' });
    return;
  }
  
  isSubmitting.value = true;
  try {
    const { isFoodVendor } = useVendorProfile();
    const endpoint = isFoodVendor.value ? '/menu/items/bulk-from-catalog' : '/products/bulk-from-catalog';
    
    await api.post(endpoint, { items });
    if (isOnboarding.value) {
      router.push('/dashboard');
    } else {
      router.push('/products');
    }
  } catch (error) {
    console.error('Bulk add failed', error);
    showToast({ title: 'Error', message: 'Failed to add products', toastType: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
/* Hide scrollbar for category list */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
