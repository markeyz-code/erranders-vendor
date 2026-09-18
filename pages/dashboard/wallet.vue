<template>
 <div class="w-full space-y-10 pb-32 px-4 sm:px-8 animate-fade-in">
 <!-- Header Section -->
 <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6">
 <div class="space-y-1">
 <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">Your Wallet</h1>
 <p class="text-sm text-gray-400 font-medium">Monitor your revenue, check your earnings, and manage bank accounts.</p>
 </div>
 
 <div class="flex items-center gap-4">
 <button 
 v-if="balance > 0" 
 @click="showWithdrawModal = true" 
 class="px-8 py-4 bg-gray-900 text-white rounded-md font-medium text-sm hover:bg-black active:scale-95 transition-all flex items-center gap-2"
 >
 <CreditCard class="w-3.5 h-3.5" />
 Withdraw Money
 </button>
 </div>
 </header>

 <div v-if="loadingWallet" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
 <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl p-10 h-64 animate-pulse border border-gray-100" />
 </div>

 <div v-else class="space-y-12">
 <!-- Balance Overview -->
 <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
 <!-- Main Wallet Card -->
 <div class="xl:col-span-8 bg-white p-10 rounded-2xl border border-gray-100 relative overflow-hidden group">
 <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-50/50 rounded-md blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
 
 <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
 <div class="space-y-6">
 <div class="flex items-center gap-3 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md w-fit">
 <div class="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></div>
 <span class="text-sm font-medium">Available for Withdrawal</span>
 </div>
 <div class="flex items-baseline gap-3">
 <span class="text-2xl font-medium text-gray-300">₦</span>
 <h2 class="text-7xl font-medium text-gray-900">{{ balance?.toLocaleString() || '0' }}</h2>
 </div>
 <p class="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
 This is your current balance after commission deductions. Withdrawals are now processed instantly to your bank account.
 </p>
 </div>
 
 <div class="h-px md:w-px md:h-24 bg-gray-100"></div>
 
 <div class="space-y-8">
 <div class="space-y-1">
 <p class="text-sm font-medium text-gray-400">Total Earned</p>
 <p class="text-xl font-medium text-gray-900">₦{{ wallet?.totalEarned?.toLocaleString() || '0' }}</p>
 </div>
 <div class="space-y-1">
 <p class="text-sm font-medium text-gray-400">Monthly Growth</p>
 <div class="flex items-center gap-2 text-emerald-500">
 <TrendingUp class="w-4 h-4" />
 <span class="text-sm font-bold">+12.5%</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Instant Virtual Account -->
 <div v-if="wallet?.virtualAccount" class="xl:col-span-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
   <div class="flex items-start gap-4">
     <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-emerald-100/50">
       <Building2 class="w-6 h-6 text-emerald-600" />
     </div>
     <div>
       <div class="flex items-center gap-2 mb-1">
         <h3 class="text-gray-900 font-semibold tracking-tight">{{ wallet.virtualAccount.bankName }}</h3>
         <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Instant Funding</span>
       </div>
       <p class="text-2xl font-bold tracking-tight text-gray-800 font-mono">{{ wallet.virtualAccount.accountNumber }}</p>
       <p class="text-sm font-medium text-emerald-600/80 mt-0.5">{{ wallet.virtualAccount.accountName }}</p>
     </div>
   </div>
   <div class="bg-white/60 p-4 rounded-xl border border-emerald-100/50">
     <p class="text-sm font-medium text-emerald-800 leading-relaxed max-w-xs">Transfer to this dedicated account number to automatically fund your vendor wallet instantly.</p>
   </div>
 </div>

 <!-- Quick Stats / Active Account -->
 <div class="xl:col-span-4 bg-gray-900 p-10 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between">
 <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-md blur-2xl"></div>
 
 <div class="space-y-6 relative z-10">
 <div class="flex items-center justify-between">
 <p class="text-sm font-medium text-white/40">Your Bank Account</p>
 <SettingsIcon class="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" @click="$router.push('/dashboard/settings')" />
 </div>
 
 <div v-if="wallet?.bankDetails?.accountNumber" class="space-y-2">
 <p class="text-sm font-bold text-white truncate" :title="wallet.bankDetails.bankName">{{ wallet.bankDetails.bankName }}</p>
 <p class="text-xl font-mono text-white/60">{{ maskAccountNumber(wallet.bankDetails.accountNumber) }}</p>
 <p class="text-sm font-bold text-emerald-400 pt-2 flex items-center gap-2">
 <ShieldCheck class="w-3 h-3" />
 Verified Identity
 </p>
 </div>
 <div v-else class="py-4 text-center border border-dashed border-white/10 rounded-md">
 <p class="text-sm text-white/40 font-bold">No Bank Linked</p>
 <NuxtLink to="/dashboard/settings" class="text-sm text-blue-400 font-medium mt-2 block hover:underline">Configure Now</NuxtLink>
 </div>
 </div>

 <div class="mt-10 pt-8 border-t border-white/5 space-y-4 relative z-10">
 <div class="flex justify-between items-center text-sm font-medium text-white/40">
 <span>Cycle</span>
 <span class="text-white">{{ wallet?.payoutPreference || 'Weekly' }}</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Financial Timeline -->
 <section class="space-y-8">
 <div class="flex items-center justify-between px-2">
 <div class="space-y-1">
 <h3 class="text-xl font-medium text-gray-900">Transaction History</h3>
 <p class="text-sm font-bold text-gray-400">View your recent earnings and withdrawals.</p>
 </div>
 <div class="flex items-center gap-4">
 <div class="flex bg-gray-50 rounded-md p-1">
 <button class="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-900">All</button>
 <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Earnings</button>
 <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Withdrawals</button>
 </div>
 </div>
 </div>

 <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
 <UiTable
 :columns="[
 { key: 'activity', label: 'Activity' },
 { key: 'type', label: 'Flow' },
 { key: 'amount', label: 'Amount' },
 { key: 'date', label: 'Timestamp' },
 { key: 'actions', label: '' }
 ]"
 :items="transactions"
 :loading="loadingTransactions"
 >
 <template #activity="{ item }">
 <div class="flex items-center gap-4 py-2">
 <div 
 class="w-10 h-10 rounded-md flex items-center justify-center transition-colors"
 :class="(item as any).type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
 >
 <ArrowUpRight v-if="(item as any).type === 'credit'" class="w-5 h-5" />
 <ArrowDownLeft v-else class="w-5 h-5" />
 </div>
 <div>
 <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ (item as any).description }}</p>
 <p v-if="(item as any).order" class="text-sm text-[#FF5C1A] font-medium">
 REF: SEC-{{ (item as any)._id?.slice(-8).toUpperCase() }}
 </p>
 </div>
 </div>
 </template>

 <template #type="{ item }">
 <span 
 class="px-3 py-1 rounded-lg text-sm font-medium"
 :class="(item as any).type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
 >
 {{ (item as any).type }}
 </span>
 </template>

 <template #amount="{ item }">
 <p 
 class="text-lg font-medium"
 :class="(item as any).type === 'credit' ? 'text-emerald-500' : 'text-rose-500'"
 >
 {{ (item as any).type === 'credit' ? '+' : '-' }}₦{{ (item as any).amount.toLocaleString() }}
 </p>
 </template>

 <template #date="{ item }">
 <div class="text-right">
 <p class="text-sm font-bold text-gray-900">{{ formatDate((item as any).createdAt) }}</p>
 <p class="text-sm text-gray-400 font-bold mt-0.5">{{ formatTime((item as any).createdAt) }}</p>
 </div>
 </template>

 <template #actions="{ item }">
 <div class="flex justify-end">
 <button @click="downloadReceipt((item as any)._id)" class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-[#FF5C1A] hover:bg-[#FF5C1A]/10 transition-colors flex items-center gap-1.5 border border-gray-100 shadow-sm bg-white">
 <Download class="w-3.5 h-3.5" />
 Receipt
 </button>
 </div>
 </template>
 </UiTable>
 </div>
 </section>
 </div>

 <!-- Payout Request Modal -->
 <SideDrawer 
 :isOpen="showWithdrawModal" 
 title="Request Payout"
 subtitle="Transfer your earnings to your verified active account."
 @close="showWithdrawModal = false"
 >
 <div class="space-y-10 py-6">
 <div class="p-8 bg-white rounded-2xl border border-gray-100 text-center space-y-6 relative overflow-hidden group border border-gray-50/50">
 <div class="absolute inset-0 bg-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <div class="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto border border-gray-100 text-[#FF5C1A] relative z-10">
 <Banknote class="w-10 h-10" />
 </div>
 <div class="relative z-10">
 <p class="text-sm font-medium text-gray-400 mb-1">Current Balance</p>
 <p class="text-4xl font-medium text-gray-900">₦{{ balance?.toLocaleString() }}</p>
 </div>
 </div>

 <div class="space-y-6">
  <AnimatedInput 
  v-model="formattedWithdrawAmount" 
  type="text" 
  label="Withdrawal Amount (₦)" 
  description="Enter how much you want to transfer."
  />
  <div class="mt-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">Select Bank Account</label>
    <select v-model="selectedBankAccount" class="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all">
      <option value="" disabled>Select an account</option>
      <option v-for="(acc, idx) in availableBankAccounts" :key="idx" :value="acc">
        {{ acc.bankName }} - {{ maskAccountNumber(acc.accountNumber) }} ({{ acc.purpose || 'Default' }})
      </option>
    </select>
  </div>
  
  <div class="mt-4 flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md">
    <div>
      <h3 class="text-sm font-medium text-gray-900">Instant Payout (1% Fee)</h3>
      <p class="text-xs text-gray-500 mt-0.5">Get your money immediately.</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" v-model="isInstantWithdrawal" class="sr-only peer">
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
    </label>
  </div>
  <div v-if="isInstantWithdrawal && withdrawAmount > 0" class="mt-2 text-xs font-medium text-emerald-600 flex justify-between px-1">
    <span>You will receive:</span>
    <span>₦{{ (withdrawAmount * 0.99).toLocaleString('en-US') }}</span>
  </div>
 
 <div class="p-5 bg-amber-50 rounded-md border border-amber-100 flex items-start gap-4 mt-4">
 <AlertCircle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
 <p class="text-sm text-amber-700 font-semibold leading-relaxed">
 Notice: Ensure your bank details are correct to avoid delays in payout processing.
 </p>
 </div>
 </div>
 </div>

 <template #footer>
 <div class="flex items-center gap-4 w-full">
 <button @click="showWithdrawModal = false" class="flex-1 py-2 bg-white border border-gray-100 text-gray-400 text-sm font-medium rounded-md">Cancel</button>
 <button 
 @click="handleWithdraw" 
 :disabled="withdrawAmount <= 0 || withdrawAmount > (balance || 0)" 
 class="flex-[2] py-4 bg-gray-900 text-white rounded-md font-medium text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
 >
 Authorize Payout
 </button>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { CreditCard, TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownLeft, Settings as SettingsIcon, Banknote, HelpCircle, X, Building2, AlertCircle, Store, Loader2, Download } from 'lucide-vue-next';
import { useWallet } from '@/composables/modules/wallets';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiTable from '@/components/ui/UiTable.vue';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
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

const availableBankAccounts = computed(() => {
  if (wallet.value?.bankAccounts?.length > 0) return wallet.value.bankAccounts;
  if (wallet.value?.metadata?.payoutAccounts?.length > 0) return wallet.value.metadata.payoutAccounts;
  if (wallet.value?.bankDetails?.accountNumber) return [wallet.value.bankDetails];
  return [];
});

watch(showWithdrawModal, (val) => {
  if (val && availableBankAccounts.value.length > 0 && !selectedBankAccount.value) {
    // pre-select the primary or first one
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
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.tracking-tighter { letter-spacing: -0.05em; }
</style>
