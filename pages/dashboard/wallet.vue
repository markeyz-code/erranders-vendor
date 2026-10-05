<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12 mt-4">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Your Wallet</h1>
        <p class="text-sm text-gray-500">Monitor your revenue, check your earnings, and manage bank accounts.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showStatementModal = true" class="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-25 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Statement
        </button>
        <button 
          v-if="balance > 0" 
          @click="showWithdrawModal = true" 
          class="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          Request Payout
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loadingWallet" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-lg p-6 animate-pulse h-32" />
    </div>

    <div v-else class="space-y-6 animate-fade-in">
      <!-- Balance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Available Balance -->
        <div class="p-5 rounded-lg bg-white border border-gray-25">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Available for Withdrawal</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 flex items-center">
            <span class="text-xl font-medium text-gray-400 mr-1">₦</span>{{ balance?.toLocaleString() || '0' }}
          </p>
          <div class="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p class="text-[10px] font-semibold text-emerald-600 uppercase">Current Balance</p>
          </div>
        </div>

        <!-- Lifetime Earnings -->
        <div class="p-5 rounded-lg bg-white border border-gray-25">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Earned</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 flex items-center">
            <span class="text-xl font-medium text-gray-400 mr-1">₦</span>{{ wallet?.totalEarned?.toLocaleString() || '0' }}
          </p>
          <div class="flex items-center gap-1 mt-3 text-emerald-500">
            <TrendingUp class="w-3.5 h-3.5" />
            <p class="text-xs font-semibold">+12.5% Monthly Growth</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Payout Settings -->
        <section class="bg-white p-5 rounded-lg border border-gray-25">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <SettingsIcon class="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">Payout Settings</h3>
              <p class="text-xs text-gray-500">Configure your payout frequency and bank account.</p>
            </div>
          </div>
          
          <div class="space-y-5">
            <div class="space-y-3">
              <div class="p-4 rounded-lg bg-gray-50 border border-gray-25">
                <p class="text-xs text-gray-500">{{ wallet?.bankDetails?.bankName || 'No Bank Linked' }}</p>
                <p class="text-base font-semibold text-gray-900 font-mono mt-1">{{ wallet?.bankDetails?.accountNumber || '•••• •••• ••••' }}</p>
                <p class="text-xs font-medium text-gray-600 mt-1 flex items-center gap-1">
                  {{ wallet?.bankDetails?.accountName || 'Not configured' }}
                  <ShieldCheck v-if="wallet?.bankDetails?.accountNumber" class="w-3 h-3 text-emerald-500 ml-1" />
                </p>
              </div>
              <NuxtLink to="/dashboard/settings" class="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-25 transition-colors block text-center">
                Update Bank Details
              </NuxtLink>
            </div>
            
            <div class="flex items-center justify-between py-3 border-t border-gray-100">
              <span class="text-xs font-medium text-gray-500">Payout Cycle</span>
              <span class="text-xs font-semibold text-gray-900 capitalize">{{ wallet?.payoutPreference || 'Manual' }}</span>
            </div>
          </div>
        </section>
        
        <!-- Instant Virtual Account -->
        <section v-if="wallet?.virtualAccount" class="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-lg border border-emerald-100 relative overflow-hidden flex flex-col justify-between">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/40 rounded-full blur-2xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-emerald-100 shadow-sm">
                <Building2 class="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">Virtual Account</h3>
                <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Instant Funding</p>
              </div>
            </div>
            
            <div class="space-y-1 bg-white/60 p-4 rounded-lg border border-emerald-100/50 backdrop-blur-sm">
              <p class="text-xs font-medium text-gray-500">{{ wallet.virtualAccount.bankName }}</p>
              <p class="text-2xl font-bold tracking-tight text-gray-900 font-mono">{{ wallet.virtualAccount.accountNumber }}</p>
              <p class="text-xs font-medium text-emerald-700 mt-1">{{ wallet.virtualAccount.accountName }}</p>
            </div>
            <p class="text-[11px] font-medium text-emerald-800 mt-4 leading-relaxed">
              Transfer to this dedicated account number to automatically fund your vendor wallet instantly.
            </p>
          </div>
        </section>
        <section v-else class="bg-gray-50 p-5 rounded-lg border border-gray-25 flex flex-col items-center justify-center text-center">
           <Building2 class="w-8 h-8 text-gray-300 mb-3" />
           <p class="text-sm font-semibold text-gray-900">No Virtual Account</p>
           <p class="text-xs text-gray-500 mt-1 max-w-[200px]">Complete your verification to get a dedicated funding account.</p>
        </section>
      </div>

      <!-- Ledger -->
      <section class="bg-white rounded-lg border border-gray-25 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-gray-900 text-sm">Ledger History</h3>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-semibold">{{ filteredTransactions.length }}</span>
            </div>
            
            <!-- Filters -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="w-32 relative">
                <UiSelectInput v-model="filterType" :options="[{label: 'All Types', value: 'all'}, {label: 'Credits Only', value: 'credit'}, {label: 'Debits Only', value: 'debit'}]" class="w-full h-8 !min-h-[32px] text-xs !px-2 rounded-lg bg-white focus:ring-1 focus:ring-gray-300" />
              </div>
              <div class="w-32">
                <UiDatePicker v-model="filterDateFrom" placeholder="From" />
              </div>
              <div class="w-32">
                <UiDatePicker v-model="filterDateTo" placeholder="To" />
              </div>
              <button v-if="filterType !== 'all' || filterDateFrom || filterDateTo" @click="clearFilters" class="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
                Clear
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <div v-if="loadingTransactions" class="py-16 flex items-center justify-center">
            <Loader2 class="w-6 h-6 text-gray-300 animate-spin" />
          </div>
          <div v-else-if="filteredTransactions.length === 0" class="py-16 flex flex-col items-center justify-center text-center px-4">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span class="text-2xl opacity-50">🍃</span>
            </div>
            <h4 class="text-sm font-bold text-gray-900 mb-1">{{ transactions.length === 0 ? 'No transactions yet' : 'No matching transactions' }}</h4>
            <p class="text-gray-400 text-xs max-w-sm">{{ transactions.length === 0 ? 'Start selling to see your history.' : 'Try adjusting the filters above.' }}</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide">Description</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Amount</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Date</th>
                  <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'" class="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        <svg v-if="tx.type === 'credit'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
                        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </div>
                      <div>
                        <p class="text-xs text-gray-900 font-semibold">{{ tx.description }}</p>
                        <p v-if="tx.order" class="text-[10px] text-gray-400 font-mono mt-0.5">REF: SEC-{{ tx._id?.slice(-8).toUpperCase() }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'" class="text-xs font-bold font-mono">
                      {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount.toLocaleString() }}
                    </p>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <p class="text-xs text-gray-700 font-medium">{{ formatDate(tx.createdAt) }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ formatTime(tx.createdAt) }}</p>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button @click="downloadReceipt(tx._id)" class="px-2.5 py-1 rounded text-[10px] font-semibold text-gray-500 hover:text-[#FF5C1A] hover:bg-orange-50 transition-colors inline-flex items-center gap-1 border border-gray-200 hover:border-[#FF5C1A]/20">
                      <Download class="w-3 h-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <!-- Payout Request Drawer -->
    <SideDrawer 
      :isOpen="showWithdrawModal" 
      title="Request Payout"
      subtitle="Transfer your earnings to your verified active account."
      @close="showWithdrawModal = false"
    >
      <div class="space-y-6 py-6">
        <div class="p-6 bg-white rounded-lg border border-gray-50 text-center space-y-4">
          <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto text-gray-600">
            <Banknote class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 mb-1">Available Balance</p>
            <p class="text-3xl font-bold text-gray-900">₦{{ balance?.toLocaleString() }}</p>
          </div>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Withdrawal Amount (₦)</label>
            <input 
              v-model="formattedWithdrawAmount" 
              type="text" 
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300" 
              placeholder="0.00"
            />
            <p class="text-[10px] text-gray-500 mt-1">Enter how much you want to transfer.</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Select Bank Account</label>
            <UiSelectInput 
              v-model="selectedBankAccount" 
              :options="availableBankAccounts.map(acc => ({ label: `${acc.bankName} - ${maskAccountNumber(acc.accountNumber)} (${acc.purpose || 'Default'})`, value: acc }))" 
              class="w-full" 
            />
          </div>
          
          <div class="flex items-center justify-between p-3 bg-gray-50 border border-gray-50 rounded-lg">
            <div>
              <h3 class="text-xs font-semibold text-gray-900">Instant Payout (1% Fee)</h3>
              <p class="text-[10px] text-gray-500 mt-0.5">Get your money immediately.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isInstantWithdrawal" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
          <div v-if="isInstantWithdrawal && withdrawAmount > 0" class="text-xs font-medium text-emerald-600 flex justify-between px-1">
            <span>You will receive:</span>
            <span>₦{{ (withdrawAmount * 0.99).toLocaleString('en-US') }}</span>
          </div>
        
          <div class="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
            <AlertCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p class="text-xs text-amber-700 font-medium leading-relaxed">
              Ensure your bank details are correct to avoid delays in payout processing.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center gap-3 w-full">
          <button @click="showWithdrawModal = false" class="flex-1 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors">Cancel</button>
          <button 
            @click="handleWithdraw" 
            :disabled="withdrawAmount <= 0 || withdrawAmount > (balance || 0)" 
            class="flex-[2] py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Authorize Payout
          </button>
        </div>
      </template>
    </SideDrawer>
    
    <!-- Statement Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showStatementModal" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" @click.self="showStatementModal = false">
          <div class="bg-white rounded-lg w-full max-w-md p-6 space-y-5">
            <div>
              <h3 class="text-base font-bold text-gray-900">Generate Statement</h3>
              <p class="text-xs text-gray-500 mt-1">Select a date range to download your earnings statement as CSV.</p>
            </div>
            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium text-gray-500 mb-1 block">From</label>
                <UiDatePicker v-model="statementFrom" class="w-full" />
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 mb-1 block">To</label>
                <UiDatePicker v-model="statementTo" class="w-full" />
              </div>
            </div>
            <div class="flex gap-3">
              <button @click="showStatementModal = false" class="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
              <button @click="generateStatement" :disabled="!statementFrom || !statementTo" class="flex-1 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40">Download CSV</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { CreditCard, TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownLeft, Settings as SettingsIcon, Banknote, HelpCircle, X, Building2, AlertCircle, Store, Loader2, Download } from 'lucide-vue-next';
