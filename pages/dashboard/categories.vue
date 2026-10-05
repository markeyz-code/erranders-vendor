<template>
  <div class="py-5 pb-10 container mx-auto animate-fade-in space-y-6 w-full">
    <!-- Header with Stats & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6">
      <div class="space-y-1">
        <h1 class="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">Store Categories</h1>
        <p class="text-sm text-gray-400 font-medium flex items-center gap-2">
          Organize your products and services into collections.
          <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-sm font-bold bg-blue-50 text-parentPrimary">
            {{ categories.length }} CATEGORIES
          </span>
        </p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <button 
          @click="openAddCategory"
          class="px-6 py-2 bg-gray-900 text-white rounded-md font-bold text-sm hover:bg-black active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus class="w-4 h-4" /> Add New Category
        </button>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white rounded-md overflow-hidden min-h-[500px]">
      <UiTable  
        :columns="categoryColumns" 
        :items="categories" 
        :loading="loadingCats"
        empty-title="No categories found"
        empty-subtitle="You haven't added any categories yet."
        :has-actions="true">
        <template #name="{ item }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-md bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border border-gray-50">
              <img v-if="(item as any).image" :src="(item as any).image" class="w-full h-full object-cover" />
              <Folder v-else class="w-5 h-5 text-gray-300" />
            </div>
            <div class="truncate">
              <p class="font-bold text-gray-900 truncate">{{ (item as any).name }}</p>
              <p class="text-sm text-gray-400 font-medium">{{ (item as any).description || 'No description' }}</p>
            </div>
          </div>
        </template>
        
        <template #status="{ item }">
          <span 
            :class="(item as any).isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-red-50 text-red-600 border-red-100/50'"
            class="text-xs font-bold px-2 py-0.5 rounded-lg border-0 cursor-pointer hover:scale-105 transition-transform"
          >
            {{ (item as any).isActive ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300 hover:text-gray-900" @click.stop="editCategory(item as any)">
              <Edit2 class="w-3.5 h-3.5" />
            </button>
            <button class="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-300 hover:text-red-500" @click.stop="confirmDelete(item as any)">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>

    <!-- Drawers & Modals -->
    <CategoryDrawer 
      :isOpen="isCategoryDrawerOpen" 
      :category="categoryToEdit"
      @close="isCategoryDrawerOpen = false; categoryToEdit = null"
      @save="handleSaveCategory"
    />

    <ConfirmModal 
      :isOpen="isDeleteModalOpen"
      title="Delete Category?"
      :message="`Are you sure you want to remove '${(categoryToDelete as any)?.name}'? Products or services under this category will no longer show this category.`"
      variant="danger"
      confirm-text="Delete Category"
      @confirm="handleDeleteCategory"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit2, Trash2, Folder } from 'lucide-vue-next';
import { useVendorCategories } from '@/composables/modules/products';
import CategoryDrawer from '@/components/dashboard/CategoryDrawer.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import UiTable from '@/components/ui/UiTable.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Categories - Errander Vendor' });

const { categories, loading: loadingCats, fetchCategories, createCategory, updateCategory, deleteCategory } = useVendorCategories();

const isCategoryDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const categoryToEdit = ref(null);
const categoryToDelete = ref(null);

const categoryColumns = [
  { key: 'name', label: 'Category Details' },
  { key: 'status', label: 'Status' }
];

const openAddCategory = () => {
  categoryToEdit.value = null;
  isCategoryDrawerOpen.value = true;
};

const editCategory = (category: any) => {
  categoryToEdit.value = { ...category };
  isCategoryDrawerOpen.value = true;
};

const handleSaveCategory = async (catData: any) => {
  if (categoryToEdit.value) {
    await updateCategory((categoryToEdit.value as any)._id, catData);
  } else {
    await createCategory(catData);
  }
  isCategoryDrawerOpen.value = false;
  fetchCategories();
};

const confirmDelete = (category: any) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};

const handleDeleteCategory = async () => {
  if (categoryToDelete.value) {
    await deleteCategory((categoryToDelete.value as any)._id);
    isDeleteModalOpen.value = false;
    categoryToDelete.value = null;
    fetchCategories();
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
