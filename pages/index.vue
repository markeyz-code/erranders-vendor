<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth selection:bg-parentPrimary selection:text-white">
    <!-- <ExamPromoBanner /> -->
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section with Background Carousel & Continuous Marquee -->
    <!-- Hero Section: Clean, Centered Simplicity (Matching Erranders for Business) -->
    <section class="relative min-h-screen min-h-[100dvh] border-b border-slate-100 flex flex-col justify-center items-center pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-orange-50/30 via-white to-white">
      <!-- Soft dot background grid (seeding pattern) -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5C1A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Max Width Stage -->
      <div class="max-w-7xl mx-auto relative w-full my-auto">
        <!-- Center Column Content -->
        <div class="max-w-3xl mx-auto text-center relative z-20 space-y-6 sm:space-y-8">
          <!-- Launch Pill with plenty of breathing room from navbar -->
          <div class="pt-2 sm:pt-0">
            <NuxtLink
              to="/auth/register"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-[#FF5C1A] text-xs font-bold hover:bg-orange-100/70 transition-colors shadow-2xs group"
            >
              <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
              <span>Active at UNILAG, LASU, YABATECH & Beyond</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-[#FF5C1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </NuxtLink>
          </div>

          <!-- Main Bold Heading with Rotating Carousel Tagline -->
          <div class="space-y-3">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Erranders for Vendors
            </h1>

            <!-- Rotating Headline Micro-Carousel -->
            <div class="relative h-10 sm:h-12 overflow-hidden flex items-center justify-center">
              <TransitionGroup name="hero-slide" tag="div" class="w-full">
                <p
                  :key="currentHeadingIndex"
                  class="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl font-black tracking-tight text-[#FF5C1A]"
                >
                  <span>{{ heroHeadings[currentHeadingIndex] }}</span>
                </p>
              </TransitionGroup>
            </div>
          </div>

          <!-- Subtitle: Inclusive of food, provisions & student services -->
          <p class="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Sell to 30,000+ students on campus. Whether you cook hot meals, sell essentials, or offer services (nail tech, laundry, repairs) — verified student Errand Ninjas deliver straight to hostel rooms with instant bank payouts.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <NuxtLink
              to="/auth/register"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#FF5C1A] text-white text-sm font-bold shadow-md shadow-[#FF5C1A]/25 hover:bg-[#E54D12] active:scale-[0.98] transition-all group"
            >
              <span>Launch Free Campus Store</span>
              <span class="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                <ArrowUpRight class="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </NuxtLink>

            <a
              href="#calculator"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-slate-950 text-white text-sm font-bold shadow-md shadow-slate-950/20 hover:bg-slate-800 active:scale-[0.98] transition-all group"
            >
              <span>Calculate Your Earnings</span>
              <span class="w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                <ArrowUpRight class="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          <!-- Trust points -->
          <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 pt-2">
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Ninjas handle all deliveries</span>
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Food, retail & student services</span>
            <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Instant escrow bank payouts</span>
          </div>
        </div>

        <!-- ═══ DESKTOP-ONLY FLOATING ORGANIC HERO IMAGES (Strictly hidden on Mobile) ═══ -->
        <!-- Card 1: Top Right (Chef Photo with Verified Kitchen Pill) -->
        <!-- <div class="hidden lg:block absolute top-4 right-4 xl:right-12 z-10 group cursor-pointer transition-all duration-500 hover:scale-105">
          <div class="relative w-44 h-44 xl:w-52 xl:h-52 drop-shadow-xl">
            <div class="w-full h-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl bg-slate-100">
              <img
                src="/img/hero_vendor_chef.jpg"
                alt="Campus food vendor chef"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
              />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
              <span>🍲 Campus Chef Kitchen</span>
            </div>
          </div>
        </div> -->

        <!-- Card 2: Bottom Left (Instant Settlement Badge) -->
        <!-- <div class="hidden lg:block absolute bottom-4 left-4 xl:left-12 z-10 group cursor-pointer transition-all duration-500 hover:scale-105">
          <div class="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl space-y-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="text-xs font-black text-slate-900">Live Campus Orders</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">30,000+ Students Reached</p>
            <div class="pt-1 flex items-center gap-1.5 text-xs font-black text-emerald-600">
              <CheckCircle2 class="w-3.5 h-3.5" /> Instant Bank Alert
            </div>
          </div>
        </div> -->
      </div>
    </section>

  <!-- Marquee Row 1 -->
  <div class="mt-24 relative bg-slate-900 overflow-hidden py-3 transform -rotate-1 border-y border-slate-800 z-10">
    <div class="flex animate-marquee-fast w-max items-center">
      <div class="flex items-center gap-12 px-6" v-for="i in 6" :key="i">
        <span class="text-xl font-medium text-white tracking-tight">10,000+ Students on Campus</span>
        <Star class="w-6 h-6 text-yellow-300 fill-current" />
        <span class="text-xl font-medium text-white tracking-tight outline-text">Fast & Reliable Payouts</span>
        <Zap class="w-6 h-6 text-yellow-300 fill-current" />
        <span class="text-xl font-medium text-white tracking-tight">Orders Coming In, Sharp Sharp</span>
        <TrendingUp class="w-6 h-6 text-yellow-300 stroke-[3]" />
      </div>
    </div>
  </div>

  <!-- Marquee Row 2 -->
  <div class="relative bg-white overflow-hidden py-2 transform rotate-1 -mt-3 border-y border-slate-100 z-10">
    <div class="flex animate-marquee-reverse w-max items-center">
      <div class="flex items-center gap-12 px-6" v-for="i in 6" :key="`rev-${i}`">
        <span class="text-base font-bold text-slate-700">Delivered Across Campus</span>
        <Bike class="w-5 h-5 text-emerald-500" />
        <span class="text-base font-bold text-slate-700">Zero Commission on Your First 50 Orders</span>
        <Utensils class="w-5 h-5 text-[#FF5C1A]" />
      </div>
    </div>
  </div>

    <!-- Features Section -->
    <section id="features" class="py-32 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-md bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-sm font-medium mb-6">
            <Zap class="w-4 h-4" /> The Vendor Toolkit
          </div>
          <h2 class="text-4xl lg:text-5xl font-medium text-gray-900 tracking-tighter leading-tight mb-6">
            Everything you need to <br/><span class="text-parentPrimary">dominate campus commerce.</span>
          </h2>
          <p class="text-gray-500 font-bold text-lg leading-relaxed">
            We built Errander strictly for the chaos of a busy campus. Accept orders, manage bookings, analyze sales, and update your offerings in seconds.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, idx) in toolkitFeatures" :key="idx" 
               class="group bg-white p-8 rounded-md border border-slate-100 hover:border-[#FF5C1A]/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col items-start">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-md blur-2xl group-hover:bg-[#FF5C1A]/5 transition-all duration-500"></div>
            <div class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center text-slate-700 mb-6 group-hover:scale-110 group-hover:bg-[#FF5C1A] group-hover:text-white group-hover:border-[#FF5C1A] transition-all duration-300 relative z-10">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-extrabold text-slate-900 tracking-tight mb-2 relative z-10">{{ feature.title }}</h3>
            <p class="text-slate-500 font-medium leading-relaxed text-sm relative z-10">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Built for Every Campus Hustle: Food, Services & Retail -->
    <section id="models" class="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-60 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div class="text-center mb-16 max-w-2xl mx-auto space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 text-[#FF5C1A] text-xs font-bold uppercase tracking-wider">
            <Sparkles class="w-3.5 h-3.5" /> Built for Every Campus Hustle
          </div>
          <h2 class="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Not just food. Built for all campus businesses.
          </h2>
          <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
            Whether you cook from your hostel, style hair, clean rooms, or sell sneakers — Errander gives you a branded digital storefront with automated dispatch and payments.
          </p>
        </div>

        <!-- 4 Model Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div 
            v-for="(model, idx) in businessModels" 
            :key="idx"
            class="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/5 hover:border-[#FF5C1A]/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-[#FF5C1A] group-hover:text-white transition-all duration-300">
                  <component :is="model.icon" class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider" :class="model.badgeColor">
                  {{ model.badge }}
                </span>
              </div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight mb-2">{{ model.title }}</h3>
              <p class="text-xs text-slate-500 font-medium mb-5 leading-relaxed">{{ model.description }}</p>

              <div class="space-y-2 border-t border-slate-100 pt-4 mb-6">
                <div v-for="(feat, fIdx) in model.features" :key="fIdx" class="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{{ feat }}</span>
                </div>
              </div>
            </div>

            <NuxtLink to="/auth/register" class="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#FF5C1A] hover:text-white text-slate-700 font-bold text-xs text-center transition-all duration-200 border border-slate-100">
              Start Free {{ model.title.split(' ')[0] }} Store &rarr;
            </NuxtLink>
          </div>
        </div>

        <!-- Interactive Campus Earnings Calculator -->
        <div id="calculator" class="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
          <div class="absolute -right-24 -top-24 w-80 h-80 bg-[#FF5C1A]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-24 -bottom-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <!-- Left: Sliders -->
            <div class="lg:col-span-7 space-y-8">
              <div class="space-y-2">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Calculator class="w-3.5 h-3.5" /> Campus Profit Calculator
                </div>
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Estimate your monthly campus revenue
                </h3>
                <p class="text-slate-400 text-sm font-medium">
                  Adjust your expected daily orders and average price to see your earning potential on Errander.
                </p>
              </div>

              <!-- Slider 1: Daily Orders -->
              <div class="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div class="flex items-center justify-between">
                  <label class="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">Daily Orders or Appointments</label>
                  <span class="text-lg font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20">
                    {{ calcDailyOrders }} / day
                  </span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="60" 
                  step="1"
                  v-model.number="calcDailyOrders" 
                  class="w-full accent-[#FF5C1A] h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div class="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>3 orders</span>
                  <span>20 orders (average)</span>
                  <span>60+ orders (peak)</span>
                </div>
              </div>

              <!-- Slider 2: Average Order Value -->
              <div class="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div class="flex items-center justify-between">
                  <label class="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">Average Price Per Order or Service</label>
                  <span class="text-lg font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20">
                    ₦{{ calcAvgValue.toLocaleString() }}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="800" 
                  max="15000" 
                  step="200"
                  v-model.number="calcAvgValue" 
                  class="w-full accent-[#FF5C1A] h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div class="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>₦800 (quick bite/snack)</span>
                  <span>₦2,500 (standard meal)</span>
                  <span>₦15,000 (services/merch)</span>
                </div>
              </div>
            </div>

            <!-- Right: Revenue Readout Card -->
            <div class="lg:col-span-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div class="space-y-1">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected Monthly Gross</p>
                <div class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  ₦{{ calcMonthlyRevenue.toLocaleString() }}
                </div>
                <p class="text-xs text-slate-400 font-medium">Estimated ~{{ (calcDailyOrders * 30).toLocaleString() }} monthly transactions</p>
              </div>

              <div class="space-y-3 py-4 border-y border-white/10">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" /> Estimated Net Earnings:
                  </span>
                  <span class="font-bold text-emerald-400 text-sm">~₦{{ calcEstimatedProfit.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" /> Delivery Hassles:
                  </span>
                  <span class="font-bold text-white">0% (Handled by Ninjas)</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" /> Bank Payouts:
                  </span>
                  <span class="font-bold text-white">Instant Escrow Settlement</span>
                </div>
              </div>

              <NuxtLink 
                to="/auth/register" 
                class="w-full py-4 rounded-xl bg-[#FF5C1A] hover:bg-[#e54d12] text-white font-black text-sm text-center shadow-lg shadow-[#FF5C1A]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Selling on Campus</span>
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Carousel: Success Stories / Testimonials -->
    <section id="success" class="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-y border-slate-100 relative">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 mb-12 text-center">
        <h2 class="text-2xl lg:text-4xl font-medium text-slate-900 tracking-tighter">Trusted by top campus brands.</h2>
        <p class="text-slate-500 font-medium mt-3 text-sm">Hear from vendors who scaled their kitchens with Errander.</p>
      </div>
      
      <!-- Continuously Scrolling Testimonials -->
      <div class="relative w-full overflow-hidden pb-6 flex">
        <!-- Mask for fading edges -->
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20"></div>
        <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20"></div>

        <div class="flex animate-marquee-slow w-max hover:[animation-play-state:paused] transition-all cursor-grab active:cursor-grabbing">
          <!-- Repeat the cards twice for seamless looping -->
          <div class="flex gap-6 px-4" v-for="loop in 2" :key="`loop-${loop}`">
            <div v-for="(story, idx) in successStories" :key="`${loop}-${idx}`" 
                 class="w-[340px] flex-shrink-0 bg-white/80 backdrop-blur-xl p-6 rounded-md border border-slate-100 hover:border-[#FF5C1A]/30 transition-all duration-500 flex flex-col justify-between">
              <div>
                <Quote class="w-7 h-7 text-[#FF5C1A]/20 mb-4" />
                <!-- Static User-Friendly Text -->
                <p class="text-sm sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">"{{ story.quote }}"</p>
              </div>
              <div class="flex items-center gap-3 mt-auto">
                <img :src="story.image" class="w-10 h-10 rounded-md object-cover border border-slate-100" alt="Vendor Owner" />
                <div>
                  <h4 class="text-sm font-extrabold text-slate-900">{{ story.name }}</h4>
                  <p class="text-[11px] font-bold text-[#FF5C1A] mt-0.5 flex items-center gap-1">
                    <Store class="w-3.5 h-3.5" /> {{ story.restaurant }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="py-24 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden relative border-b border-slate-100">
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="absolute inset-0 z-0 flex whitespace-nowrap opacity-[0.03] font-medium text-[12rem] leading-none text-slate-950 overflow-hidden items-center pointer-events-none gap-8 select-none tracking-tight">
        Start Selling • Start Selling • Start Selling
      </div>
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        <h2 class="text-4xl md:text-6xl font-medium text-slate-950 tracking-tighter mb-8 leading-tight">
          Ready to digitize your <br/> campus restaurant?
        </h2>
        <p class="text-slate-500 font-medium text-lg mb-10 max-w-xl">
          Join hundreds of successful vendors on Errander today and watch your order volume explode.
        </p>
        <NuxtLink to="/auth/register" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-md font-bold transition-all text-sm group cursor-pointer active:scale-95">
          Create Free Profile <ArrowRight class="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform"/>
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  ArrowRight, ArrowUpRight, CheckCircle2, Twitter, Instagram, Facebook,
  LogIn, Store, TrendingUp, Zap, Rocket, Activity, ClipboardList, PieChart, Star,
  PlayCircle, Quote, Utensils, Bike, Sparkles, MapPin, Calculator, Scissors, ShoppingCart, ShoppingBag
} from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors'

const router = useRouter()
const scrolled = ref(false)

definePageMeta({
  layout: false
})

useHead({
  title: 'Errander for Vendors | Grow Your Campus Business',
  meta: [
    { name: 'description', content: 'Turn campus cravings and student skills into profit. Setup your digital store, reach students, and manage orders with Errander.' }
  ]
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// ── Campus Earnings Calculator ──
const calcDailyOrders = ref(18)
const calcAvgValue = ref(2500)
const calcMonthlyRevenue = computed(() => calcDailyOrders.value * calcAvgValue.value * 30)
const calcEstimatedProfit = computed(() => Math.round(calcMonthlyRevenue.value * 0.92))

// ── Built for Every Campus Hustle Models ──
const businessModels = [
  {
    icon: Utensils,
    title: 'Food, Kitchens & Buka',
    badge: 'Food & Snacks',
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
    description: 'Perfect for hostel cooks, pack sellers, canteens, bakeries, and drink vendors.',
    features: ['Takeaway pack add-ons', 'Prep-time paced ordering', 'Meal Desk recurring batch orders', 'Direct hostel room dispatch']
  },
  {
    icon: Scissors,
    title: 'Campus Services & Skills',
    badge: 'Services & Appointments',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'For student nail techs, barbers, hair braiders, fumigation, laundry & gadget repair.',
    features: ['Interactive booking calendar', 'Custom service price menus', 'Direct WhatsApp & student chat', 'Zero delivery friction']
  },
  {
    icon: ShoppingCart,
    title: 'Mini-Marts & Groceries',
    badge: 'Provisions & Marts',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    description: 'For grocery shops, provision marts, toiletries, and hostel everyday essentials.',
    features: ['Fast bulk inventory upload', 'Instant out-of-stock toggling', 'Late-night hostel drops', 'Bulk cart bundling']
  },
  {
    icon: ShoppingBag,
    title: 'Fashion, Merch & Retail',
    badge: 'Boutiques & Tech',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    description: 'For student boutiques, thrift wear, shoes, cosmetics, and electronics repair.',
    features: ['Size & color variants', 'High-res gallery displays', 'Direct student pickup or delivery', 'Instant escrow payout']
  }
]

const allVendors = ref<any[]>([])
const loadingAllVendors = ref(false)
const mapCategory = ref('all')

// Vendor Hero Rotating Headline Micro-Carousel (Matching Erranders for Business)
const heroHeadings = [
  'Sell to 30,000+ students on campus, sharp sharp.',
  'Ninjas deliver orders straight to hostel rooms.',
  'Meal Desk brings 50+ bulk pre-orders before classes start.',
  'Zero delivery stress — instant escrow bank payouts.',
]
const currentHeadingIndex = ref(0)
let headingTimer: any = null

// Dynamic Category Generator
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    restaurant: '🍽️', eatery: '🍽️', snacks: '🍪', drinks: '🥤', groceries: '🛒',
    bakery: '🥐', pharmacy: '💊', stationery: '📚', hair_salon: '💇‍♀️',
    nails: '💅', beauty_salon: '✨', barber: '💈', massage: '💆‍♀️', 
    pet_grooming: '🐾', services: '🎓'
  }
  return icons[category?.toLowerCase()] || '🏪'
}

const dynamicCategories = computed(() => {
  if (!allVendors.value) return [];
  const counts: Record<string, number> = {};
  allVendors.value.forEach(v => {
    const cat = v.category?.toLowerCase() || 'other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  return Object.keys(counts).map(cat => ({
    key: cat,
    label: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: getCategoryIcon(cat),
    count: counts[cat]
  })).sort((a, b) => b.count - a.count);
})

const filteredMapVendors = computed(() => {
  if (mapCategory.value === 'all') return allVendors.value
  return allVendors.value.filter(v => v.category?.toLowerCase() === mapCategory.value)
})

const fetchAllVendorsForMap = async () => {
  loadingAllVendors.value = true
  try {
    const res = await vendors_api.getAll({ limit: 100 })
    const fetched = res.data?.vendors || res.data?.data?.vendors || res.data || []
    allVendors.value = fetched
  } catch (e) {
    console.error('Failed to fetch vendors for map:', e)
  } finally {
    loadingAllVendors.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchAllVendorsForMap()
  headingTimer = setInterval(() => {
    currentHeadingIndex.value = (currentHeadingIndex.value + 1) % heroHeadings.length
  }, 3500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (headingTimer) clearInterval(headingTimer)
})

// Data for Features Grid
const toolkitFeatures = [
  {
    title: 'Product & Service Management',
    description: 'Upload delicious dishes or list your services, manage variations, set prices, and configure your availability calendar instantly.',
    icon: ClipboardList
  },
  {
    title: 'Live Orders & Appointments',
    description: 'Accept, prepare, and dispatch orders or manage bookings in real-time. Hear loud ringtones for new requests so you never miss a sale.',
    icon: Activity
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track daily revenue, identify your top-selling items or services, and view success rates to scale your business smartly.',
    icon: PieChart
  },
  {
    title: 'Instant Setup',
    description: 'Create your vendor profile, add your payout bank account, and start receiving orders and appointments from students in under 5 minutes.',
    icon: Store
  }
]

// Data for Testimonials
const successStories = [
  { id: 1, quote: 'Joining Errander doubled our daily orders. Reaching students directly in their hostels was a game changer for our weekend sales.', name: 'Chef Tunde', restaurant: 'Campus Grill House', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop' },
  { id: 2, quote: 'The instant payout feature is incredible. Cash flow is crucial for our inventory, and Errander makes it seamless.', name: 'Sarah', restaurant: 'Fresh Bites Bakery', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop' },
  { id: 3, quote: 'The calendar system is a lifesaver. Students now book their hair appointments ahead of time, and my salon is never overcrowded.', name: 'Adeola', restaurant: 'Glow Beauty Studio', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop' },
  { id: 4, quote: 'Managing services and physical products in one place is so easy. If we are fully booked, I just toggle it off on my phone in 2 seconds.', name: 'Mama Nkechi', restaurant: 'Nkechi Foods & Spa', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop' },
]
</script>

<style scoped>
.outline-text {
  -webkit-text-stroke: 1px white;
  color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: all 0.5s ease;
}
.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
