<template>
  <div class="mx-auto w-full max-w-6xl space-y-5 px-4 pb-24 pt-2 sm:px-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-xl font-black tracking-tight text-slate-900">Waitlist</h1>
        <p class="text-sm text-slate-500">Collect names before you have slots. Publish a form, share the link, reply on WhatsApp.</p>
      </div>
      <button class="rounded-xl bg-[#FF5C1A] px-4 py-2 text-sm font-bold text-white hover:bg-[#E54D12] disabled:opacity-50" :disabled="creating" @click="createForm">
        {{ creating ? 'Creating…' : '+ New form' }}
      </button>
    </div>

    <div v-if="loading" class="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400">Loading…</div>

    <div v-else-if="!forms.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
      <p class="text-sm font-bold text-slate-900">No forms yet</p>
      <p class="mx-auto mt-1 max-w-sm text-xs text-slate-500">
        A waitlist lets people tell you what they want before you have space. Create one, publish it, share the link.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="f in forms" :key="f._id" class="rounded-2xl border border-slate-100 bg-white p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                :class="f.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ f.isPublished ? 'published' : 'draft' }}
              </span>
              <p class="truncate text-sm font-black text-slate-900">{{ f.title }}</p>
            </div>
            <p class="mt-0.5 text-[11px] text-slate-500">
              {{ f.fields?.length || 0 }} questions · {{ f.responseCount || 0 }} response{{ (f.responseCount || 0) === 1 ? '' : 's' }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50" @click="copyLink(f)">
              Copy link
            </button>
            <button class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50" @click="togglePublish(f)">
              {{ f.isPublished ? 'Unpublish' : 'Publish' }}
            </button>
            <button class="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white" @click="openResponses(f)">
              Responses
            </button>
          </div>
        </div>

        <p v-if="f.isPublished" class="mt-2 truncate rounded-lg bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-500">
          {{ linkFor(f) }}
        </p>
      </div>
    </div>

    <!-- Responses drawer -->
    <Teleport to="body">
      <div v-if="activeForm" class="fixed inset-0 z-[200] flex justify-end">
        <div class="absolute inset-0 bg-slate-900/40" @click="activeForm = null" />
        <aside class="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
          <header class="flex items-start justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Responses</p>
              <h2 class="text-base font-black text-slate-900">{{ activeForm.title }}</h2>
            </div>
            <button class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" @click="activeForm = null">✕</button>
          </header>
          <div class="flex-1 space-y-2 overflow-y-auto p-4">
            <p v-if="!responses.length" class="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
              Nobody has filled this yet.
            </p>
            <div v-for="r in responses" :key="r._id" class="rounded-xl border border-slate-100 p-3">
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">{{ r.status }}</span>
                <span class="text-[10px] text-slate-400">{{ timeAgo(r.createdAt) }}</span>
              </div>
              <dl class="mt-2 space-y-1">
                <div v-for="(val, key) in r.answers" :key="key" class="flex justify-between gap-3 text-[11px]">
                  <dt class="text-slate-500">{{ key }}</dt>
                  <dd class="text-right font-semibold text-slate-800">{{ val }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useVendorProfile } from '@/composables/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'vendor' });

const { profile, fetchProfile } = useVendorProfile();
const { showToast } = useCustomToast();

const forms = ref<any[]>([]);
const loading = ref(true);
const creating = ref(false);
const activeForm = ref<any>(null);
const responses = ref<any[]>([]);

const subdomain = computed(() => profile.value?.subdomain || '');

const linkFor = (f: any) =>
  subdomain.value
    ? `https://${subdomain.value}.erranders.org/waitlist/${f.slug}`
    : `/waitlist/${f.slug} (set a subdomain to get a link)`;

const load = async () => {
  loading.value = true;
  try {
    if (!profile.value) await fetchProfile();
    const res = await api.get('/waitlist');
    forms.value = res.data || [];
  } catch {
    showToast({ title: 'Error', message: 'Could not load your forms', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const createForm = async () => {
  creating.value = true;
  try {
    const res = await api.post('/waitlist', { title: 'Join our waitlist' });
    forms.value.unshift(res.data);
    showToast({ title: 'Created', message: 'Add questions, then publish it.', toastType: 'success' } as any);
  } catch (e: any) {
    showToast({ title: 'Could not create', message: e?.response?.data?.message || 'Try again', toastType: 'error' } as any);
  } finally {
    creating.value = false;
  }
};

const togglePublish = async (f: any) => {
  try {
    const res = await api.patch(`/waitlist/${f._id}`, { isPublished: !f.isPublished });
    Object.assign(f, res.data);
    showToast({
      title: f.isPublished ? 'Published' : 'Unpublished',
      message: f.isPublished ? 'The link now works.' : 'The link now returns not found.',
      toastType: 'success',
    } as any);
  } catch {
    showToast({ title: 'Error', message: 'Could not update', toastType: 'error' } as any);
  }
};

const copyLink = async (f: any) => {
  const link = linkFor(f);
  try {
    await navigator.clipboard.writeText(link);
    showToast({ title: 'Copied', message: 'Share it with your customers.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Link', message: link, toastType: 'info' } as any);
  }
};

const openResponses = async (f: any) => {
  activeForm.value = f;
  responses.value = [];
  try {
    const res = await api.get(`/waitlist/${f._id}/responses`);
    responses.value = res.data || [];
  } catch {
    responses.value = [];
  }
};

const timeAgo = (stamp?: string) => {
  if (!stamp) return '';
  const m = Math.floor((Date.now() - new Date(stamp).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

onMounted(load);
</script>
