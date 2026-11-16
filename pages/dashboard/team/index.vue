<template>
  <div class="team-page">
    <header class="page-head">
      <div>
        <h1>Team</h1>
        <p class="lede">
          People who take your service jobs. When a job is marked complete, their share goes straight to
          their wallet and the rest stays with the shop.
        </p>
      </div>
      <button type="button" class="btn-primary" @click="openInvite">
        <UserPlus class="w-4 h-4" aria-hidden="true" />
        Add someone
      </button>
    </header>

    <!-- Not a service provider: say so plainly rather than showing an empty list. -->
    <div v-if="notService" class="notice">
      <p class="notice-title">Team members are for service providers</p>
      <p class="notice-body">
        Your shop sells products, so there are no service jobs to assign. If that is wrong, change your
        business type in Settings.
      </p>
    </div>

    <template v-else>
      <!-- Invite form -->
      <form v-if="inviteOpen" class="card invite" @submit.prevent="submitInvite">
        <h2 class="card-title">Add a team member</h2>

        <div class="grid">
          <label class="field">
            <span class="label">Name</span>
            <input v-model="form.name" required type="text" placeholder="Chidi Okeke" />
          </label>

          <label class="field">
            <span class="label">Email</span>
            <input v-model="form.email" required type="email" placeholder="chidi@example.com" />
          </label>

          <label class="field">
            <span class="label">Phone for WhatsApp</span>
            <input v-model="form.phone" type="tel" placeholder="0803 000 0000" />
          </label>

          <div class="field">
            <UiSelectInput
              v-model="form.role"
              label="Role"
              :options="roleOptions"
              class="w-full"
            />
          </div>

          <div class="field field-wide">
            <span class="label">How they are paid</span>

            <div class="pay-mode">
              <button type="button" :class="{ on: form.payoutType === 'percent' }" @click="form.payoutType = 'percent'">
                Share of each job
              </button>
              <button type="button" :class="{ on: form.payoutType === 'fixed' }" @click="form.payoutType = 'fixed'">
                Fixed fee per job
              </button>
            </div>

            <div v-if="form.payoutType === 'percent'" class="share-row">
              <input v-model.number="form.payoutSharePercent" type="range" min="0" max="100" step="5" />
              <span class="share-value">{{ form.payoutSharePercent }}%</span>
            </div>

            <div v-else class="naira-input">
              <span>₦</span>
              <input v-model.number="form.payoutFixedAmount" type="number" min="0" step="500" placeholder="3000" />
            </div>

            <span class="hint">{{ payPreview }}</span>
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="actions">
          <button type="button" class="btn-quiet" @click="inviteOpen = false">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Adding…' : 'Send invite' }}
          </button>
        </div>
      </form>

      <!-- Invite code, shown once so the shop can pass it on. -->
      <div v-if="lastInvite" class="card code-card">
        <p class="code-label">Invite code for {{ lastInvite.email }}</p>
        <p class="code">{{ lastInvite.inviteCode }}</p>
        <p class="code-hint">They accept it from their own account. It expires in 14 days.</p>

        <!-- What actually reached them, so nobody assumes an invite was delivered when it was not. -->
        <div class="sent">
          <span class="sent-pill" :class="lastInvite.inviteDelivery?.email ? 'ok' : 'bad'">
            {{ lastInvite.inviteDelivery?.email ? 'Email sent' : 'Email failed' }}
          </span>
          <span class="sent-pill" :class="lastInvite.inviteDelivery?.whatsapp ? 'ok' : 'bad'">
            {{ lastInvite.inviteDelivery?.whatsapp ? 'WhatsApp sent' : 'WhatsApp not sent' }}
          </span>
          <span v-if="lastInvite.inviteDelivery?.whatsappReason" class="sent-note">
            {{ lastInvite.inviteDelivery.whatsappReason }}
          </span>
        </div>
      </div>

      <!-- Members -->
      <div v-if="loading" class="empty">Loading your team…</div>

      <div v-else-if="members.length === 0" class="empty">
        <Users class="w-5 h-5" aria-hidden="true" />
        <p>Nobody on the team yet. Add the first person and assign them a job from Appointments.</p>
      </div>

      <ul v-else class="list">
        <li v-for="m in members" :key="m._id" class="card member">
          <div class="member-main">
            <div class="avatar" aria-hidden="true">{{ initials(m.name) }}</div>
            <div class="member-text">
              <p class="member-name">
                {{ m.name }}
                <span class="role" :class="m.role">{{ m.role === 'manager' ? 'Manager' : 'Member' }}</span>
              </p>
              <p class="member-meta">{{ m.email }} · {{ m.jobsCompleted || 0 }} jobs</p>
            </div>
          </div>

          <div class="member-side">
            <div class="pay">
              <span class="pay-label">{{ m.payoutType === 'fixed' ? 'Per job' : 'Share' }}</span>
              <span class="pay-value">
                {{ m.payoutType === 'fixed' ? '₦' + Number(m.payoutFixedAmount || 0).toLocaleString() : m.payoutSharePercent + '%' }}
              </span>
            </div>

            <span class="status" :class="m.status">{{ m.status }}</span>

            <!-- Whether their pay has somewhere to land. -->
            <button
              v-if="m.status === 'active' && !m.payoutReady"
              type="button"
              class="payout remind"
              :disabled="reminding === m._id"
              @click="remind(m)"
            >
              {{ reminding === m._id ? 'Sending…' : 'Needs bank details. Remind' }}
            </button>
            <span v-else-if="m.status === 'active'" class="payout ready">Bank added</span>

            <button type="button" class="icon-btn" :aria-label="`Remove ${m.name}`" @click="remove(m)">
              <Trash2 class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </li>
      </ul>

      <p v-if="reminderResult" class="reminder-note">{{ reminderResult }}</p>
    </template>
    <UiConfirmModal
      :is-open="confirmOpen"
      title="Remove from your team?"
      :message="pendingRemove ? `${pendingRemove.name} will no longer be offered jobs. Their earnings stay in their wallet.` : ''"
      confirm-text="Remove"
      variant="danger"
      @cancel="confirmOpen = false; pendingRemove = null"
      @confirm="confirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { UserPlus, Users, Trash2 } from 'lucide-vue-next';
