<template>
  <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Storefront Page Designer</h1>
        <p class="text-sm text-slate-500 font-medium mt-0.5">
          Design your custom branded storefront. Drag sections to reorder. Live on
          <span class="font-mono text-[#FF5C1A] font-bold">{{ storeUrl }}</span>.
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0">
        <a
          :href="previewUrl"
          target="_blank"
          rel="noopener"
          class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
        >
          <Eye class="w-3.5 h-3.5" /> Preview Storefront
        </a>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white text-xs font-bold transition-all disabled:opacity-40 inline-flex items-center gap-2 shadow-sm cursor-pointer"
          :disabled="saving"
          @click="save"
        >
          <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
          <Save v-else class="w-3.5 h-3.5" />
          <span>{{ saving ? 'Saving…' : 'Publish Page' }}</span>
        </button>
      </div>
    </div>

    <div v-if="notice" class="mb-4 p-3.5 rounded-xl text-xs font-bold flex items-center justify-between" :class="noticeError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'">
      <span>{{ notice }}</span>
      <button @click="notice = ''" class="text-slate-400 hover:text-slate-600">✕</button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid lg:grid-cols-[240px_1fr_340px] gap-4">
      <div class="h-96 rounded-2xl bg-slate-100 animate-pulse" />
      <div class="h-96 rounded-2xl bg-slate-100 animate-pulse" />
      <div class="h-96 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <!-- Designer Grid -->
    <div v-else class="grid lg:grid-cols-[240px_1fr_340px] gap-4 items-start">
      <!-- ── Left Palette ── -->
      <aside class="rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-24 shadow-2xs">
        <div class="flex items-center justify-between mb-3 px-1">
          <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Add Sections</p>
          <span class="text-[10px] font-bold text-slate-400">{{ blocks.length }} active</span>
        </div>

        <div class="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
          <button
            v-for="def in BLOCK_DEFINITIONS"
            :key="def.type"
            type="button"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#FF5C1A] transition-colors border border-transparent hover:border-orange-100 cursor-pointer"
            @click="addBlock(def.type)"
          >
            <component :is="def.icon" class="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#FF5C1A]" />
            <div class="min-w-0 flex-1">
              <p class="truncate">{{ def.label }}</p>
            </div>
            <Plus class="w-3.5 h-3.5 text-slate-300 ml-auto" />
          </button>
        </div>
      </aside>

      <!-- ── Middle Canvas ── -->
      <section class="min-h-[460px]">
        <div v-if="blocks.length === 0" class="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white p-6 space-y-3">
          <div class="w-12 h-12 bg-orange-50 text-[#FF5C1A] rounded-2xl flex items-center justify-center mx-auto text-xl">
            🎨
          </div>
          <h3 class="font-extrabold text-slate-900 text-lg">Your Storefront is using the Default View</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Add modular sections from the left (Hero, About, Services, Products, Gallery, FAQ) to craft your custom storefront page!
          </p>
          <button
            type="button"
            class="mt-2 px-5 py-2.5 rounded-xl bg-[#FF5C1A] text-white text-xs font-black shadow-sm hover:bg-[#E54D12] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            @click="addBlock('hero')"
          >
            <Plus class="w-4 h-4" /> Start with Hero Section
          </button>
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="(block, index) in blocks"
            :key="block.id"
            draggable="true"
            class="group relative rounded-2xl border bg-white transition-all cursor-pointer shadow-2xs"
            :class="[
              selectedId === block.id ? 'border-[#FF5C1A] ring-2 ring-[#FF5C1A]/20' : 'border-slate-200 hover:border-slate-300',
              dragIndex === index ? 'opacity-30' : '',
              dropIndex === index ? 'border-t-4 border-t-[#FF5C1A]' : '',
            ]"
            @dragstart="onDragStart(index)"
            @dragover.prevent="onDragOver(index)"
            @dragleave="onDragLeave(index)"
            @drop.prevent="onDrop(index)"
            @dragend="onDragEnd"
            @click="selectedId = block.id"
          >
            <!-- Block Card Header -->
            <div class="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <GripVertical class="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
              <component :is="definitionFor(block.type)?.icon" class="w-4 h-4 text-slate-500 shrink-0" />
              <p class="text-xs font-black text-slate-800 flex-1 truncate">
                {{ definitionFor(block.type)?.label || block.type }}
              </p>

              <button
                type="button"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                :class="block.isVisible ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-500 bg-slate-100'"
                :title="block.isVisible ? 'Visible to students' : 'Hidden from students'"
                @click.stop="toggleVisible(block)"
              >
                {{ block.isVisible ? 'Visible' : 'Hidden' }}
              </button>

              <button
                type="button"
                class="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove section"
                @click.stop="removeBlock(index)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Block Card Mini Preview -->
            <div class="px-4 py-3" :class="{ 'opacity-40': !block.isVisible }">
              <p class="text-sm font-extrabold text-slate-900 truncate">
                {{ block.props.headline || block.props.title || definitionFor(block.type)?.label }}
              </p>
              <p v-if="block.props.subheadline || block.props.body" class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {{ block.props.subheadline || block.props.body }}
              </p>
              <p v-else class="text-[11px] text-slate-400 mt-0.5">
                {{ definitionFor(block.type)?.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Right Inspector ── -->
      <aside class="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 shadow-2xs">
        <template v-if="selectedBlock">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Settings</p>
              <h4 class="text-sm font-extrabold text-slate-900 mt-0.5">
                {{ definitionFor(selectedBlock.type)?.label }} Section
              </h4>
            </div>
            <button
              type="button"
              class="text-xs font-bold text-slate-400 hover:text-slate-700"
              @click="selectedId = ''"
            >
              Done
            </button>
          </div>

          <div class="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            <template v-for="field in definitionFor(selectedBlock.type)?.fields || []" :key="field.key">
              <!-- Text & URL Input -->
              <label v-if="field.type === 'text' || field.type === 'url'" class="block">
                <span class="text-[11px] font-bold text-slate-700">{{ field.label }}</span>
                <input
                  v-model="selectedBlock.props[field.key]"
                  type="text"
                  :placeholder="field.placeholder"
                  class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-all"
                />
              </label>

              <!-- Textarea Input -->
              <label v-else-if="field.type === 'textarea'" class="block">
                <span class="text-[11px] font-bold text-slate-700">{{ field.label }}</span>
                <textarea
                  v-model="selectedBlock.props[field.key]"
                  rows="3"
                  :placeholder="field.placeholder"
                  class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-all resize-none"
                />
              </label>

              <!-- Image Input -->
              <label v-else-if="field.type === 'image'" class="block">
                <span class="text-[11px] font-bold text-slate-700">{{ field.label }}</span>
                <input
                  v-model="selectedBlock.props[field.key]"
                  type="text"
                  placeholder="https://…"
                  class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-all"
                />
                <span v-if="field.help" class="text-[10px] text-slate-400 block mt-1">{{ field.help }}</span>
                <img
                  v-if="selectedBlock.props[field.key]"
                  :src="selectedBlock.props[field.key]"
                  alt=""
                  class="mt-2 w-full h-24 object-cover rounded-xl border border-slate-200"
                />
              </label>

              <!-- List Repeater -->
              <div v-else-if="field.type === 'list'" class="block">
                <span class="text-[11px] font-bold text-slate-700">{{ field.label }}</span>
                <div class="mt-1.5 space-y-2">
                  <div
                    v-for="(row, rIdx) in listRows(selectedBlock, field.key)"
                    :key="rIdx"
                    class="rounded-xl border border-slate-200 p-2.5 bg-slate-50/50 space-y-2"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold text-slate-400">#{{ rIdx + 1 }}</span>
                      <button
                        type="button"
                        class="text-[10px] font-bold text-red-500 hover:underline"
                        @click="removeRow(selectedBlock, field.key, rIdx)"
                      >
                        Remove
                      </button>
                    </div>

                    <template v-for="item in field.itemFields || []" :key="item.key">
                      <textarea
                        v-if="item.type === 'textarea'"
                        :value="row[item.key]"
                        rows="2"
                        :placeholder="item.label"
                        class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#FF5C1A]"
                        @input="setRowValue(selectedBlock, field.key, rIdx, item.key, ($event.target as HTMLTextAreaElement).value)"
                      />
                      <input
                        v-else
                        :value="row[item.key]"
                        type="text"
                        :placeholder="item.label"
                        class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#FF5C1A]"
                        @input="setRowValue(selectedBlock, field.key, rIdx, item.key, ($event.target as HTMLInputElement).value)"
                      />
                    </template>
                  </div>

                  <button
                    type="button"
                    class="w-full py-2 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    @click="addRow(selectedBlock, field.key)"
                  >
                    + Add {{ field.label }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </template>

        <div v-else class="py-16 text-center">
          <MousePointerClick class="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p class="text-xs font-bold text-slate-700">Select Any Section</p>
          <p class="text-[11px] text-slate-400 mt-1 max-w-[180px] mx-auto">
            Click a section on the canvas to edit its headlines, images, and content.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Plus, Trash2, Save, Eye, GripVertical, MousePointerClick, Loader2
} from 'lucide-vue-next';
import { useVendorProfile } from '@/composables/modules/vendors';
import { BLOCK_DEFINITIONS, definitionFor, makeBlock } from '@/composables/usePageBlocks';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Storefront Designer - Errander Vendor' });

const { profile, fetchProfile, updateProfile } = useVendorProfile();

const blocks = ref<any[]>([]);
const selectedId = ref('');
const loading = ref(true);
const saving = ref(false);
const notice = ref('');
const noticeError = ref(false);

const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

const storeUrl = computed(() => {
  const sub = profile.value?.subdomain;
  return sub ? `${sub}.erranders.org` : 'yourstore.erranders.org';
});

const previewUrl = computed(() => {
  const p = profile.value;
  if (!p) return '#';
  if (p.subdomain) return `https://${p.subdomain}.erranders.org`;
  const id = p._id || p.id;
  return `https://student.erranders.org/vendors/${id}`;
});

const selectedBlock = computed(() => blocks.value.find((b) => b.id === selectedId.value) || null);

onMounted(async () => {
  loading.value = true;
  try {
    if (!profile.value) {
      await fetchProfile();
    }
    const current = profile.value?.pageBlocks || [];
    blocks.value = JSON.parse(JSON.stringify(current));
  } catch (err) {
    console.error('Failed to load page blocks', err);
  } finally {
    loading.value = false;
  }
});

const addBlock = (type: string) => {
  const fresh = makeBlock(type);
  blocks.value.push(fresh);
  selectedId.value = fresh.id;
};

const removeBlock = (index: number) => {
  const removed = blocks.value.splice(index, 1)[0];
  if (removed?.id === selectedId.value) {
    selectedId.value = '';
  }
};

const toggleVisible = (block: any) => {
  block.isVisible = !block.isVisible;
};

// Drag and drop handlers
const onDragStart = (idx: number) => {
  dragIndex.value = idx;
};

const onDragOver = (idx: number) => {
  if (dragIndex.value === null || dragIndex.value === idx) return;
  dropIndex.value = idx;
};

const onDragLeave = (_idx: number) => {
  dropIndex.value = null;
};

const onDrop = (idx: number) => {
  if (dragIndex.value === null) return;
  const item = blocks.value.splice(dragIndex.value, 1)[0];
  blocks.value.splice(idx, 0, item);
  dragIndex.value = null;
  dropIndex.value = null;
};

const onDragEnd = () => {
  dragIndex.value = null;
  dropIndex.value = null;
};

// List field helpers
const listRows = (block: any, key: string) => {
  if (!Array.isArray(block.props[key])) {
    block.props[key] = [];
  }
  return block.props[key];
};

const addRow = (block: any, key: string) => {
  listRows(block, key).push({});
};

const removeRow = (block: any, key: string, rIdx: number) => {
  listRows(block, key).splice(rIdx, 1);
};

const setRowValue = (block: any, fieldKey: string, rIdx: number, itemKey: string, val: string) => {
  const row = listRows(block, fieldKey)[rIdx] || {};
  row[itemKey] = val;
};

const save = async () => {
  saving.value = true;
  notice.value = '';
  noticeError.value = false;

  try {
    const vendorId = profile.value?.data?._id || profile.value?._id;
    if (!vendorId) throw new Error('Vendor ID not found');

    await updateProfile(vendorId, { pageBlocks: blocks.value });
    notice.value = 'Storefront design published successfully! Students can now see your custom page.';
    await fetchProfile();
  } catch (err: any) {
    noticeError.value = true;
    notice.value = err?.message || 'Could not save page design.';
  } finally {
    saving.value = false;
  }
};
</script>
