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
            <span class="label">Phone (optional)</span>
            <input v-model="form.phone" type="tel" placeholder="0803 000 0000" />
          </label>

          <label class="field">
            <span class="label">Role</span>
            <select v-model="form.role">
              <option value="member">Member</option>
              <option value="manager">Manager</option>
            </select>
          </label>

          <label class="field">
            <span class="label">Their share of each job</span>
            <div class="share-row">
              <input v-model.number="form.payoutSharePercent" type="range" min="0" max="100" step="5" />
              <span class="share-value">{{ form.payoutSharePercent }}%</span>
            </div>
            <span class="hint">
              Of ₦20,000 they get ₦{{ ((20000 * form.payoutSharePercent) / 100).toLocaleString() }}.
            </span>
          </label>
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
            <div class="share">
              <span class="share-label">Share</span>
              <span class="share-value">{{ m.payoutSharePercent }}%</span>
            </div>

            <span class="status" :class="m.status">{{ m.status }}</span>

            <button type="button" class="icon-btn" :aria-label="`Remove ${m.name}`" @click="remove(m)">
              <Trash2 class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  payoutSharePercent: 60,
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
    form.value = { name: '', email: '', phone: '', role: 'member', payoutSharePercent: 60 };
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Could not add that person';
  } finally {
    saving.value = false;
  }
};

const remove = async (m: any) => {
  if (!confirm(`Remove ${m.name} from your team?`)) return;
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
.team-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 28px 20px 64px;
  color: var(--ink);
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
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lede {
  margin: 6px 0 0;
  max-width: 52ch;
  font-size: 15px;
  line-height: 1.5;
  color: var(--mute);
}

.card {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
  padding: 18px;
}

.invite {
  margin-bottom: 18px;
}

.card-title {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 750;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
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

.label {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--mute);
}

input[type='text'],
input[type='email'],
input[type='tel'],
select {
  width: 100%;
  padding: 11px 12px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--page);
  color: var(--ink);
  font-size: 15px;
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--accent);
}

.share-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.share-row input[type='range'] {
  flex: 1;
  accent-color: var(--accent);
}

.share-value {
  font-size: 15px;
  font-weight: 800;
  color: var(--accent);
  min-width: 46px;
}

.hint {
  font-size: 13px;
  color: var(--mute);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 16px;
  border: 0;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-quiet {
  padding: 11px 16px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.code-card {
  margin-bottom: 18px;
  border-color: var(--accent);
}

.code-label {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--mute);
}

.code {
  margin: 6px 0 4px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.code-hint {
  margin: 0;
  font-size: 13.5px;
  color: var(--mute);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 44px 20px;
  border: 1px dashed var(--line);
  border-radius: 16px;
  color: var(--mute);
  text-align: center;
  font-size: 15px;
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
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--orsoft);
  color: var(--accent);
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
}

.role {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 750;
  background: var(--page);
  color: var(--mute);
  border: 1px solid var(--line);
}

.role.manager {
  background: var(--orsoft);
  color: var(--accent);
  border-color: transparent;
}

.member-meta {
  margin: 2px 0 0;
  font-size: 13.5px;
  color: var(--mute);
}

.member-side {
  display: flex;
  align-items: center;
  gap: 12px;
}

.share {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.share-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--mute);
}

.status {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 750;
  text-transform: capitalize;
  background: var(--page);
  border: 1px solid var(--line);
  color: var(--mute);
}

.status.active {
  background: var(--green-soft);
  color: #0f6b3d;
  border-color: transparent;
}

.status.invited {
  background: var(--orsoft);
  color: #b3400b;
  border-color: transparent;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--mute);
  cursor: pointer;
}

.icon-btn:hover {
  border-color: #b91c1c;
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
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
}

.notice-title {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
}

.notice-body {
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--mute);
}
</style>
