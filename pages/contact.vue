<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-8">
          <span class="w-1.5 h-1.5 rounded-md bg-[#FF5C1A]"></span>
          Merchant Success
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-slate-900 mb-6 max-w-4xl mx-auto">
          We're here for <br />
          <span class="text-[#FF5C1A] bg-[#FF5C1A]/5 px-6 rounded-md">your growth.</span>
        </h1>
        <p class="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
          Dedicated support for our campus partners. From technical assistance to banking inquiries, we've got you covered.
        </p>
      </div>
    </section>

    <!-- Contact Cards -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Support Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 hover:bg-white hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-md flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <Mail class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Merchant Help</h3>
            <p class="text-[13px] text-gray-600 font-medium leading-relaxed mb-6">Menu updates and store configurations.</p>
            <a href="mailto:vendors@erranders.org" class="text-sm font-medium text-parentPrimary hover:underline">vendors@erranders.org</a>
          </div>

          <!-- Payouts Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 hover:bg-white hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Banknote class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Finance Ops</h3>
            <p class="text-[13px] text-gray-600 font-medium leading-relaxed mb-6">Payout inquiries and banking setup.</p>
            <a href="mailto:finance@erranders.org" class="text-sm font-medium text-emerald-600 hover:underline">finance@erranders.org</a>
          </div>

          <!-- Hotline Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 hover:bg-white hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Phone class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Urgent Hotline</h3>
            <p class="text-[13px] text-gray-600 font-medium leading-relaxed mb-6">Real-time order dispute resolution.</p>
            <a href="tel:09040303103" class="text-sm font-medium text-indigo-600 hover:underline">+234 (0) 901 234 567</a>
          </div>

          <!-- Partnership Card -->
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 hover:bg-white hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-purple-50 rounded-md flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform">
              <Handshake class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Sponsorships</h3>
            <p class="text-[13px] text-gray-600 font-medium leading-relaxed mb-6">Bulk catering and featured listings.</p>
            <a href="mailto:partnerships@erranders.org" class="text-sm font-medium text-purple-600 hover:underline tracking-tight">Join Us</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { Mail, Phone, Banknote, Handshake } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Merchant Support - Partner with Erranders',
  meta: [{ name: 'description', content: 'Dedicated support for Erranders campus vendors. Get help with store management and payouts.' }] 
})
</script>

