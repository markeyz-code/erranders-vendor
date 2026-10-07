<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5C1A]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
    </div>

    <div class="max-w-xl w-full space-y-8 relative z-10">
      <!-- Progress Bar -->
      <div class="flex gap-2 mb-12">
        <div v-for="i in 3" :key="i" 
          class="h-1 flex-1 rounded-full transition-all duration-500"
          :class="step >= i ? 'bg-[#FF5C1A] shadow-[0_0_15px_rgba(255,92,26,0.5)]' : 'bg-white/10'"
        />
      </div>

      <!-- Step Content -->
      <div class="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        
        <!-- Step 1: Basic Info -->
        <div v-if="step === 1" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-[#FF5C1A]/20 text-[#FF5C1A] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#FF5C1A]/20 shadow-inner">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">Let's set up your store</h2>
            <p class="text-gray-400 text-sm font-bold uppercase ">Every student business starts with a great profile</p>
          </div>

          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Store Name</label>
              <input v-model="form.storeName" type="text" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="e.g. Tunde's Tasty Treats" />
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Store Description</label>
              <textarea v-model="form.description" rows="3" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all resize-none" placeholder="What do you sell? Tell your customers..."></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Logo URL (Optional)</label>
                <input v-model="form.logo" type="text" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="https://..." />
              </div>
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Banner URL (Optional)</label>
                <input v-model="form.banner" type="text" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="https://..." />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Store Type</label>
              <select v-model="form.vendorType" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all appearance-none cursor-pointer">
                <option value="restaurant" class="text-gray-900">Restaurant / Eatery</option>
                <option value="mini-mart" class="text-gray-900">Mini-Mart / Provisions</option>
                <option value="single-category" class="text-gray-900">Single Category</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2: Product & Type -->
        <div v-if="step === 2" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-400/20 shadow-inner">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">Preparation Time</h2>
            <p class="text-gray-400 text-sm font-bold uppercase ">Do you need time to prepare your items?</p>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/30 transition-all cursor-pointer group" @click="form.preOrderOnly = !form.preOrderOnly">
              <div>
                <p class="font-bold text-white tracking-tight">Pre-order Only</p>
                <p class="text-[10px] font-medium text-gray-500 mt-1">Customers must order in advance.</p>
              </div>
              <div class="w-12 h-6 rounded-full relative transition-colors duration-300 border border-white/20" :class="form.preOrderOnly ? 'bg-[#FF5C1A] border-[#FF5C1A]' : 'bg-black/20'">
                <div class="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-300" :class="form.preOrderOnly ? 'translate-x-6' : ''" />
              </div>
            </div>

            <div v-if="form.preOrderOnly" class="space-y-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Preparation Lead Time (Hours)</label>
                <input v-model="form.preOrderLeadTime" type="number" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="e.g. 24" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Pre-order Days</label>
                <input v-model="form.preOrderDaysString" type="text" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="e.g. friday, saturday" />
              </div>
            </div>
            <div v-else class="space-y-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-medium text-gray-500 uppercase  ml-1">Preparation Time (Minutes)</label>
                <input v-model="form.preparationTime" type="number" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:ring-4 focus:ring-[#FF5C1A]/20 outline-none transition-all" placeholder="e.g. 20" />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Identity -->
        <div v-if="step === 3" class="space-y-6 animate-fade-in">
          <div class="text-center space-y-2 mb-10">
            <div class="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-400/20 shadow-inner">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h2 class="text-3xl font-medium text-white tracking-tighter">Final Touch</h2>
            <p class="text-gray-400 text-sm font-bold uppercase ">You're almost there! Let's verify your student status.</p>
          </div>

          <div class="space-y-6">
            <div class="p-8 border border-dashed border-white/10 rounded-[2rem] text-center hover:border-[#FF5C1A]/50 transition-all cursor-pointer group bg-white/5 flex flex-col items-center justify-center">
              <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              </div>
              <p class="text-sm font-bold text-white mb-1">Student ID (Optional)</p>
              <p class="text-[9px] text-gray-500 font-bold uppercase  leading-tight">Helps build trust with customers</p>
            </div>
            
            <div class="flex items-center gap-4 p-5 bg-[#FF5C1A]/10 rounded-2xl border border-[#FF5C1A]/20">
              <span class="text-xl">🎓</span>
              <p class="text-sm text-[#FF5C1A] font-bold leading-tight">You are joining as a Student Entrepreneur. Listing is 100% free.</p>
            </div>
          </div>
        </div>

        <!-- Nav Buttons -->
        <div class="flex gap-4 mt-12 pt-6 border-t border-white/10">
          <button v-if="step > 1" @click="step--" class="flex-1 py-5 bg-white/5 text-white rounded-2xl text-[10px] font-medium uppercase  hover:bg-white/10 transition-all">Back</button>
          <button @click="nextStep" class="flex-[2] py-5 bg-[#FF5C1A] text-white rounded-2xl text-[10px] font-medium uppercase  hover:brightness-110 transition-all shadow-xl shadow-[#FF5C1A]/20">
            {{ step === 3 ? 'Launch My Store' : 'Continue' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useHead } from '#imports';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

useHead({ title: 'Vendor Onboarding - Errander' });

const router = useRouter();
const step = ref(1);

const form = ref({
  storeName: '',
  description: '',
  logo: '',
  banner: '',
  preOrderOnly: false,
  preOrderLeadTime: 24,
  preOrderDaysString: '',
  preparationTime: 20,
  isStudentBusiness: true,
  vendorType: 'restaurant'
});

const nextStep = async () => {
  if (step.value < 3) {
    step.value++;
  } else {
    try {
      const payload: any = { ...form.value };
      if (payload.preOrderDaysString) {
        payload.preOrderDays = payload.preOrderDaysString.split(',').map((d: string) => d.trim().toLowerCase());
      }
      delete payload.preOrderDaysString;
      
      await api.put('/vendors/profile', payload);
      if (form.value.vendorType === 'mini-mart') {
        router.push('/products/bulk-add?onboarding=true');
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
