<template>
  <div class="min-h-screen bg-slate-50/70 pb-20">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
          <button class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50" @click="router.push('/dashboard/waitlist')">← Back</button>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Responses</p>
            <h1 class="truncate text-base font-black text-slate-900">{{ form?.title || 'Waitlist' }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{{ responses.length }} total</span>
          <div class="flex overflow-hidden rounded-lg border border-slate-200">
            <button class="px-3 py-1.5 text-[11px] font-bold" :class="view === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" @click="view = 'table'">Table</button>
            <button class="px-3 py-1.5 text-[11px] font-bold" :class="view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" @click="view = 'grid'">Grid</button>
          </div>
        </div>
      </div>
    </header>

    <div class="px-4 py-4 sm:px-6">
      <div v-if="loading" class="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400">Loading…</div>

      <div v-else-if="!responses.length" class="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p class="text-sm font-bold text-slate-900">No responses yet</p>
        <p class="mt-1 text-xs text-slate-500">Share the link and they will appear here.</p>
      </div>

      <!-- Table: fixed layout, so one long question cannot elbow the rest off the row. -->
      <div v-else-if="view === 'table'" class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
        <div class="overflow-x-auto">
          <table class="w-full table-fixed text-left text-xs">
            <colgroup>
              <col class="w-[16%]" />
              <col v-for="col in columns" :key="'c-' + col.key" class="w-[13%]" />
              <col class="w-[9%]" />
              <col class="w-[8%]" />
              <col class="w-[16%]" />
            </colgroup>
            <thead class="border-b border-slate-100 bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Name</th>
                <th v-for="col in columns" :key="'h-' + col.key"
                  class="truncate px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500"
                  :title="col.label">
                  {{ col.label }}
                </th>
                <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">When</th>
                <th class="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in responses" :key="r._id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1E8] text-[11px] font-black text-[#B3400B]">
                      {{ initials(r) }}
                    </span>
                    <span class="truncate font-bold text-slate-900" :title="pick(r, ['name','fullName','yourName'])">
                      {{ pick(r, ['name','fullName','yourName']) || '—' }}
                    </span>
                  </div>
                </td>
                <td v-for="col in columns" :key="'v-' + col.key" class="truncate px-3 py-3 text-slate-700" :title="cell(r, col)">
                  {{ cell(r, col) }}
                </td>
                <td class="px-3 py-3">
                  <button class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(r.status)" @click="openDetail(r)">
                    {{ r.status }}
                  </button>
                </td>
                <td class="whitespace-nowrap px-3 py-3 text-slate-500">{{ timeAgo(r.createdAt) }}</td>
                <td class="relative px-4 py-3">
                  <div class="flex justify-end">
                    <button class="rounded-md border border-slate-200 px-2 py-1 text-[13px] font-bold leading-none text-slate-600 hover:bg-slate-100"
                      :aria-expanded="menuFor === r._id" @click.stop="menuFor = menuFor === r._id ? '' : r._id">⋯</button>
                  </div>
                  <div v-if="menuFor === r._id" class="absolute right-4 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                    <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-50" @click="closeMenu(); openDetail(r)">View answers</button>
                    <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold text-[#B3400B] hover:bg-orange-50" @click="closeMenu(); openRemind(r)">Send reminder</button>
                    <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50" @click="closeMenu(); askDelete(r)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phones: the same records as cards, since a nine-column table cannot work here. -->
      <div v-if="!loading && responses.length && view === 'table'" class="space-y-3 md:hidden">
        <div v-for="r in responses" :key="'m-' + r._id" class="rounded-xl border border-slate-200 bg-white p-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2.5">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1E8] text-[11px] font-black text-[#B3400B]">{{ initials(r) }}</span>
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-slate-900">{{ pick(r, ['name','fullName','yourName']) || '—' }}</p>
                <p class="truncate text-[11px] text-slate-500">{{ pick(r, ['phone','phoneNumber','whatsapp']) || pick(r, ['email']) || '—' }}</p>
              </div>
            </div>
            <div class="relative flex shrink-0 items-center gap-1.5">
              <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" :class="statusClass(r.status)">{{ r.status }}</span>
              <button class="rounded-md border border-slate-200 px-2 py-1 text-[13px] leading-none text-slate-600" @click.stop="menuFor = menuFor === r._id ? '' : r._id">⋯</button>
              <div v-if="menuFor === r._id" class="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                <button class="flex w-full px-3 py-2 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-50" @click="closeMenu(); openDetail(r)">View answers</button>
                <button class="flex w-full px-3 py-2 text-left text-[11px] font-semibold text-[#B3400B] hover:bg-orange-50" @click="closeMenu(); openRemind(r)">Send reminder</button>
                <button class="flex w-full px-3 py-2 text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50" @click="closeMenu(); askDelete(r)">Delete</button>
              </div>
            </div>
          </div>
          <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            <div v-for="col in columns.slice(0, 4)" :key="'mc-' + col.key" class="min-w-0">
              <p class="truncate text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ col.label }}</p>
              <p class="truncate text-[11px] font-semibold text-slate-800">{{ cell(r, col) }}</p>
            </div>
          </div>
          <p class="mt-2 text-[10px] text-slate-400">{{ timeAgo(r.createdAt) }}</p>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="r in responses" :key="r._id" class="rounded-xl border border-slate-200 bg-white p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-black text-slate-900">{{ pick(r, ['name','fullName','yourName']) || 'Unnamed' }}</p>
              <p class="text-[11px] text-slate-500">{{ pick(r, ['phone','phoneNumber']) || pick(r, ['email']) || '—' }}</p>
            </div>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(r.status)">{{ r.status }}</span>
          </div>
          <p v-if="packageOf(r)" class="mt-2 line-clamp-2 rounded-lg bg-orange-50/60 px-2 py-1.5 text-[11px] font-semibold text-[#B3400B]">{{ packageOf(r) }}</p>
          <p class="mt-2 text-[10px] text-slate-400">{{ timeAgo(r.createdAt) }}</p>
          <div class="mt-3 flex gap-1.5">
            <button class="flex-1 rounded-md border border-slate-200 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50" @click="openDetail(r)">View</button>
            <button class="flex-1 rounded-md bg-[#FF5C1A] py-1.5 text-[10px] font-bold text-white" @click="openRemind(r)">Remind</button>
            <button class="rounded-md border border-rose-200 px-2 py-1.5 text-[10px] font-bold text-rose-600" @click="askDelete(r)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail -->
    <Teleport to="body">
      <div v-if="detail" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4">
        <div class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <div class="flex items-start justify-between">
            <h3 class="text-base font-black text-slate-900">{{ pick(detail, ['name','fullName']) || 'Response' }}</h3>
            <button class="text-slate-400" @click="detail = null">✕</button>
          </div>
          <dl class="mt-3 space-y-2">
            <div v-for="f in form?.fields || []" :key="f.key" class="flex justify-between gap-4 border-b border-slate-50 pb-1.5 text-xs">
              <dt class="text-slate-500">{{ f.label }}</dt>
              <dd class="text-right font-semibold text-slate-800">{{ display(f, detail) }}</dd>
            </div>
          </dl>
          <div class="mt-3">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your note</label>
            <textarea v-model="noteDraft" rows="3" class="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#FF5C1A]" />
          </div>
          <div class="mt-3 flex gap-2">
            <select v-model="statusDraft" class="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="declined">Declined</option>
            </select>
            <button class="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white" @click="saveDetail">Save</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reminder -->
    <Teleport to="body">
      <div v-if="remind" class="fixed inset-0 z-[210] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
        <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Send reminder</p>
              <h3 class="text-base font-black text-slate-900">{{ pick(remind, ['name','fullName']) }}</h3>
            </div>
            <button class="text-slate-400" @click="remind = null">✕</button>
          </div>

          <div class="mt-3 flex overflow-hidden rounded-lg border border-slate-200">
            <button class="flex-1 py-2 text-xs font-bold" :class="channel === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-white text-slate-600'" @click="channel = 'whatsapp'">WhatsApp</button>
            <button class="flex-1 py-2 text-xs font-bold" :class="channel === 'email' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" @click="channel = 'email'">Email</button>
          </div>

          <input v-if="channel === 'email'" v-model="subject" class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF5C1A]" />

          <textarea v-model="message" rows="9" class="mt-3 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 font-mono text-[11px] leading-relaxed outline-none focus:border-[#FF5C1A]" />

          <p class="mt-1 text-[10px] text-slate-400">Edit freely — your name, their answer and the booking link are already filled in.</p>

          <p v-if="remindError" class="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">{{ remindError }}</p>

          <div class="mt-3 flex gap-2">
            <button class="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-700" @click="remind = null">Cancel</button>
            <button class="flex-1 rounded-lg bg-[#FF5C1A] py-2.5 text-xs font-bold text-white disabled:opacity-50" :disabled="sendingRemind" @click="sendRemind">
              {{ sendingRemind ? 'Sending…' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete -->
    <Teleport to="body">
      <div v-if="pendingDelete" class="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/50 p-4">
        <div class="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
          <p class="text-sm font-black text-slate-900">Delete this response?</p>
          <p class="mt-1 text-xs text-slate-500">This cannot be undone.</p>
          <div class="mt-4 flex gap-2">
            <button class="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold" @click="pendingDelete = null">Cancel</button>
            <button class="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useVendorProfile } from '@/composables/modules/vendors';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'vendor' });

const route = useRoute();
const router = useRouter();
const { profile, fetchProfile } = useVendorProfile();
const { showToast } = useCustomToast();

const form = ref<any>(null);
const responses = ref<any[]>([]);
const loading = ref(true);
const view = ref<'table' | 'grid'>('table');

const detail = ref<any>(null);
const noteDraft = ref('');
const statusDraft = ref('new');
const remind = ref<any>(null);
const channel = ref<'whatsapp' | 'email'>('whatsapp');
const subject = ref('');
const message = ref('');
const sendingRemind = ref(false);
const remindError = ref('');
const pendingDelete = ref<any>(null);
const menuFor = ref('');
const closeMenu = () => { menuFor.value = ''; };

const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Answers are keyed by generated field keys (field_f1bf), and the question the vendor wrote lives
 * on the form's field list. Matching on the key alone found nothing, which is why every reminder
 * said "you joined our waitlist recently" instead of naming the package.
 */
const fieldKeyFor = (pattern: RegExp) => {
  const f = (form.value?.fields || []).find((x: any) => pattern.test(String(x.label || '')));
  return f?.key || '';
};

const answerOf = (r: any, pattern: RegExp) => {
  const a = r?.answers || {};
  const key = fieldKeyFor(pattern);
  if (key && a[key] !== undefined) return a[key];
  const byKey = Object.keys(a).find((k) => pattern.test(k));
  return byKey ? a[byKey] : '';
};

const pick = (r: any, names: string[]) => {
  const a = r?.answers || {};
  // Labels first — that is what the vendor actually wrote.
  for (const n of names) {
    const key = fieldKeyFor(new RegExp(n, 'i'));
    if (key && a[key]) return a[key];
  }
  for (const n of names) {
    if (a[n]) return a[n];
  }
  const key = Object.keys(a).find((k) => names.some((n) => norm(k).includes(norm(n))));
  return key ? a[key] : '';
};

/**
 * Table columns taken from the form's own questions — name and status are fixed, the rest is
 * whatever the vendor asked. Long text is left out; it never fits in a cell.
 */
const columns = computed(() => {
  const skip = /name|phone|whatsapp/i;
  return (form.value?.fields || [])
    .filter((f: any) => f.type !== 'textarea' && !skip.test(String(f.label || '')))
    .slice(0, 5)
    .map((f: any) => ({ key: f.key, label: f.label, type: f.type }));
});

const initials = (r: any) => {
  const n = String(pick(r, ['name', 'fullName', 'yourName']) || '').trim();
  if (!n) return '?';
  const parts = n.split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

const cell = (r: any, col: any) => {
  const v = (r?.answers || {})[col.key];
  if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) return '—';
  return Array.isArray(v) ? v.join(', ') : String(v);
};

const packageOf = (r: any) =>
  String(answerOf(r, /package|treatment|service|plan|option|want/i) || '');

/** The details worth repeating back, so the message reads like it knows them. */
const theirDetails = (r: any) => {
  const wanted = /hostel|block|room|level|department|gender|address|area/i;
  return (form.value?.fields || [])
    .filter((f: any) => wanted.test(String(f.label || '')))
    .map((f: any) => {
      const v = (r?.answers || {})[f.key];
      if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) return null;
      return `${f.label}: ${Array.isArray(v) ? v.join(', ') : v}`;
    })
    .filter(Boolean)
    .slice(0, 4) as string[];
};

const display = (f: any, r: any) => {
  const v = (r?.answers || {})[f.key];
  if (Array.isArray(v)) return v.join(', ');
  return String(v ?? '—');
};

const statusClass = (s: string) =>
  s === 'converted' ? 'bg-emerald-50 text-emerald-700'
    : s === 'declined' ? 'bg-rose-50 text-rose-700'
    : s === 'contacted' ? 'bg-blue-50 text-blue-700'
    : 'bg-slate-100 text-slate-600';

const timeAgo = (stamp?: string) => {
  if (!stamp) return '';
  const m = Math.floor((Date.now() - new Date(stamp).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

const load = async () => {
  loading.value = true;
  try {
    if (!profile.value) await fetchProfile();
    const list = await api.get('/waitlist');
    form.value = (list.data || []).find((f: any) => f._id === route.params.id) || null;
    const res = await api.get(`/waitlist/${route.params.id}/responses`);
    responses.value = res.data || [];
  } catch {
    showToast({ title: 'Error', message: 'Could not load responses', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const openDetail = (r: any) => {
  closeMenu();
  detail.value = r;
  noteDraft.value = r.note || '';
  statusDraft.value = r.status || 'new';
};

const saveDetail = async () => {
  try {
    const res = await api.patch(`/waitlist/${route.params.id}/responses/${detail.value._id}`, {
      status: statusDraft.value,
      note: noteDraft.value,
    });
    Object.assign(detail.value, res.data);
    const i = responses.value.findIndex((x) => x._id === detail.value._id);
    if (i > -1) responses.value[i] = { ...responses.value[i], ...res.data };
    detail.value = null;
    showToast({ title: 'Saved', message: 'Response updated.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Error', message: 'Could not save', toastType: 'error' } as any);
  }
};

/** A reminder that names them, their answer and the package they chose. */
const buildMessage = (r: any) => {
  const name = pick(r, ['name', 'fullName', 'yourName']) || 'there';
  const pkg = packageOf(r);
  const details = theirDetails(r);
  const store = profile.value?.storeName || 'us';
  const link = profile.value?.subdomain
    ? `https://${profile.value.subdomain}.erranders.org`
    : 'https://www.erranders.org';

  return [
    `Hi ${name}, this is ${store} on Erranders.`,
    '',
    pkg ? `You joined our waitlist for ${pkg}.` : 'You joined our waitlist recently.',
    ...details,
    '',
    'Slots are open now and we would like to get you booked in.',
    `Book here: ${link}`,
    '',
    'Reply to this message if you need a different time.',
  ].join('\n');
};

const openRemind = (r: any) => {
  closeMenu();
  remind.value = r;
  remindError.value = '';
  subject.value = `Your ${profile.value?.storeName || ''} booking`;
  message.value = buildMessage(r);
  channel.value = pick(r, ['email']) ? 'email' : 'whatsapp';
};

const sendRemind = async () => {
  sendingRemind.value = true;
  remindError.value = '';
  try {
    await api.post(`/waitlist/${route.params.id}/responses/${remind.value._id}/remind`, {
      channel: channel.value,
      subject: subject.value,
      message: message.value,
    });
    remind.value = null;
    await load();
    showToast({ title: 'Sent', message: `Reminder sent by ${channel.value}.`, toastType: 'success' } as any);
  } catch (e: any) {
    remindError.value = e?.response?.data?.message || 'Could not send the reminder.';
  } finally {
    sendingRemind.value = false;
  }
};

const askDelete = (r: any) => {
  pendingDelete.value = r;
};

const doDelete = async () => {
  try {
    await api.delete(`/waitlist/${route.params.id}/responses/${pendingDelete.value._id}`);
    responses.value = responses.value.filter((x) => x._id !== pendingDelete.value._id);
    pendingDelete.value = null;
    showToast({ title: 'Deleted', message: 'Response removed.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Error', message: 'Could not delete', toastType: 'error' } as any);
  }
};

onMounted(load);
</script>
