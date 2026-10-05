<template>
  <div class="space-y-3">
    <!-- List of Groups -->
    <div v-for="(group, groupIndex) in modelValue" :key="groupIndex" class="border border-gray-25 rounded-lg p-4 space-y-4 bg-white relative group/card">
      
      <!-- Group Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1 space-y-3">
          <input 
            v-model="group.name" 
            :placeholder="type === 'modifier' ? 'e.g. Choose Protein' : 'e.g. Extra Toppings'" 
            class="text-base font-bold w-full bg-transparent border-b border-gray-200 focus:border-gray-25outline-none py-1.5 placeholder:text-gray-400 transition-colors"
          />
          <div class="flex gap-4 text-xs font-medium text-gray-500">
            <label class="flex items-center gap-1.5">
              Min: 
              <input type="number" v-model.number="group.minSelection" min="0" class="w-14 px-2 py-1 border border-gray-25 rounded-md outline-none text-gray-900 focus:ring-1 focus:ring-gray-900 transition-all" />
            </label>
            <label class="flex items-center gap-1.5">
              Max: 
              <input type="number" v-model.number="group.maxSelection" min="1" class="w-14 px-2 py-1 border border-gray-25 rounded-md outline-none text-gray-900 focus:ring-1 focus:ring-gray-900 transition-all" />
            </label>
          </div>
        </div>
        <button type="button" @click="removeGroup(groupIndex)" class="text-gray-300 hover:text-red-500 p-1 transition-colors opacity-0 group-hover/card:opacity-100">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <!-- Items in Group -->
      <div class="space-y-2">
        <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="flex gap-2 items-center">
          <input 
            v-model="item.name" 
            :placeholder="type === 'modifier' ? 'e.g. Chicken' : 'e.g. Extra Sauce'" 
            class="flex-1 px-3 py-2 bg-gray-50 border border-gray-25 rounded-lg text-base outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-25transition-all"
          />
          <div class="relative">
            <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₦</span>
            <input 
              v-model.number="item.price" 
              type="number" 
              placeholder="0" 
              class="w-24 pl-7 pr-2 py-2 bg-gray-50 border border-gray-25 rounded-lg text-base outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-25transition-all"
            />
          </div>
          <button type="button" @click="removeItem(groupIndex, itemIndex)" class="text-gray-300 hover:text-red-500 p-1 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
        <button type="button" @click="addItem(groupIndex)" class="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-1 hover:text-blue-800 transition-colors">
          <Plus class="w-3.5 h-3.5" /> Add option
        </button>
      </div>
    </div>

    <!-- Add Group Button -->
    <button type="button" @click="addGroup" class="w-full py-2.5 border border-dashed border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-2">
      <Plus class="w-4 h-4" /> Add {{ type === 'modifier' ? 'modifier group' : 'add-on group' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus, X } from 'lucide-vue-next';
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    required: true
  },
  type: {
    type: String,
    default: 'modifier'
  }
});

const emit = defineEmits(['update:modelValue']);

const addGroup = () => {
  const newGroup = {
    name: '',
    minSelection: props.type === 'modifier' ? 1 : 0,
    maxSelection: 1,
    items: [{ name: '', price: 0 }]
  };
  emit('update:modelValue', [...props.modelValue, newGroup]);
};

const removeGroup = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
};

const addItem = (groupIndex: number) => {
  const updated = [...props.modelValue];
  updated[groupIndex].items.push({ name: '', price: 0 });
  emit('update:modelValue', updated);
};

const removeItem = (groupIndex: number, itemIndex: number) => {
  const updated = [...props.modelValue];
  updated[groupIndex].items.splice(itemIndex, 1);
  emit('update:modelValue', updated);
};
</script>
