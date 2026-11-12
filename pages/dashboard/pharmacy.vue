<template>
  <div class="space-y-5 pb-24">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-xl font-black tracking-tight text-gray-900">Pharmacy</h1>
        <p class="text-sm text-gray-500">Questions from customers, and what needs your attention before dispatch.</p>
      </div>
      <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" @click="load(); loadPrescriptions()">
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

    <!-- Prescription approvals: the medicine cannot be dispatched until this is cleared. -->
    <section class="space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black tracking-tight text-gray-900">Prescriptions to review</h2>
        <span class="rounded-full px-2 py-0.5 text-[10px] font-bold"
          :class="prescriptions.length ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-500'">
          {{ prescriptions.length }} waiting
        </span>
      </div>

      <p v-if="!prescriptions.length" class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center text-xs text-gray-500">
        Nothing waiting. An order that contains a medicine needing a prescription appears here before it can be dispatched.
      </p>

      <div v-for="o in prescriptions" :key="o.id" class="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-mono text-[11px] text-gray-500">{{ o.orderNumber }}</p>
            <p class="text-sm font-bold text-gray-900">₦{{ Number(o.total).toLocaleString() }}</p>
            <p class="text-[11px] text-gray-500">{{ timeAgo(o.createdAt) }}</p>
          </div>
          <span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">awaiting review</span>
        </div>

        <a v-if="o.prescriptionImage" :href="o.prescriptionImage" target="_blank" rel="noopener"
          class="block text-[11px] font-bold text-emerald-700 underline">
          Open the uploaded prescription
        </a>
        <p v-else class="text-[11px] text-gray-500">No image attached.</p>

        <input v-model="rxNotes[o.id]" placeholder="Note (required to reject)"
          class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500" />

        <div class="flex gap-2">
          <button class="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white disabled:opacity-50"
            :disabled="reviewing === o.id" @click="review(o, 'approved')">Approve and release</button>
          <button class="flex-1 rounded-lg border border-rose-200 bg-white py-2 text-xs font-bold text-rose-600 disabled:opacity-50"
            :disabled="reviewing === o.id" @click="review(o, 'rejected')">Reject</button>
        </div>
      </div>
    </section>

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
const prescriptions = ref<any[]>([]);
const rxNotes = reactive<Record<string, string>>({});
const reviewing = ref<string | null>(null);

const loadPrescriptions = async () => {
  try {
    const res = await api.get('/pharmacy-chat/vendor/prescriptions');
    prescriptions.value = res.data?.orders || [];
  } catch { prescriptions.value = []; }
};

const review = async (order: any, decision: 'approved' | 'rejected') => {
  const note = (rxNotes[order.id] || '').trim();
  if (decision === 'rejected' && !note) {
    showToast({ title: 'Add a reason', message: 'Tell the customer why so they understand.', toastType: 'info' } as any);
    return;
  }
  reviewing.value = order.id;
  try {
    await api.post(`/pharmacy-chat/vendor/prescriptions/${order.id}`, { decision, note });
    showToast({
      title: decision === 'approved' ? 'Released' : 'Rejected',
      message: decision === 'approved' ? 'The rider can collect this now.' : 'The order has been cancelled.',
      toastType: 'success',
    } as any);
    await loadPrescriptions();
  } catch (e: any) {
    showToast({ title: 'Could not update', message: e?.response?.data?.message || 'Try again', toastType: 'error' } as any);
  } finally {
    reviewing.value = null;
  }
};

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

onMounted(() => { load(); loadPrescriptions(); });
</script>