import { team_api } from '@/api_factory/modules/team';
import { useVendorProfile } from '@/composables/modules/vendors';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Team - Errandr Vendor' });

const { profile, fetchProfile } = useVendorProfile();

const members = ref<any[]>([]);
const loading = ref(true);
const notService = ref(false);
const inviteOpen = ref(false);
const saving = ref(false);
const error = ref('');
const lastInvite = ref<any>(null);

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: 'member' as 'member' | 'manager',
  payoutType: 'percent' as 'percent' | 'fixed',
  payoutSharePercent: 60,
  payoutFixedAmount: 3000,
});

/**
 * What the arrangement means on a real job, in naira.
 *
 * ₦20,000 is used as the sample because it is close to a deep clean or a move, the jobs a shop would
 * hand to someone else.
 */
const payPreview = computed(() => {
  const sample = 20000;
  if (form.value.payoutType === 'fixed') {
    const fee = Math.min(Number(form.value.payoutFixedAmount) || 0, sample);
    return `₦${fee.toLocaleString()} for every job, whatever it sells for.`;
  }
  return `Of ₦${sample.toLocaleString()} they get ₦${((sample * form.value.payoutSharePercent) / 100).toLocaleString()}.`;
});

const initials = (name: string) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const load = async () => {
  loading.value = true;
  try {
    const res = await team_api.list();
    members.value = res?.data || [];
  } catch (e: any) {
    if (e?.response?.status === 403) notService.value = true;
    else error.value = e?.response?.data?.message || 'Could not load your team';
  } finally {
    loading.value = false;
  }
};

const openInvite = () => {
  inviteOpen.value = true;
  lastInvite.value = null;
  error.value = '';
};

const submitInvite = async () => {
  saving.value = true;
  error.value = '';
  try {
    const res = await team_api.invite({ ...form.value });
    lastInvite.value = res?.data;
    inviteOpen.value = false;
    form.value = { name: '', email: '', phone: '', role: 'member', payoutType: 'percent', payoutSharePercent: 60, payoutFixedAmount: 3000 };
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Could not add that person';
  } finally {
    saving.value = false;
  }
};

const reminding = ref('');
const reminderResult = ref('');

/** Ask them to add a payout account, rather than leaving the shop to chase it. */
const remind = async (m: any) => {
  reminding.value = m._id;
  reminderResult.value = '';
  try {
    const res: any = await team_api.remindBank(m._id);
    const d = res?.data || {};
    reminderResult.value = d.emailed
      ? `Reminder sent to ${m.name}.`
      : `We could not email ${m.name}. Send them this page: erranders.org/dashboard/my-jobs`;
  } catch (e: any) {
    reminderResult.value = e?.response?.data?.message || 'Could not send the reminder';
  } finally {
    reminding.value = '';
  }
};

const confirmOpen = ref(false);
const pendingRemove = ref<any>(null);

const roleOptions = [
  { label: 'Member', value: 'member' },
  { label: 'Manager', value: 'manager' },
];

const remove = (m: any) => {
  pendingRemove.value = m;
  confirmOpen.value = true;
};

const confirmRemove = async () => {
  const m = pendingRemove.value;
  confirmOpen.value = false;
  pendingRemove.value = null;
  if (!m) return;
  try {
    await team_api.remove(m._id);
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Could not remove them';
  }
};

onMounted(async () => {
  if (!profile.value) await fetchProfile();
  if (profile.value && profile.value.businessType !== 'service_provider') {
    notService.value = true;
    loading.value = false;
    return;
  }
  await load();
});
</script>

<style scoped>
/*
 * Explicit colours: this app has Tailwind's parentPrimary palette, not the student app's theme tokens,
 * so var(--accent) and var(--line) resolved to nothing and every border and button disappeared.
 */
