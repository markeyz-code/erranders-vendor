<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <LandingNavbar />

    <section class="relative pt-40 pb-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-8">
          <HelpCircle class="w-3.5 h-3.5 text-[#FF5C1A]" />
          Merchant Knowledge Base
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-slate-900 mb-6 max-w-4xl mx-auto">
          Partner <span class="text-[#FF5C1A]">Insights.</span>
        </h1>
        <p class="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
          Everything you need to know about scaling your campus business with Erranders.
        </p>
      </div>
    </section>

    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6 sm:px-10">
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i" class="group border border-gray-50 rounded-md overflow-hidden transition-all duration-500" :class="{ 'bg-gray-50/50 border-parentPrimary/20 ': openIndex === i }">
            <button @click="openIndex = openIndex === i ? -1 : i" class="w-full flex items-center justify-between p-8 text-left outline-none">
              <span class="text-xl font-medium text-gray-900 tracking-tight group-hover:text-parentPrimary transition-colors">{{ faq.q }}</span>
              <div class="w-10 h-10 rounded-md bg-white border border-gray-50 flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-all" :class="{ 'rotate-180 bg-parentPrimary text-white border-transparent': openIndex === i }">
                <ChevronDown class="w-5 h-5" />
              </div>
            </button>
            <transition name="fade">
              <div v-show="openIndex === i" class="px-8 pb-8">
                <div class="h-px bg-gray-200/50 mb-6"></div>
                <p class="text-lg text-gray-600 font-medium leading-relaxed tracking-tight">{{ faq.a }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { HelpCircle, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
definePageMeta({ layout: false })
useHead({ 
  title: 'Merchant FAQ - Scale with Erranders',
  meta: [{ name: 'description', content: 'Frequently asked questions for vendors on the Erranders campus delivery platform.' }] 
})

const openIndex = ref(0)
const faqs = [
  { q: 'Registration & Activation', a: 'Join in 3 steps: Personal details, Store Profile, and Logo upload. Accounts are typically verified within 24 hours to ensure high-quality campus standards.' },
  { q: 'Service Fees & Commissions', a: 'Listing is free. We only succeed when you do — Erranders takes a small commission per order to fuel logistics and student marketing. No hidden monthly fees.' },
  { q: 'Automated 24h Payouts', a: 'Earnings are automatically settled every 24 hours. Track every Naira via your pro dashboard with transparent reporting across all campus locations.' },
  { q: 'Menu & Inventory Control', a: 'Total autonomy. Upload photos, set dynamic pricing, and toggle item availability in real-time. We even support bulk CSV uploads for large menus.' },
  { q: 'Rider & Logistics Flow', a: 'Zero overhead. When an order is ready, our network of student riders is instantly notified. We handle the 15-minute campus dash while you focus on the cooking.' },
  { q: 'Operating Hours', a: 'You set the schedule. Open and close your digital storefront manually or use the automated scheduler to match your kitchen operating times.' }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

