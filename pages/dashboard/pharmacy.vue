<template>
  <div class="space-y-5 pb-24">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-xl font-black tracking-tight text-gray-900">Pharmacy</h1>
        <p class="text-sm text-gray-500">Questions from customers, and what needs your attention before dispatch.</p>
      </div>
      <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" @click="load">
        Refresh
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-2xl border border-gray-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Unanswered</p>
        <p class="mt-0.5 text-2xl font-black text-gray-900">{{ unanswered }}</p>
      </div>
      <div class="rounded-2xl border border-gray-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total threads</p>
        <p class="mt-0.5 text-2xl font-black text-gray-900">{{ threads.length }}</p>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400">
      Loading questions…
    </div>

    <div v-else-if="!threads.length" class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center">
      <p class="text-sm font-bold text-gray-900">No questions yet</p>
      <p class="mx-auto mt-1 max-w-sm text-xs text-gray-500">
        When a customer asks about a medicine before buying, it appears here. They are also notified on WhatsApp.
      </p>
    </div>

    <div v-else class="space-y-2">
      <div v-for="t in threads" :key="t._id" class="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <button class="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-gray-50" @click="toggle(t._id)">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                :class="t.status === 'open' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'">
                {{ t.status }}
              </span>
              <p class="truncate text-sm font-bold text-gray-900">{{ t.subject }}</p>
            </div>
            <p class="mt-0.5 text-[11px] text-gray-500">
              {{ t.customer?.firstName || 'Customer' }} {{ t.customer?.lastName || '' }}
              · {{ t.messages?.length || 0 }} message{{ (t.messages?.length || 0) === 1 ? '' : 's' }}
              · {{ timeAgo(t.lastMessageAt) }}
            </p>
          </div>
          <ChevronDown class="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform" :class="expanded === t._id ? 'rotate-180' : ''" />
        </button>

        <div v-if="expanded === t._id" class="border-t border-gray-50 p-4 space-y-3">
          <div class="space-y-2">
            <div v-for="(m, i) in t.messages" :key="i"
              class="max-w-[85%] rounded-xl px-3 py-2 text-sm"
              :class="m.sender === 'pharmacist' ? 'ml-auto bg-emerald-50 text-emerald-900' : 'bg-gray-50 text-gray-800'">
              <p class="text-[10px] font-bold uppercase tracking-wider opacity-60">{{ m.sender }}</p>
              <p class="mt-0.5 whitespace-pre-line">{{ m.body }}</p>
            </div>
          </div>

          <div v-if="t.customer?.phone" class="text-[11px] text-gray-500">
            Customer phone: <span class="font-mono font-semibold text-gray-700">{{ t.customer.phone }}</span>
          </div>

          <textarea v-model="drafts[t._id]" rows="3" placeholder="Type your answer as the pharmacist…"
            class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white" />

          <button class="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            :disabled="sending === t._id" @click="send(t)">
            {{ sending === t._id ? 'Sending…' : 'Send reply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

const { showToast } = useCustomToast();
const threads = ref<any[]>([]);
const loading = ref(true);
const expanded = ref<string | null>(null);
const sending = ref<string | null>(null);
const drafts = reactive<Record<string, string>>({});

const unanswered = computed(() => threads.value.filter((t) => t.status === 'open').length);

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('/pharmacy-chat/vendor');
    threads.value = res.data || [];
  } catch {
    showToast({ title: 'Error', message: 'Could not load questions', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const toggle = (id: string) => { expanded.value = expanded.value === id ? null : id; };

const send = async (t: any) => {
  const text = (drafts[t._id] || '').trim();
  if (!text) return;
  sending.value = t._id;
  try {
    await api.post(`/pharmacy-chat/${t._id}/messages`, { message: text });
    drafts[t._id] = '';
    await load();
    showToast({ title: 'Sent', message: 'The customer has been notified.', toastType: 'success' } as any);
  } catch (e: any) {
    showToast({ title: 'Could not send', message: e?.response?.data?.message || 'Try again', toastType: 'error' } as any);
  } finally {
    sending.value = null;
  }
};

const timeAgo = (stamp?: string) => {
  if (!stamp) return '';
  const mins = Math.floor((Date.now() - new Date(stamp).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

onMounted(load);
</script>
