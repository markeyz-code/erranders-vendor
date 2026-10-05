<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-8">
          <Store class="w-3.5 h-3.5 text-[#FF5C1A]" />
          The Vendor Ecosystem
        </div>
        <h1 class="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-slate-900 mb-10 max-w-4xl mx-auto">
          Scale your kitchen <br />
          <span class="text-[#FF5C1A] bg-[#FF5C1A]/5 px-6 rounded-md">globally</span> on campus.
        </h1>
        <p class="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
          Whether you're a student cooking from the hostel or an established campus restaurant, Erranders gives you the tools to thrive.
        </p>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Multi-Module Dash -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-blue-50 rounded-md flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <LayoutDashboard class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-4">Pro Dashboard</h3>
            <p class="text-gray-600 font-medium leading-relaxed mb-6">Manage orders, inventory, and customer insights from a single, beautiful interface designed for speed.</p>
            <div class="flex items-center gap-2 text-sm font-bold text-parentPrimary">
              <div class="h-px flex-1 bg-parentPrimary/10"></div>
              Full Control
            </div>
          </div>

          <!-- Automated Payouts -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Wallet class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-4">Instant Payouts</h3>
            <p class="text-gray-600 font-medium leading-relaxed mb-6">Get your earnings sent directly to your bank account with transparent settlement reports and real-time wallet tracking.</p>
            <div class="flex items-center gap-2 text-sm font-bold text-emerald-600">
              <div class="h-px flex-1 bg-emerald-500/10"></div>
              Financial Clarity
            </div>
          </div>

          <!-- Reach -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 hover: hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Zap class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-4">Campus Reach</h3>
            <p class="text-gray-600 font-medium leading-relaxed mb-6">Instantly access thousands of students at CMUL and beyond. We handle the logistics so you can focus on the food.</p>
            <div class="flex items-center gap-2 text-sm font-bold text-indigo-600">
              <div class="h-px flex-1 bg-indigo-500/10"></div>
              Growth Scaled
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support for Entrepreneurs -->
    <section class="py-32 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="flex-1 space-y-10 text-center lg:text-left">
            <h2 class="text-5xl md:text-6xl font-medium tracking-tighter leading-[0.95] text-gray-900">
              For the students <br />
              <span class="text-parentPrimary">building legends.</span>
            </h2>
            <p class="text-xl text-gray-600 font-medium leading-relaxed tracking-tight max-w-2xl">
              We empower student entrepreneurs cooking from hostel kitchens or running side-hustles. Erranders provides a professional digital storefront to level the playing field.
            </p>
            <div class="pt-6">
              <NuxtLink to="/auth/register" class="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-md font-medium text-base hover:bg-parentPrimary transition-all group">
                Open Your Storefront
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>
          <div class="flex-1 bg-gray-50 p-12 rounded-[4rem] relative border border-gray-50">
            <div class="absolute inset-0 bg-parentPrimary/5 blur-[100px] rounded-md animate-pulse-slow"></div>
            <div class="relative z-10 space-y-8">
              <div v-for="item in steps" :key="item.t" class="flex gap-6 items-start">
                <div class="w-10 h-10 rounded-md bg-white border border-gray-25 flex items-center justify-center text-sm font-medium text-parentPrimary">{{ item.n }}</div>
                <div>
                   <h4 class="font-medium text-gray-900 mb-2 tracking-tight">{{ item.t }}</h4>
                   <p class="text-gray-600 font-medium text-sm">{{ item.d }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { Store, LayoutDashboard, Wallet, Zap, ArrowRight } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'About Erranders Vendors - Scale Your Business',
  meta: [{ name: 'description', content: 'Erranders for Vendors empowers campus restaurants and student creators with the tools to reach more hungry students.' }] 
})

const steps = [
  { n: 1, t: "List Your Menu", d: "Add photos and pricing to your digital storefront." },
  { n: 2, t: "Accept Orders", d: "Get real-time notifications on your pro dashboard." },
  { n: 3, t: "Watch Growth", d: "Automated logistics handled by our student riders." }
]
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}
</style>