import { useWallet } from '@/composables/modules/wallets';
import { useCustomToast } from '@/composables/core/useCustomToast';
import SideDrawer from '@/components/ui/SideDrawer.vue';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Financial Hub - Errander Vendor' });

const { balance, wallet, transactions, loading: loadingWallet, fetchWallet, fetchTransactions, withdrawFunds, downloadReceipt } = useWallet();
const { showToast } = useCustomToast();

const loadingTransactions = ref(true);
const showWithdrawModal = ref(false);
const withdrawAmount = ref(0);
const selectedBankAccount = ref<any>('');
const isInstantWithdrawal = ref(false);

const filterType = ref('all');
const filterDateFrom = ref('');
const filterDateTo = ref('');
const showStatementModal = ref(false);
const statementFrom = ref('');
const statementTo = ref('');

const filteredTransactions = computed(() => {
  let result = transactions.value || [];
  if (filterType.value !== 'all') {
    result = result.filter((t: any) => t.type === filterType.value);
  }
  if (filterDateFrom.value) {
    const from = new Date(filterDateFrom.value).getTime();
    result = result.filter((t: any) => new Date(t.createdAt).getTime() >= from);
  }
  if (filterDateTo.value) {
    const to = new Date(filterDateTo.value).getTime();
    result = result.filter((t: any) => new Date(t.createdAt).getTime() <= to + 86400000);
  }
  return result;
});

