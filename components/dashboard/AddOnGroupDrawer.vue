<template>
  <Modal :isOpen="isOpen" @close="$emit('close')" title="Add-on Group">
    <div class="space-y-6">
      <section class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-800 block mb-1.5">Group Name</label>
          <input type="text" v-model="form.name" placeholder="e.g. Extra Protein" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all" required />
        </div>
      </section>

      <!-- Selection Rules -->
      <section class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Selection Rules</h3>

        <!-- Selection Type -->
        <div>
          <label class="text-sm font-semibold text-gray-800 block mb-2">Selection Type</label>
          <div class="flex gap-3">
            <label
              class="flex-1 flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all"
              :class="form.selectionType === 'multi' ? 'border-gray-25bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'"
            >
              <input type="radio" v-model="form.selectionType" value="multi" class="text-gray-900 focus:ring-gray-900" />
              <div>
                <p class="text-sm font-bold text-gray-900">Multi-select</p>
                <p class="text-xs text-gray-500">Customer can pick multiple extras</p>
              </div>
            </label>
            <label
              class="flex-1 flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all"
              :class="form.selectionType === 'single' ? 'border-gray-25bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'"
            >
              <input type="radio" v-model="form.selectionType" value="single" class="text-gray-900 focus:ring-gray-900" />
              <div>
                <p class="text-sm font-bold text-gray-900">Single-select</p>
                <p class="text-xs text-gray-500">Customer picks exactly one</p>
              </div>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold text-gray-800 block mb-1.5">Min Select</label>
            <input type="number" v-model.number="form.minSelect" placeholder="0 = optional" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all" />
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-800 block mb-1.5">Max Select</label>
            <input type="number" v-model.number="form.maxSelect" placeholder="No limit" class="w-full px-4 py-3 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-25transition-all" />
          </div>
        </div>
      </section>

      <!-- Options -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Options</h3>
            <p class="text-sm text-gray-500 mt-1">Each option has its own price that gets added to the order.</p>
          </div>
          <button type="button" @click="addOption" class="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">
            + Add Option
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="(opt, idx) in form.options" :key="idx" class="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
            <input type="text" v-model="opt.name" placeholder="e.g. Extra Chicken" class="flex-1 px-3 py-2 bg-white border border-gray-25 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900" />
            <div class="flex items-center gap-1 bg-white border border-gray-25 rounded-lg px-2">
              <span class="text-gray-500 text-sm">₦</span>
              <input type="number" v-model.number="opt.price" placeholder="0" class="w-20 px-1 py-2 text-base focus:outline-none" />
            </div>
            <!-- Availability toggle -->
            <label class="relative inline-flex items-center cursor-pointer shrink-0" :title="opt.isAvailable ? 'Available' : 'Unavailable'">
              <input type="checkbox" v-model="opt.isAvailable" class="sr-only peer" />
              <div class="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
            </label>
            <button type="button" @click="removeOption(idx)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex items-center gap-4 w-full">
        <button @click="$emit('close')" type="button" class="flex-1 py-3 bg-white border border-gray-25 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
        <button @click="handleSubmit" type="button" class="flex-[2] py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
          {{ group ? 'Update Group' : 'Create Group' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import { useVendorAddOnGroups } from '@/composables/modules/products';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  isOpen: boolean;
  group?: any;
}>();

const emit = defineEmits(['close', 'save']);
const { createAddOnGroup, updateAddOnGroup } = useVendorAddOnGroups();
const { showToast } = useCustomToast();

const form = reactive({
  name: '',
  selectionType: 'multi' as 'single' | 'multi',
  minSelect: 0,
  maxSelect: null as number | null,
  options: [] as { name: string; price: number; isAvailable: boolean }[]
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.group) {
      form.name = props.group.name || '';
      form.selectionType = props.group.selectionType || 'multi';
      form.minSelect = props.group.minSelect || 0;
      form.maxSelect = props.group.maxSelect ?? null;
      form.options = props.group.options
        ? JSON.parse(JSON.stringify(props.group.options))
        : [];
    } else {
      form.name = '';
      form.selectionType = 'multi';
      form.minSelect = 0;
      form.maxSelect = null;
      form.options = [];
    }
  }
});

const addOption = () => {
  form.options.push({ name: '', price: 0, isAvailable: true });
};

const removeOption = (idx: number) => {
  form.options.splice(idx, 1);
};

const handleSubmit = async () => {
  if (!form.name || form.options.length === 0) {
    showToast({ title: 'Error', message: 'Please provide a group name and at least one option.', toastType: 'error' });
    return;
  }
  
  const payload = {
    name: form.name,
    selectionType: form.selectionType,
    minSelect: form.minSelect,
    maxSelect: form.maxSelect,
    options: form.options.map(o => ({
      name: o.name,
      price: o.price,
      isAvailable: o.isAvailable,
    })),
  };

  if (props.group) {
    await updateAddOnGroup(props.group._id, payload);
  } else {
    await createAddOnGroup(payload);
  }
  emit('close');
};
</script>