.team-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 20px 72px;
  color: #14110d;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

h1 {
  margin: 0;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.lede {
  margin: 7px 0 0;
  max-width: 54ch;
  font-size: 15px;
  line-height: 1.5;
  color: #6d675f;
}

.card {
  border: 1px solid #e7e2da;
  border-radius: 16px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(20, 17, 13, 0.04);
}

.invite {
  margin-bottom: 18px;
}

.card-title {
  margin: 0 0 16px;
  font-size: 16.5px;
  font-weight: 750;
  color: #14110d;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 620px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-wide {
  grid-column: 1 / -1;
}

.label {
  font-size: 13.5px;
  font-weight: 700;
  color: #14110d;
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='number'],
select {
  width: 100%;
  padding: 11px 12px;
  border-radius: 11px;
  border: 1px solid #d9d3c9;
  background: #fff;
  color: #14110d;
  font-size: 15px;
  outline: none;
}

input::placeholder {
  color: #948d84;
}

input:focus,
select:focus {
  border-color: #ff5c1a;
  box-shadow: 0 0 0 3px rgba(255, 92, 26, 0.14);
}

/* How they are paid: a share, or a flat fee. */
.pay-mode {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.pay-mode button {
  flex: 1;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid #d9d3c9;
  background: #fff;
  color: #14110d;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.pay-mode button.on {
  background: #ff5c1a;
  border-color: #ff5c1a;
  color: #fff;
}

.share-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.share-row input[type='range'] {
  flex: 1;
  accent-color: #ff5c1a;
}

.share-value {
  font-size: 15px;
  font-weight: 800;
  color: #ff5c1a;
  min-width: 46px;
}

.naira-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 11px;
  border: 1px solid #d9d3c9;
  background: #fff;
}

.naira-input span {
  font-size: 15px;
  font-weight: 700;
  color: #6d675f;
}

.naira-input input {
  border: 0;
  padding: 11px 0;
}

.naira-input:focus-within {
  border-color: #ff5c1a;
  box-shadow: 0 0 0 3px rgba(255, 92, 26, 0.14);
}

.hint {
  font-size: 13px;
  color: #6d675f;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 12px 18px;
  border: 0;
  border-radius: 11px;
  background: #ff5c1a;
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
}

.btn-primary:hover {
  background: #ea580c;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-quiet {
  padding: 12px 18px;
  border-radius: 11px;
  border: 1px solid #d9d3c9;
  background: #fff;
  color: #14110d;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.code-card {
  margin-bottom: 18px;
  border-color: #ff5c1a;
  background: #fff7ed;
}

.code-label {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #9a3412;
}

.code {
  margin: 6px 0 4px;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #ff5c1a;
}

.sent {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.sent-pill {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 750;
}

.sent-pill.ok {
  background: #dcfce7;
  color: #15803d;
}

.sent-pill.bad {
  background: #fef2f2;
  color: #b91c1c;
}

.sent-note {
  font-size: 12.5px;
  color: #9a3412;
}

.code-hint {
  margin: 0;
  font-size: 13.5px;
  color: #9a3412;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 46px 20px;
  border: 1px dashed #d9d3c9;
  border-radius: 16px;
  color: #6d675f;
  text-align: center;
  font-size: 15px;
  background: #fff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.member {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.member-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fff7ed;
  color: #ff5c1a;
  font-size: 15px;
  font-weight: 800;
  flex: none;
}

.member-name {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #14110d;
}

.role {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 750;
  background: #f6f3ee;
  color: #6d675f;
  border: 1px solid #e7e2da;
}

.role.manager {
  background: #fff7ed;
  color: #ea580c;
  border-color: #fed7aa;
}

.member-meta {
  margin: 3px 0 0;
  font-size: 13.5px;
  color: #6d675f;
}

.member-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pay {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pay-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #948d84;
}

.pay-value {
  font-size: 15px;
  font-weight: 800;
  color: #14110d;
}

.status {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 750;
  text-transform: capitalize;
  background: #f6f3ee;
  border: 1px solid #e7e2da;
  color: #6d675f;
}

.status.active {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.payout {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.payout.remind {
  cursor: pointer;
  font-family: inherit;
}

.payout.remind:hover {
  background: #fecaca;
}

.reminder-note {
  margin: 14px 0 0;
  font-size: 14px;
  font-weight: 650;
  color: #9a3412;
}

.payout.ready {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.status.invited {
  background: #fff7ed;
  color: #9a3412;
  border-color: #fed7aa;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e7e2da;
  background: #fff;
  color: #6d675f;
  cursor: pointer;
}

.icon-btn:hover {
  border-color: #fca5a5;
  color: #b91c1c;
}

.error {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 650;
  color: #b91c1c;
}

.notice {
  padding: 20px;
  border: 1px solid #e7e2da;
  border-radius: 16px;
  background: #fff;
}

.notice-title {
  margin: 0;
  font-size: 16.5px;
  font-weight: 750;
  color: #14110d;
}

.notice-body {
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: #6d675f;
}
</style>