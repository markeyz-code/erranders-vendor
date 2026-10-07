<template>
  <footer class="bg-gradient-to-b from-white to-slate-50/50 text-slate-800 relative overflow-hidden border-t border-slate-100">
    <!-- Soft Minimalist Grid Dot Overlay -->
    <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-12 relative z-10">
      
      <!-- Massive CTA Section -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-32">
        <div class="max-w-3xl">
          <h2 class="text-6xl md:text-[7rem] font-medium tracking-tighter leading-[0.85] mb-6 text-slate-950">
            Ready to <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C1A] to-[#044ec0]">Scale Up?</span>
          </h2>
          <p class="text-xl md:text-xl text-slate-500 font-medium tracking-tight">
            Join the fastest-growing campus delivery network today.
          </p>
        </div>
        
        <NuxtLink to="/auth/register" class="group relative px-8 py-3.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-md font-bold text-base overflow-hidden flex-shrink-0 transition-all hover: active:scale-95">
          <span class="relative z-10 flex items-center gap-3">
            Open Storefront <ArrowUpRight class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        </NuxtLink>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-slate-200/60 mb-20"></div>

      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
        
        <!-- Brand Column -->
        <div class="md:col-span-5 flex flex-col items-start">
          <NuxtLink to="/" class="flex items-center gap-4 mb-8 group cursor-pointer">
            <span class="text-xl font-medium tracking-tighter text-slate-950">
              <img src="@/assets/img/erranders.png" alt="Erranders Logo" class="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
            </span>
          </NuxtLink>
          <p class="text-slate-500 text-base font-medium leading-relaxed mb-10 max-w-sm">
            Providing vendors with powerful digital infrastructure to dominate campus food delivery and logistics.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FF5C1A] hover:border-[#FF5C1A] hover:bg-[#FF5C1A]/5 hover: transition-all duration-300">
              <Twitter class="w-5 h-5"/>
            </a>
            <a href="#" class="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/5 hover: transition-all duration-300">
              <Instagram class="w-5 h-5"/>
            </a>
            <a href="#" class="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 hover: transition-all duration-300">
              <Facebook class="w-5 h-5"/>
            </a>
          </div>
        </div>
        
        <!-- Links Columns -->
        <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div>
            <h4 class="font-bold text-slate-400 mb-8 text-sm uppercase tracking-wider">Platform</h4>
            <ul class="space-y-5 text-base font-bold text-slate-600">
              <li><NuxtLink to="/about" class="hover:text-[#FF5C1A] transition-colors relative group w-fit"><span class="relative z-10">About Us</span></NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-[#FF5C1A] transition-colors relative group w-fit"><span class="relative z-10">Contact Sales</span></NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-[#FF5C1A] transition-colors relative group w-fit"><span class="relative z-10">Knowledge Base</span></NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-slate-400 mb-8 text-sm uppercase tracking-wider">Legal</h4>
            <ul class="space-y-5 text-base font-bold text-slate-600">
              <li><NuxtLink to="/terms" class="hover:text-[#FF5C1A] transition-colors relative group w-fit"><span class="relative z-10">Vendor Agreement</span></NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-[#FF5C1A] transition-colors relative group w-fit"><span class="relative z-10">Privacy Policy</span></NuxtLink></li>
            </ul>
          </div>
          
          <div class="col-span-2 sm:col-span-1">
            <h4 class="font-bold text-slate-400 mb-8 text-sm uppercase tracking-wider">Ecosystem</h4>
            <ul class="space-y-5 text-base font-bold text-slate-600">
              <li>
                <a href="https://erranders.org" target="_blank" class="group flex items-center gap-3 hover:text-[#FF5C1A] transition-colors p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 -ml-3">
                  <div class="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Utensils class="w-4 h-4" /></div>
                  Order Food
                </a>
              </li>
              <li>
                <a href="https://dispatch.erranders.org" target="_blank" class="group flex items-center gap-3 hover:text-[#FF5C1A] transition-colors p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 -ml-3">
                  <div class="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-[#FF5C1A] group-hover:text-white transition-colors"><Bike class="w-4 h-4" /></div>
                  Become a Rider
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <p class="text-sm font-medium text-slate-400">
          &copy; {{ new Date().getFullYear() }} Erranders Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Twitter, Instagram, Facebook, Utensils, Bike, ArrowUpRight } from 'lucide-vue-next'
</script>
