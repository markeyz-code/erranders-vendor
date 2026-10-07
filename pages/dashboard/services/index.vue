<template>
  <div class="space-y-6 animate-fade-in w-full px-4 pb-20 sm:px-8">
    <!-- Header with Stats & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6">
      <div class="space-y-1">
        <h1 class="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">Services Management</h1>
        <p class="text-sm text-gray-400 font-medium flex items-center gap-2">
          Organize your service offerings and appointments. 
          <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-sm font-bold bg-blue-50 text-parentPrimary">
            {{ servicesList.length }} SERVICES
          </span>
        </p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <button 
          @click="openAddService"
          class="px-6 py-2 bg-gray-900 text-white rounded-md font-bold text-sm hover:bg-black active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus class="w-4 h-4" /> Add New Service
        </button>
      </div>
    </div>

    <!-- Services Table -->
    <div class="bg-white rounded-md overflow-hidden min-h-[500px]">
      <UiTable  
        :columns="serviceColumns" 
        :items="servicesList" 
        :loading="loading"
        empty-title="No services found"
        empty-subtitle="You haven't added any services yet."
       :has-actions="true">
        <template #name="{ item }">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-md bg-gray-50 overflow-hidden shrink-0">
              <img :src="(item as any).image || '/placeholder-service.jpg'" class="w-full h-full object-cover" />
            </div>
            <div class="truncate">
              <p class="font-bold text-gray-900 truncate">{{ (item as any).name }}</p>
              <p class="text-sm text-gray-400 font-bold">{{ (item as any).category }}</p>
            </div>
          </div>
        </template>
        
        <template #price="{ item }">
          <div class="flex flex-col">
            <span class="font-bold text-gray-900">₦{{ (item as any).price?.toLocaleString() }}</span>
            <span class="text-sm text-gray-500 font-medium">{{ (item as any).durationInMinutes }} mins</span>
          </div>
        </template>

        <template #status="{ item }">
          <span 
            :class="(item as any).isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-red-50 text-red-600 border-red-100/50'"
            class="text-sm font-bold px-2 py-0.5 rounded-lg border-0 cursor-pointer hover:scale-105 transition-transform"
            @click.stop="quickToggleAvailability(item as any)"
          >
            {{ (item as any).isAvailable ? 'Available' : 'Unavailable' }}
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300 hover:text-gray-900" @click.stop="editService(item as any)">
              <Edit2 class="w-3.5 h-3.5" />
            </button>
            <button class="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-300 hover:text-red-500" @click.stop="confirmDelete(item as any)">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>

    <!-- Modals & Drawers -->
    <ServiceDrawer 
      :isOpen="isDrawerOpen" 
      :service="serviceToEdit"
      :categories="categories"
      @close="isDrawerOpen = false; serviceToEdit = null" 
      @save="handleSaveService" 
    />
    
    <ConfirmModal 
      :isOpen="isDeleteModalOpen"
      title="Delete Service?"
      :message="`Are you sure you want to remove '${(serviceToDelete as any)?.name}'? This action cannot be undone.`"
      variant="danger"
      confirm-text="Delete Service"
      @confirm="handleDeleteService"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit2, Trash2 } from 'lucide-vue-next';
import { useVendorServices } from '@/composables/modules/services';
import { useVendorCategories } from '@/composables/modules/products';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import UiTable from '@/components/ui/UiTable.vue';
import ServiceDrawer from '@/components/services/ServiceDrawer.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Services - Errander Vendor' });

const { servicesList, loading, fetchServices, deleteService, toggleAvailability, createService, updateService } = useVendorServices();
const { categories, fetchCategories } = useVendorCategories();

const isDeleteModalOpen = ref(false);
const serviceToDelete = ref(null);

const isDrawerOpen = ref(false);
const serviceToEdit = ref<any>(null);

const serviceColumns = [
  { key: 'name', label: 'Service Details' },
  { key: 'price', label: 'Price & Duration' },
  { key: 'status', label: 'Status' }
];

const openAddService = () => {
  serviceToEdit.value = null;
  isDrawerOpen.value = true;
};

const editService = (service: any) => {
  serviceToEdit.value = service;
  isDrawerOpen.value = true;
};

const handleSaveService = async (payload: any) => {
  if (serviceToEdit.value) {
    await updateService(serviceToEdit.value._id, payload);
  } else {
    await createService(payload);
  }
  isDrawerOpen.value = false;
  fetchServices();
};

const confirmDelete = (service: any) => {
  serviceToDelete.value = service;
  isDeleteModalOpen.value = true;
};

const handleDeleteService = async () => {
  if (serviceToDelete.value) {
    await deleteService((serviceToDelete.value as any)._id);
    isDeleteModalOpen.value = false;
    serviceToDelete.value = null;
  }
};

const quickToggleAvailability = async (service: any) => {
  await toggleAvailability(service._id);
};

onMounted(() => {
  fetchServices();
  fetchCategories();
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