const clearFilters = () => {
  filterType.value = 'all';
  filterDateFrom.value = '';
  filterDateTo.value = '';
};

const generateStatement = () => {
  if (!statementFrom.value || !statementTo.value) return;
  const from = new Date(statementFrom.value).getTime();
  const to = new Date(statementTo.value).getTime() + 86400000;
  
  const toDownload = (transactions.value || []).filter((t: any) => {
    const time = new Date(t.createdAt).getTime();
    return time >= from && time <= to;
  });
  
  let csv = 'Date,Description,Type,Amount\n';
  toDownload.forEach((t: any) => {
    csv += `${new Date(t.createdAt).toLocaleDateString()},"${t.description}",${t.type},${t.amount}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `statement_${statementFrom.value}_to_${statementTo.value}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showStatementModal.value = false;
};

const availableBankAccounts = computed(() => {
  if (wallet.value?.bankAccounts?.length > 0) return wallet.value.bankAccounts;
  if (wallet.value?.metadata?.payoutAccounts?.length > 0) return wallet.value.metadata.payoutAccounts;
  if (wallet.value?.bankDetails?.accountNumber) return [wallet.value.bankDetails];
  return [];
});

watch(showWithdrawModal, (val) => {
  if (val && availableBankAccounts.value.length > 0 && !selectedBankAccount.value) {
    const primary = availableBankAccounts.value.find((a: any) => a.isActive || a.isPrimary);
    selectedBankAccount.value = primary || availableBankAccounts.value[0];
  }
});
const formattedWithdrawAmount = computed({
  get() {
    if (withdrawAmount.value === 0 || withdrawAmount.value === null || withdrawAmount.value === undefined) return '';
    return withdrawAmount.value.toLocaleString('en-US');
  },
  set(val) {
    const clean = val.toString().replace(/[^0-9.]/g, '');
    withdrawAmount.value = clean ? Number(clean) : 0;
  }
});

const maskAccountNumber = (num: string) => `•••• •••• ${num.slice(-2)}`;

const formatDate = (date: string) => {
 return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (date: string) => {
 return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleWithdraw = async () => {
 if (withdrawAmount.value <= 0 || withdrawAmount.value > balance.value) {
 showToast({ title: 'Invalid Amount', message: 'Please enter a valid amount within your balance.', toastType: 'error' });
 return;
 }
  if (!selectedBankAccount.value) {
    showToast({ title: 'Select Account', message: 'Please select a bank account to withdraw to.', toastType: 'error' });
    return;
  }
  
  try {
  await withdrawFunds(withdrawAmount.value, selectedBankAccount.value, isInstantWithdrawal.value);
 showWithdrawModal.value = false;
 showToast({ title: 'Payout Requested', message: `₦${withdrawAmount.value} is being processed.`, toastType: 'success' });
 } catch (err) {
 showToast({ title: 'Request Failed', message: 'Could not process payout request.', toastType: 'error' });
 }
};

onMounted(async () => {
 loadingTransactions.value = true;
 await Promise.all([fetchWallet(), fetchTransactions()]);
 loadingTransactions.value = false;
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
