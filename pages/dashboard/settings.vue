<template>
 <div class="py-5 pb-10 container mx-auto animate-fade-in space-y-6 w-full">
 <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
 <div>
 <h1 class="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">Merchant Settings</h1>
 <p class="text-sm text-gray-400 font-medium mt-1">Fine-tune your store profile, operations, and financial preferences.</p>
 </div>
 <div class="flex flex-wrap items-center gap-3">
 <button 
 @click="saveProfile" 
 :disabled="savingProfile" 
 class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 active:scale-95 bg-gray-900 text-white hover:bg-black hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <Loader2 v-if="savingProfile" class="animate-spin w-4 h-4" />
 {{ savingProfile ? 'Saving...' : 'Save All Changes' }}
 </button>
 </div>
 </header>

 <!-- Horizontal Navigation Tabs -->
 <div class="flex gap-1.5 bg-gray-50 rounded-xl p-1 mb-8 w-fit overflow-x-auto no-scrollbar sticky top-0 z-30">
 <button 
 @click="activeTab = 'profile'" 
 class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold border-none transition-all whitespace-nowrap"
 :class="activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'"
 >
 <StoreIcon class="w-4 h-4" :class="activeTab === 'profile' ? 'text-[#FF5C1A]' : 'text-gray-400'" />
 Store Identity
 </button>
 <button 
 @click="activeTab = 'operations'" 
 class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold border-none transition-all whitespace-nowrap"
 :class="activeTab === 'operations' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'"
 >
 <Clock class="w-4 h-4" :class="activeTab === 'operations' ? 'text-amber-500' : 'text-gray-400'" />
 {{ isServiceProvider ? 'Scheduling & Status' : 'Operations & Status' }}
 </button>
 <button 
 @click="activeTab = 'financials'" 
 class="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold border-none transition-all whitespace-nowrap"
 :class="activeTab === 'financials' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'"
 >
 <CreditCard class="w-4 h-4" :class="activeTab === 'financials' ? 'text-emerald-500' : 'text-gray-400'" />
 Payout Methods
 </button>
 </div>

 <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
 <div class="hidden lg:block lg:col-span-1 space-y-4">
 <div v-for="i in 3" :key="i" class="bg-gray-50 h-10 rounded-lg animate-pulse" />
 </div>
 <div class="col-span-1 lg:col-span-3 space-y-5 md:space-y-8">
 <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl animate-pulse h-[400px]" />
 </div>
 </div>

 <div v-else class="w-full relative items-start mt-4 sm:mt-0">
 
 <!-- Content Container -->
 <div class="w-full min-w-0 pb-32">
 
 <!-- SECTION: STORE IDENTITY -->
 <section v-if="activeTab === 'profile'" id="store-identity" class="animate-fade-in space-y-5 md:space-y-8 relative">
 
 <div class="space-y-1 px-4 lg:px-0 pt-6 lg:pt-0">
 <h3 class="text-xl font-bold text-gray-900 flex items-center gap-3">
 Store Identity
 </h3>
 <p class="text-sm text-gray-500">Manage how your brand appears on the student app.</p>
 </div>
 
 <div class="bg-white rounded-[14px] border border-[#f0f0f0] relative px-4 py-4 md:py-8 lg:p-4 md:p-8 space-y-5 md:space-y-8 sm:space-y-4 md:space-y-6 md:space-y-10 hover:border-[#e0e0e0] transition-colors">
 <!-- Branding -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
 <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 md:gap-6">
 <div class="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-50 flex items-center justify-center shrink-0 group/logo relative ">
 <video v-if="profile.logo && profile.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
 <img v-else-if="profile.logo" :src="profile.logo" class="w-full h-full object-cover" />
 <ImageIcon v-else class="w-8 h-8 text-gray-300" />
 <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
 <Upload class="w-6 h-6 text-white" />
 </div>
 <input type="file" ref="logoInput" accept="image/*,video/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleLogoUpload" />
 </div>
 <div>
 <h4 class="text-sm font-bold text-gray-900 mb-1">Store Logo</h4>
 <p class="text-sm text-gray-500 font-medium leading-relaxed">Square PNG/JPG<br/>Max 5MB</p>
 <p v-if="logoUploading" class="text-sm text-[#FF5C1A] font-bold mt-2 animate-pulse">UPLOADING...</p>
 </div>
 </div>

 <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 md:gap-6">
 <div class="w-full sm:w-32 h-32 sm:h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-50 flex items-center justify-center shrink-0 group/banner relative ">
 <video v-if="profile.banner && profile.banner.match(/\.(mp4|webm|ogg|mov)$/i)" :src="profile.banner" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
 <img v-else-if="profile.banner" :src="profile.banner" class="w-full h-full object-cover" />
 <ImageIcon v-else class="w-8 h-8 text-gray-300" />
 <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
 <Upload class="w-6 h-6 text-white" />
 </div>
 <input type="file" ref="bannerInput" accept="image/*,video/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleBannerUpload" />
 </div>
 <div>
 <h4 class="text-sm font-bold text-gray-900 mb-1">Store Cover</h4>
 <p class="text-sm text-gray-500 font-medium leading-relaxed">Landscape<br/>Max 10MB</p>
 <p v-if="bannerUploading" class="text-sm text-[#FF5C1A] font-bold mt-2 animate-pulse">UPLOADING...</p>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
 <AnimatedInput v-model="profile.storeName" label="Business Name" :description="isServiceProvider ? 'e.g. Glam by Sarah' : 'e.g. Gourmet Burger Central'" required />
 <SelectInput v-model="profile.category" :label="isServiceProvider ? 'Business Category' : 'Category'" :options="filteredCategoryOptions" :allowCustom="true" required />
 </div>

 <!-- Unique Store Web Address / Custom Domain Card -->
 <div class="p-5 md:p-6 bg-gradient-to-br from-orange-50/40 via-white to-gray-50/70 rounded-2xl border border-orange-100/80 space-y-4">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center shrink-0">
 <Globe class="w-5 h-5" />
 </div>
 <div>
 <h4 class="text-sm font-bold text-gray-900">Unique Store Web Address</h4>
 <p class="text-xs text-gray-500 font-medium">Your branded storefront domain for direct student visits & marketing</p>
 </div>
 </div>
 <div v-if="profile.subdomain" class="flex items-center gap-2">
 <a 
 :href="'https://' + profile.subdomain + '.erranders.org'" 
 target="_blank" 
 class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
 >
 <span>Visit Store</span>
 <ExternalLink class="w-3.5 h-3.5 text-gray-400" />
 </a>
 <button 
 type="button" 
 @click="copyStoreUrl" 
 class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
 :class="copiedDomain ? 'bg-emerald-600 text-white' : 'bg-gray-900 hover:bg-black text-white'"
 >
 <Check v-if="copiedDomain" class="w-3.5 h-3.5" />
 <Copy v-else class="w-3.5 h-3.5" />
 <span>{{ copiedDomain ? 'Copied Link!' : 'Copy Link' }}</span>
 </button>
 </div>
 </div>

 <div class="space-y-2 pt-2">
 <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 pl-1">Store Domain</label>
 <div class="relative flex items-center">
 <span class="absolute left-3.5 text-xs font-mono font-medium text-gray-400 select-none">https://</span>
 <input 
 v-model="profile.subdomain" 
 @input="onSubdomainInput" 
 type="text" 
 placeholder="your-brand-name" 
 class="w-full pl-[4.5rem] pr-36 py-3 rounded-xl border text-sm font-semibold text-gray-900 transition-all focus:outline-none"
 :class="subdomainAvailable === false ? 'border-red-300 bg-red-50/20' : subdomainAvailable === true ? 'border-emerald-300 bg-emerald-50/20' : 'border-gray-200 bg-white focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/10'"
 />
 <span class="absolute right-3.5 text-xs font-mono font-bold text-[#FF5C1A] select-none">.erranders.org</span>
 </div>

 <div class="flex items-center gap-2 pt-1 min-h-[20px]">
 <div v-if="checkingSubdomain" class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
 <Loader2 class="w-3.5 h-3.5 animate-spin text-[#FF5C1A]" />
 <span>Checking domain availability...</span>
 </div>
 <div v-else-if="subdomainAvailable === true && profile.subdomain !== initialSubdomain" class="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
 <CheckCircle class="w-3.5 h-3.5" />
 <span>https://{{ profile.subdomain }}.erranders.org is available!</span>
 </div>
 <div v-else-if="subdomainAvailable === false" class="flex items-center gap-1.5 text-xs font-bold text-red-500">
 <AlertCircle class="w-3.5 h-3.5" />
 <span>https://{{ profile.subdomain }}.erranders.org is already taken.</span>
 </div>
 <p v-else class="text-xs text-gray-400 font-medium">
 Live Storefront URL: <strong class="text-gray-700">https://{{ profile.subdomain || 'your-brand' }}.erranders.org</strong>
 </p>
 </div>
 </div>
 </div>
 
 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 pt-4 border-t border-gray-100">
 <SelectInput 
 v-model="profile.businessType" 
 label="Business Model" 
 :options="[
 { value: 'physical_product', label: 'Physical Products (Goods)' },
 { value: 'service_provider', label: 'Service Provider (Appointments)' },
 { value: 'hybrid', label: 'Hybrid (Goods & Services)' }
 ]" 
 required 
 />
 <SelectInput 
 v-model="profile.vendorType" 
 label="Store Format" 
 :options="[
 { value: 'single-category', label: 'Single Category / Specialty' },
 { value: 'restaurant', label: 'Restaurant / Eatery' },
 { value: 'mini-mart', label: 'Mini-Mart / Grocery' }
 ]" 
 required 
 />
 </div>
 
 <AnimatedInput v-model="profile.description" type="textarea" :label="isServiceProvider ? 'Business Bio' : 'Store Bio'" :description="isServiceProvider ? 'Tell students about your services and expertise...' : 'Describe what makes your products special...'" />
 
 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
 <div class="relative">
 <label class="block text-sm font-bold text-gray-400 mb-1.5 pl-2 uppercase tracking-wider">Street Address</label>
 <UiMapboxAutocomplete 
 v-model="profile.address" 
 @select="handleAddressSelect" 
 placeholder="Specific location for pickups..." 
 />
 </div>
 <div class="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-50 h-full mt-2 md:mt-0">
 <div class="flex items-center gap-3">
 <div class="p-2 bg-white rounded-lg text-[#FF5C1A] ">
 <Building class="w-4 h-4" />
 </div>
 <span class="text-sm font-bold text-gray-800">Inside Campus</span>
 </div>
 <input type="checkbox" v-model="profile.isInsideCampus" class="w-5 h-5 rounded-lg border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]" />
 </div>
 </div>

 <!-- Campus - read only, fixed by the account -->
 <div v-if="campus" class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-50">
 <div class="flex items-center gap-3 min-w-0 flex-1">
 <div class="p-2 bg-white rounded-lg text-[#FF5C1A] shrink-0">
 <MapPin class="w-4 h-4" />
 </div>
 <div class="min-w-0">
 <div class="flex items-center gap-2 flex-wrap">
 <span v-if="campus.shortName" class="text-[10px] font-bold uppercase tracking-wider text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded-md">{{ campus.shortName }}</span>
 <span class="text-sm font-bold text-gray-800 truncate">{{ campus.name }}</span>
 </div>
 <p v-if="campusLocation" class="text-[12px] font-medium text-gray-500 mt-0.5">{{ campusLocation }}</p>
 </div>
 </div>
 <p class="text-[12px] font-medium text-gray-400 sm:text-right sm:max-w-[220px] shrink-0">
 Your store operates on this campus only. The campus is fixed by your account and cannot be changed here.
 </p>
 </div>
 </div>

 <!-- Payout account summary: the bank details belong on the profile, not only
      behind a tab the owner has to know about. -->
 <div class="bg-white rounded-[14px] border border-[#f0f0f0] px-4 py-4 md:p-6">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h4 class="text-base font-bold text-gray-900 flex items-center gap-2">
 <CreditCard class="w-4 h-4 text-emerald-500" /> Payout account
 </h4>
 <p class="text-sm text-gray-500 mt-0.5">Where your earnings are sent.</p>
 </div>
 <button @click="activeTab = 'financials'" class="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors self-start sm:self-auto">
 Manage
 </button>
 </div>

 <div v-if="payoutLoading" class="mt-4 flex items-center gap-2 text-sm text-gray-400">
 <span class="w-3 h-3 rounded-full border-2 border-gray-200 border-t-emerald-500 animate-spin"></span>
 Loading your bank details…
 </div>

 <div v-else-if="payoutLoadError" class="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between gap-4">
 <p class="text-sm font-semibold text-amber-800">{{ payoutLoadError }}</p>
 <button @click="retryPayoutLoad" class="text-sm font-bold text-amber-900 underline whitespace-nowrap">Retry</button>
 </div>

 <div v-else-if="activePayoutAccount" class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
 <div>
 <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">{{ activePayoutAccount.bankName }}</p>
 <p class="text-lg font-bold text-gray-900 font-mono tracking-tight">{{ maskAccountNumber(activePayoutAccount.accountNumber) }}</p>
 <p class="text-sm text-gray-600 font-medium">{{ activePayoutAccount.accountName }}</p>
 </div>
 <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">Active</span>
 </div>

 <p v-else class="mt-4 text-sm text-gray-500">
 No payout account yet. <button @click="activeTab = 'financials'" class="font-bold text-[#FF5C1A] hover:underline">Link a bank account</button> so your earnings can be paid out.
 </p>
 </div>
 </section>

 <!-- SECTION: OPERATIONS -->
 <section v-if="activeTab === 'operations'" id="operations" class="animate-fade-in space-y-5 md:space-y-8 relative">
 
 <div class="space-y-1 px-4 lg:px-0 pt-8 lg:pt-0">
 <h3 class="text-xl font-bold text-gray-900 flex items-center gap-3">
 {{ isServiceProvider ? 'Scheduling & Status' : 'Operations & Status' }}
 </h3>
 <p class="text-sm text-gray-500">Configure your availability and service windows.</p>
 </div>

 <!-- Live Status -->
 <div class="bg-gray-900 lg:rounded-xl md:rounded-3xl p-4 md:p-6 lg:p-4 md:p-8 text-white relative overflow-hidden group lg: shadow-gray-900/10 rounded-none">
 <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl opacity-0 transition-opacity duration-1000" :class="{ 'opacity-100': isOnline }" />
 
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-6 relative z-10">
 <div>
 <h3 class="text-xl font-bold mb-2">Live Status</h3>
 <div v-if="isOnline" class="flex items-center gap-2 text-emerald-400">
 <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
 <span class="text-sm font-bold tracking-wide">ONLINE & ACCEPTING ORDERS</span>
 </div>
 <div v-else class="flex items-center gap-2 text-gray-400">
 <div class="w-2 h-2 rounded-full bg-gray-500" />
 <span class="text-sm font-bold tracking-wide">OFFLINE</span>
 </div>
 </div>
 <button 
 @click="toggleOnline" 
 :disabled="togglingOnline"
 class="relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-500 ease-in-out"
 :class="isOnline ? 'bg-emerald-500' : 'bg-gray-800'"
 >
 <div 
 class="w-6 h-6 bg-white rounded-full transition-transform duration-500 ease-in-out transform"
 :class="isOnline ? 'translate-x-6' : 'translate-x-0'" 
 />
 </button>
 </div>
 <p class="text-sm text-gray-400 font-medium leading-relaxed mt-6 relative z-10 max-w-lg">
 When toggled ON, students can browse your menu and place new orders. Always remember to toggle OFF when you close or take a break to avoid unfulfilled orders.
 </p>
 </div>
 
 <div class="bg-white rounded-[14px] border border-[#f0f0f0] overflow-hidden px-4 py-4 md:py-8 lg:p-4 md:p-8 space-y-5 md:space-y-8 sm:space-y-4 md:space-y-6 md:space-y-10 hover:border-[#e0e0e0] transition-colors">
 <div class="flex items-center justify-between">
 <h4 class="text-base font-bold text-gray-900">Service Configuration</h4>
 <button 
 @click="saveHours" 
 :disabled="savingHours" 
 class="text-sm font-bold text-[#FF5C1A] hover:text-orange-700 transition-colors flex items-center gap-2"
 >
 <Loader2 v-if="savingHours" class="animate-spin w-4 h-4" />
 {{ savingHours ? 'Syncing...' : 'Quick Sync' }}
 </button>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
 <div class="flex flex-col gap-2">
 <label class="text-sm font-bold text-gray-700">Opens At</label>
 <input v-model="profile.operatingHours.open" type="time" @change="syncHoursToWeekly" class="px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:ring-2 focus:ring-[#FF5C1A] outline-none transition-all w-full font-bold" />
 </div>
 <div class="flex flex-col gap-2">
 <label class="text-sm font-bold text-gray-700">Closes At</label>
 <input v-model="profile.operatingHours.close" type="time" @change="syncHoursToWeekly" class="px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:ring-2 focus:ring-[#FF5C1A] outline-none transition-all w-full font-bold" />
 </div>
 </div>

 <!-- Capability Flags (Chowdeck Model vs Retail) -->
 <div class="space-y-3 pt-6 border-t border-gray-50">
 <div 
 class="rounded-md border transition-all duration-300"
 :class="profile.requiresPrepTime ? 'bg-[#FF5C1A]/5 border-[#FF5C1A]/30' : 'bg-gray-50/80 border-gray-100 hover:border-gray-200'"
 >
 <div 
 @click="profile.requiresPrepTime = !profile.requiresPrepTime"
 class="flex items-center gap-3 p-4 cursor-pointer"
 >
 <div class="flex-1 min-w-0">
 <div class="flex items-center gap-1.5">
 <p class="text-sm font-bold text-gray-800">Requires Prep Time per item</p>
 </div>
 <p class="text-[12px] text-gray-500 font-medium mt-0.5">Turn on if items take time to make/prepare to order</p>
 </div>
 <div 
 class="w-11 h-6 rounded-full p-0.5 transition-all duration-300 shrink-0"
 :class="profile.requiresPrepTime ? 'bg-[#FF5C1A]' : 'bg-gray-200'"
 >
 <div 
 class="w-5 h-5 bg-white rounded-full transition-all duration-300 "
 :class="profile.requiresPrepTime ? 'translate-x-5' : 'translate-x-0'"
 ></div>
 </div>
 </div>
 </div>

 <div 
 class="rounded-md border transition-all duration-300"
 :class="profile.requiresTakeawayPack ? 'bg-[#FF5C1A]/5 border-[#FF5C1A]/30' : 'bg-gray-50/80 border-gray-100 hover:border-gray-200'"
 >
 <div 
 @click="profile.requiresTakeawayPack = !profile.requiresTakeawayPack"
 class="flex items-center gap-3 p-4 cursor-pointer"
 >
 <div class="flex-1 min-w-0">
 <div class="flex items-center gap-1.5">
 <p class="text-sm font-bold text-gray-800">Requires Takeaway Packs</p>
 </div>
 <p class="text-[12px] text-gray-500 font-medium mt-0.5">Turn on if you charge for extra packaging</p>
 </div>
 <div 
 class="w-11 h-6 rounded-full p-0.5 transition-all duration-300 shrink-0"
 :class="profile.requiresTakeawayPack ? 'bg-[#FF5C1A]' : 'bg-gray-200'"
 >
 <div 
 class="w-5 h-5 bg-white rounded-full transition-all duration-300 "
 :class="profile.requiresTakeawayPack ? 'translate-x-5' : 'translate-x-0'"
 ></div>
 </div>
 </div>
 </div>
 </div>

 <!-- Only show Prep Time if it requires prep time (or Service Provider) -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6" v-if="profile.requiresPrepTime || isServiceProvider">
 <AnimatedInput v-model.number="profile.preparationTime" type="number" :label="isServiceProvider ? 'Buffer Time (min)' : 'Prep Window (min)'" :description="isServiceProvider ? 'Time between appointments' : 'Avg. time to cook'" />
 <AnimatedInput v-if="!isServiceProvider" v-model.number="profile.minimumOrder" type="number" label="Min. Order (₦)" description="Optional threshold" />
 </div>

 <!-- Packaging -->
 <div v-if="!isServiceProvider" class="space-y-4 md:space-y-6 pt-6 border-t border-gray-50">
 <div class="flex items-center justify-between">
 <div>
 <h4 class="text-sm font-bold text-gray-900">Packaging Options</h4>
 <p class="text-sm text-gray-500 mt-0.5">{{ profile.requiresTakeawayPack ? 'Manage container and pack pricing for food.' : 'Set your flat packaging or wrapping fee.' }}</p>
 </div>
 <button 
 v-if="profile.requiresTakeawayPack"
 @click="addPack" 
 class="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-all border border-gray-25"
 >
 <Plus class="w-4 h-4" />
 </button>
 </div>

 <!-- Fashion / Retail View (Single Flat Fee) -->
 <div v-if="!profile.requiresTakeawayPack">
 <AnimatedInput 
 v-if="profile.packs && profile.packs.length > 0" 
 v-model.number="profile.packs[0].price" 
 type="number" 
 label="Base Packaging Fee (₦)" 
 description="Applied once per order"
 />
 </div>

 <!-- Food Vendor View (Multiple Packs) -->
 <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div v-for="(pack, index) in profile.packs" :key="index" class="p-4 sm:p-5 rounded-2xl border border-gray-50 bg-gray-50/50 space-y-4 relative group/pack hover:border-blue-200 transition-colors">
 <button 
 v-if="profile.packs.length > 1"
 @click="removePack(index)" 
 class="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover/pack:opacity-100 transition-all"
 >
 <Trash2 class="w-4 h-4" />
 </button>
 <AnimatedInput v-model="pack.name" label="Pack Name" placeholder="e.g. Standard Plastic Pack" />
 <div class="flex items-center gap-4">
 <div class="flex-1">
 <AnimatedInput v-model.number="pack.price" type="number" label="Price (₦)" />
 </div>
 <div class="flex flex-col items-center gap-2 pt-2">
 <span class="text-sm font-bold text-gray-500">Active</span>
 <input type="checkbox" v-model="pack.isActive" class="w-5 h-5 rounded-lg border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]" />
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Weekly Schedule Redesign -->
 <div class="space-y-4 md:space-y-6 pt-6 border-t border-gray-50">
 <div>
 <h4 class="text-sm font-bold text-gray-900">Weekly Schedule</h4>
 <p class="text-sm text-gray-500 mt-0.5">Toggle days on/off and set specific hours and breaks.</p>
 </div>
 
 <div class="space-y-2">
 <div v-for="(bh, i) in profile.businessHours" :key="bh.day" class="p-4 rounded-2xl border transition-all flex flex-col gap-4" :class="bh.isClosed ? 'border-transparent bg-gray-50' : 'border-gray-200 bg-white '">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
   <div class="flex items-center gap-4">
     <input type="checkbox" :checked="!bh.isClosed" @change="bh.isClosed = !($event.target as HTMLInputElement).checked" class="w-5 h-5 rounded border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]" />
     <span class="text-sm font-bold text-gray-900 capitalize w-20">{{ bh.day }}</span>
   </div>
   
   <div class="flex items-center gap-3 transition-opacity duration-300" :class="bh.isClosed ? 'opacity-30 pointer-events-none' : 'opacity-100'">
     <input type="time" v-model="bh.open" :disabled="bh.isClosed" class="text-base font-bold px-4 py-2.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 outline-none w-32" />
     <span class="text-gray-400 font-bold text-sm">to</span>
     <input type="time" v-model="bh.close" :disabled="bh.isClosed" class="text-base font-bold px-4 py-2.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 outline-none w-32" />
   </div>
 </div>

 <!-- Day-Specific Breaks -->
 <div v-if="!bh.isClosed" class="pl-0 sm:pl-[6.5rem] space-y-3 pt-2">
   <div class="flex items-center justify-between">
     <span class="text-sm font-bold text-orange-500 uppercase tracking-wider">Automated Breaks</span>
     <button @click="addBreak(i)" class="text-sm font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
       + Add Break
     </button>
   </div>
   
   <div v-for="(b, bIndex) in bh.breaks" :key="bIndex" class="flex flex-wrap items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100 relative group">
     <input type="text" v-model="b.title" placeholder="e.g. Lunch Break" class="text-sm font-medium px-3 py-2 bg-white rounded-lg border-transparent focus:bg-white focus:border-orange-200 focus:ring-0 outline-none flex-1 min-w-[120px]" />
     <input type="time" v-model="b.start" class="text-sm font-bold px-3 py-2 bg-white rounded-lg border-transparent focus:bg-white focus:border-orange-200 focus:ring-0 outline-none w-28" />
     <span class="text-orange-300 font-bold text-sm">to</span>
     <input type="time" v-model="b.end" class="text-sm font-bold px-3 py-2 bg-white rounded-lg border-transparent focus:bg-white focus:border-orange-200 focus:ring-0 outline-none w-28" />
     
     <button @click="removeBreak(i, bIndex)" class="p-1.5 text-orange-300 hover:text-orange-500 hover:bg-orange-100 rounded-lg transition-colors absolute -right-2 -top-2 bg-white shadow-sm border border-orange-100 opacity-0 group-hover:opacity-100" title="Remove Break">
       <X class="w-3.5 h-3.5" />
     </button>
   </div>
 </div>
 
 </div>
 </div>
 </div>


 </div>
 </section>

 <!-- SECTION: PAYOUTS -->
 <section v-if="activeTab === 'financials'" id="payouts" class="animate-fade-in space-y-5 md:space-y-8 relative">
 
 <div class="space-y-1 px-4 lg:px-0 pt-8 lg:pt-0 flex items-center justify-between">
 <div>
 <h3 class="text-xl font-bold text-gray-900 flex items-center gap-3">
 Payout Methods
 </h3>
 <p class="text-sm text-gray-500">Manage your connected bank accounts and withdrawal preferences.</p>
 </div>
 </div>

 <div class="bg-white rounded-[14px] border border-[#f0f0f0] px-4 py-4 md:py-8 lg:p-4 md:p-8 space-y-5 md:space-y-8 hover:border-[#e0e0e0] transition-colors">
 <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <h4 class="text-base font-bold text-gray-900">Linked Accounts</h4>
 <button @click="openAddAccount" class="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
 <Plus class="w-4 h-4" /> Link New Bank
 </button>
 </div>

 <!-- Account List -->
 <div v-if="payoutAccounts.length === 0" class="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
 <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-50 text-gray-400 mb-4">
 <CreditCard class="w-6 h-6" />
 </div>
 <p class="text-base font-bold text-gray-900">No bank accounts linked</p>
 <p class="text-sm text-gray-500 mt-1 mb-4">You need a linked account to receive payouts.</p>
 <button @click="openAddAccount" class="text-sm font-bold text-[#FF5C1A] hover:text-orange-700 underline">Add one now</button>
 </div>

 <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div 
 v-for="acc in payoutAccounts" 
 :key="acc.accountNumber"
 class="p-5 rounded-2xl border transition-all cursor-pointer relative group/acc flex flex-col"
 :class="acc.isActive ? 'border-emerald-500 bg-emerald-50/20 ' : 'border-gray-100 bg-white hover:border-gray-200'"
 @click="setActiveAccount(acc)"
 >
 <div class="flex items-start justify-between mb-4">
 <div class="p-2.5 rounded-xl" :class="acc.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'">
 <Building class="w-5 h-5" />
 </div>
 <div v-if="acc.isActive" class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">
 <CheckCircle class="w-3 h-3" /> Active
 </div>
 <button 
 v-else 
 @click.stop="deletePayoutAccount(acc)"
 class="opacity-0 group-hover/acc:opacity-100 p-2 bg-white rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all absolute top-4 right-4"
 >
 <Trash2 class="w-4 h-4" />
 </button>
 </div>
 
 <div class="mt-auto">
 <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{{ acc.bankName }}</p>
 <p class="text-lg font-bold text-gray-900 font-mono tracking-tight">{{ maskAccountNumber(acc.accountNumber) }}</p>
 <p class="text-sm text-gray-600 font-medium mt-1 truncate">{{ acc.accountName }}</p>
 </div>
 </div>
 </div>

 <div class="pt-8 border-t border-gray-50">
 <h4 class="text-base font-bold text-gray-900 mb-2">Withdrawal Cycle</h4>
 <p class="text-sm text-gray-500 mb-4">Standard processing fees may apply for daily settlements. Weekly and monthly settlements are completely free.</p>
 <div class="flex flex-wrap gap-3">
 <button 
 v-for="pref in ['manual', 'daily', 'weekly', 'monthly']" 
 :key="pref"
 @click="updatePayoutPref(pref)"
 class="px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all border capitalize"
 :class="payoutPreference === pref ? 'bg-gray-900 text-white border-gray-25' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'"
 >
 {{ pref }}
 </button>
 </div>
 </div>

 <div class="pt-8 border-t border-gray-50">
 <h4 class="text-base font-bold text-gray-900 mb-4">Account Purposes</h4>
 <p class="text-sm text-gray-500 mb-4">Manage categories for splitting your funds across bank accounts.</p>
 <div class="flex flex-wrap gap-2">
 <div v-for="(purpose, index) in profile.accountPurposes" :key="index" class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-50">
 <span class="text-sm font-medium text-gray-700">{{ purpose }}</span>
 <button v-if="purpose !== 'Default / General'" @click="removeAccountPurpose(index)" class="text-gray-400 hover:text-rose-500 transition-colors">
 <X class="w-4 h-4" />
 </button>
 </div>
 </div>
 <div class="mt-4 flex gap-2">
 <div class="flex-1">
 <AnimatedInput v-model="newPurposeText" placeholder="Add new purpose..." />
 </div>
 <button @click="addAccountPurpose" type="button" class="px-5 py-3 h-14 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Add</button>
 </div>
 </div>
 </div>
 </section>

 </div>
 </div>

 <!-- Add Account Drawer -->
 <SideDrawer 
 :isOpen="isAccountDrawerOpen" 
 title="Link Bank Account"
 subtitle="Enter your NUBAN details to secure your payouts."
 @close="isAccountDrawerOpen = false"
 >
 <div class="space-y-5 md:space-y-8 py-4">
 <SelectInput 
 v-model="newAccount.bankCode" 
 label="Financial Institution" 
 :options="bankOptions" 
 :disabled="banksLoading"
 info="Choose your primary bank."
 @update:model-value="onBankSelect"
 />
 
 <div class="relative">
 <AnimatedInput 
 v-model="newAccount.accountNumber" 
 label="Account Number" 
 info="Enter your 10-digit NUBAN."
 description="e.g. 0123456789"
 @update:model-value="onAccountChange"
 />
 <div v-if="resolvingAccount" class="absolute right-4 top-1/2 -translate-y-1/2">
 <Loader2 class="animate-spin w-4 h-4 text-[#FF5C1A]" />
 </div>
 </div>

 <SelectInput 
 v-model="newAccount.purpose" 
 label="Account Purpose (Optional)" 
 :options="dynamicAccountPurposes" 
 :allowCustom="true"
 info="Categorize this account to split your funds correctly."
 />

 <div v-if="newAccount.accountName" class="p-5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4 animate-fade-in">
 <div class="p-3 bg-white rounded-xl text-emerald-600 ">
 <CheckCircle class="w-5 h-5" />
 </div>
 <div>
 <p class="text-sm text-emerald-700 font-bold uppercase tracking-wider mb-0.5">Verified Identity</p>
 <p class="text-sm font-bold text-gray-900">{{ newAccount.accountName }}</p>
 </div>
 </div>

 <div v-if="resolveError" class="p-5 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-4 animate-fade-in">
 <div class="p-3 bg-white rounded-xl text-rose-500 ">
 <AlertCircle class="w-5 h-5" />
 </div>
 <div>
 <p class="text-sm text-rose-700 font-bold uppercase tracking-wider mb-0.5">Verification Failed</p>
 <p class="text-sm font-bold text-gray-900">{{ resolveError }}</p>
 </div>
 </div>
 </div>

 <template #footer>
 <div class="flex items-center gap-4 w-full">
 <button @click="isAccountDrawerOpen = false" class="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-transparent text-gray-600 font-bold rounded-xl transition-colors">Cancel</button>
 <button 
 @click="saveNewAccount" 
 :disabled="!isAccountVerified || savingBank" 
 class="flex-[2] py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-gray-900/20"
 >
 <Loader2 v-if="savingBank" class="animate-spin w-4 h-4" />
 Link Account
 </button>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { 
 Store as StoreIcon, ImageIcon, Upload, Clock, 
 CreditCard, Power, Loader2, CheckCircle, 
 AlertCircle, Building, Plus, Trash2, X, MapPin,
 Globe, ExternalLink, Copy, Check
} from 'lucide-vue-next';
import { vendors_api } from '@/api_factory/modules/vendors';
import { payments_api } from '@/api_factory/modules/payments';
import { useWallet } from '@/composables/modules/wallets';
import { useCustomToast } from '@/composables/core/useCustomToast';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { useVendorProfile } from '@/composables/modules/vendors';
import { useUser } from '@/composables/modules/auth/user';
import { institutions_api, institutionRefFrom, type Institution } from '@/api_factory/modules/institutions';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Settings - Errander Vendor' });

const { showToast } = useCustomToast();
const { wallet, updatePreferences, fetchWallet } = useWallet();
const { user } = useUser();

// The campus the store is pinned to. Read-only: a vendor cannot switch campus,
// so there is deliberately no picker here — only a confirmation of the account.
const campus = ref<Institution | null>(null);

const campusLocation = computed(() => {
 if (!campus.value) return '';
 return [campus.value.city, campus.value.state].filter(Boolean).join(', ')
 || campus.value.country
 || '';
});

const loadCampus = async () => {
 const populated = (user.value as any)?.institution;

 // The signed-in payload sometimes already carries the whole campus document.
 if (populated && typeof populated === 'object' && populated.name) {
 campus.value = populated as Institution;
 return;
 }

 const ref_ = institutionRefFrom(populated);
 // No campus on the account - render nothing and send no header.
 if (!ref_) return;

 try {
 const res: any = await institutions_api.get(ref_);
 const data = res?.data?.data || res?.data;
 if (data && data.name) campus.value = data as Institution;
 } catch (e) {
 // A campus that cannot be loaded simply hides the row; the store keeps working.
 }
};

const activeTab = ref('profile');

const loading = ref(true);
const vendorId = ref('');
const isOnline = ref(false);
const isServiceProvider = computed(() => profile.businessType === 'service_provider');
const { isFoodVendor } = useVendorProfile();
const togglingOnline = ref(false);
const savingProfile = ref(false);
const savingHours = ref(false);
const savingBank = ref(false);
const logoUploading = ref(false);
const logoInput = ref<HTMLInputElement | null>(null);
const bannerUploading = ref(false);
const bannerInput = ref<HTMLInputElement | null>(null);

const profile = reactive({
 businessType: '',
 vendorType: '',
 storeName: '',
 subdomain: '',
 description: '',
 category: '',
 address: '',
 location: { type: 'Point', coordinates: [0, 0] } as { type: string, coordinates: number[] },
 logo: '',
 banner: '',
 isInsideCampus: false,
 requiresPrepTime: false,
 requiresTakeawayPack: false,
 operatingHours: { open: '08:00', close: '20:00' },
 preparationTime: 15,
 minimumOrder: 0,
 packs: [
 { name: 'Standard Pack', price: 300, isActive: true }
 ],
 businessHours: [
 { day: 'monday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'tuesday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'wednesday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'thursday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'friday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'saturday', open: '08:00', close: '21:00', isClosed: false, breaks: [] as {start: string, end: string, title?: string}[] },
 { day: 'sunday', open: '08:00', close: '21:00', isClosed: true, breaks: [] as {start: string, end: string, title?: string}[] },
 ],
 accountPurposes: ['Default / General'] as string[]
});

const addBreak = (dayIndex: number) => {
  if (!profile.businessHours[dayIndex].breaks) {
    profile.businessHours[dayIndex].breaks = [];
  }
  profile.businessHours[dayIndex].breaks.push({
    title: '',
    start: '12:00',
    end: '13:00'
  });
};

const removeBreak = (dayIndex: number, breakIndex: number) => {
  profile.businessHours[dayIndex].breaks.splice(breakIndex, 1);
};

const payoutPreference = ref('manual');
interface PayoutAccount {
 bankCode: string;
 bankName: string;
 accountNumber: string;
 accountName: string;
 isActive: boolean;
 purpose?: string;
}
const payoutAccounts = ref<PayoutAccount[]>([]);
// A failed request used to render the empty state, which tells a vendor their bank details
// are gone. Track the failure separately so we can say what actually happened.
const payoutLoading = ref(true);
const payoutLoadError = ref('');

const isAccountDrawerOpen = ref(false);
const newAccount = reactive({ bankCode: '', bankName: '', accountNumber: '', accountName: '', purpose: 'default' });
const bankOptions = ref<{ label: string; value: string }[]>([]);
const banksLoading = ref(false);
const resolvingAccount = ref(false);
const isAccountVerified = ref(false);
const resolveError = ref('');

const newPurposeText = ref('');
const addAccountPurpose = () => {
 const val = newPurposeText.value.trim();
 if (val && !profile.accountPurposes.includes(val)) {
 profile.accountPurposes.push(val);
 newPurposeText.value = '';
 }
};
const removeAccountPurpose = (index: number) => {
 if (profile.accountPurposes[index] !== 'Default / General') {
 profile.accountPurposes.splice(index, 1);
 }
};

const syncHoursToWeekly = () => {
 profile.businessHours.forEach(bh => {
 if (!bh.isClosed) {
 bh.open = profile.operatingHours.open;
 bh.close = profile.operatingHours.close;
 }
 });
};

const initialSubdomain = ref('');
const checkingSubdomain = ref(false);
const subdomainAvailable = ref<boolean | null>(null);
let subdomainTimeout: any = null;

const onSubdomainInput = () => {
 profile.subdomain = (profile.subdomain || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
 subdomainAvailable.value = null;
 if (subdomainTimeout) clearTimeout(subdomainTimeout);
 if (!profile.subdomain || profile.subdomain.length < 3) return;
 if (profile.subdomain === initialSubdomain.value) {
   subdomainAvailable.value = true;
   return;
 }
 subdomainTimeout = setTimeout(async () => {
   checkingSubdomain.value = true;
   try {
     const res: any = await vendors_api.checkSubdomain(profile.subdomain);
     const data = res?.data?.data || res?.data || {};
     subdomainAvailable.value = data.available === true;
   } catch {
     subdomainAvailable.value = null;
   } finally {
     checkingSubdomain.value = false;
   }
 }, 500);
};

const copiedDomain = ref(false);
const copyStoreUrl = async () => {
 if (!profile.subdomain) return;
 const url = `https://${profile.subdomain}.erranders.org`;
 try {
   await navigator.clipboard.writeText(url);
   copiedDomain.value = true;
   showToast({ title: 'Copied', message: 'Unique store URL copied to clipboard!', toastType: 'success' });
   setTimeout(() => { copiedDomain.value = false; }, 2500);
 } catch (e) {
   showToast({ title: 'Error', message: 'Failed to copy link', toastType: 'error' });
 }
};

const dynamicAccountPurposes = computed(() => {
 return profile.accountPurposes.map(p => ({ label: p, value: p }));
});

 const categoryOptions = [
 { label: 'Restaurant', value: 'restaurant' },
 { label: 'Eatery / Buka', value: 'eatery' },
 { label: 'Snacks & Small Chops', value: 'snacks' },
 { label: 'Drinks & Smoothies', value: 'drinks' },
 { label: 'Groceries', value: 'groceries' },
 { label: 'Bakery & Pastries', value: 'bakery' },
 { label: 'Pharmacy', value: 'pharmacy' },
 { label: 'Stationery & Printing', value: 'stationery' },
 { label: 'Other', value: 'other' },
 ];

 const filteredCategoryOptions = computed(() => {
 if (isServiceProvider.value) {
 return [
 { label: 'Hair Salon', value: 'hair_salon' },
 { label: 'Nails & Beauty', value: 'nails' },
 { label: 'Barber', value: 'barber' },
 { label: 'Tattoo & Piercing', value: 'tattooing_piercing' },
 { label: 'Fitness & Recovery', value: 'fitness_recovery' },
 { label: 'Other Services', value: 'other' }
 ];
 }
 return categoryOptions;
 });

const activePayoutAccount = computed(
 () => payoutAccounts.value.find((a) => a.isActive) || payoutAccounts.value[0] || null,
);

const retryPayoutLoad = () => { void loadInitialData(); };

const loadInitialData = async () => {
 loading.value = true;
 payoutLoading.value = true;
 payoutLoadError.value = '';
 try {
 const [profRes, walletRes] = await Promise.all([
 vendors_api.getProfile(),
 fetchWallet() as any
 ]);
 
 const data = profRes?.data?.data || profRes?.data || {};
 vendorId.value = data._id || data.id || '';
 profile.businessType = data.businessType || '';
 profile.vendorType = data.vendorType || '';
 profile.storeName = data.storeName || '';
 profile.subdomain = data.subdomain || '';
 initialSubdomain.value = data.subdomain || '';
 profile.description = data.description || '';
 profile.category = data.category || '';
 profile.address = data.address || '';
 profile.location = data.location || { type: 'Point', coordinates: [0, 0] };
 profile.logo = data.logo || '';
 profile.banner = data.banner || '';
 profile.isInsideCampus = !!data.isInsideCampus;
 if (data.operatingHours) {
 profile.operatingHours = data.operatingHours;
 } else if (data.openingTime && data.closingTime) {
 profile.operatingHours = { open: data.openingTime, close: data.closingTime };
 } else {
 profile.operatingHours = { open: '08:00', close: '20:00' };
 }
 profile.preparationTime = data.preparationTime || 15;
 profile.minimumOrder = data.minimumOrder || 0;
 profile.requiresTakeawayPack = !!data.requiresTakeawayPack;
 profile.requiresPrepTime = !!data.requiresPrepTime;
 if (data.packs && data.packs.length > 0) {
 profile.packs = JSON.parse(JSON.stringify(data.packs));
 } else {
 profile.packs = [{ name: 'Standard Pack', price: data.packagingFee || 300, isActive: true }];
 }
 if (data.businessHours && data.businessHours.length > 0) {
 profile.businessHours = data.businessHours;
 }
 if (data.accountPurposes && data.accountPurposes.length > 0) {
 profile.accountPurposes = data.accountPurposes;
 }
 isOnline.value = !!data.isOnline;

 const wData = wallet.value || walletRes || {};
 let pref = wData.payoutPreference || 'manual';
 if (pref === 'instant') pref = 'daily';
 payoutPreference.value = pref;
 
 // Support multi-account from bankAccounts or metadata or fallback to single one
 if (wData.bankAccounts && wData.bankAccounts.length > 0) {
 payoutAccounts.value = wData.bankAccounts;
 } else if (wData.metadata?.payoutAccounts) {
 payoutAccounts.value = wData.metadata.payoutAccounts;
 } else if (wData.bankDetails?.accountNumber) {
 payoutAccounts.value = [{ ...wData.bankDetails, isActive: true }];
 } else if ((data as any)?.bankDetails?.accountNumber) {
 // The vendor profile can carry the payout account even when the wallet has not been
 // provisioned yet — without this fallback those vendors saw an empty payout section.
 payoutAccounts.value = [{ ...(data as any).bankDetails, isActive: true }];
 }

 if (payoutAccounts.value.length === 0 && !wData) {
 payoutLoadError.value = 'We could not load your bank details.';
 }

 // Fetch banks lookup
 banksLoading.value = true;
 const bRes = await payments_api.getBanks();
 const banks = bRes?.data?.data || bRes?.data || [];
 bankOptions.value = banks.map((b: any) => ({ label: b.name || b.bank_name, value: b.code || b.bank_code }));
 banksLoading.value = false;
 } catch (err: any) {
 payoutLoadError.value =
 err?.response?.data?.message || 'We could not load your bank details. Check your connection and retry.';
 } finally {
 payoutLoading.value = false;
 loading.value = false;
 }
};

const onBankSelect = (val: string | number) => {
 const b = bankOptions.value.find(x => x.value === String(val));
 if (b) newAccount.bankName = b.label;
 if (newAccount.accountNumber.length === 10) resolveAccount();
};

const onAccountChange = (val: string | number) => {
 const sVal = String(val);
 if (sVal.length === 10 && newAccount.bankCode) resolveAccount();
 else {
 newAccount.accountName = '';
 isAccountVerified.value = false;
 }
};

const resolveAccount = async () => {
 resolvingAccount.value = true;
 resolveError.value = '';
 try {
 const res = await payments_api.resolveAccount(newAccount.accountNumber, newAccount.bankCode);
 const d = res?.data?.data || res?.data || {};
 newAccount.accountName = d.account_name || d.accountName;
 isAccountVerified.value = !!newAccount.accountName;
 } catch (e: any) {
 resolveError.value = e?.response?.data?.message || 'Verification failed';
 } finally {
 resolvingAccount.value = false;
 }
};

const maskAccountNumber = (num: string) => `•••• •••• ${num.slice(-2)}`;

const openAddAccount = () => {
 Object.assign(newAccount, { bankCode: '', bankName: '', accountNumber: '', accountName: '', purpose: 'default' });
 isAccountVerified.value = false;
 isAccountDrawerOpen.value = true;
};

const saveNewAccount = async () => {
 const isDup = payoutAccounts.value.some(a => a.accountNumber === newAccount.accountNumber);
 if (isDup) {
 showToast({ title: 'Already exists', message: 'This account is already linked.', toastType: 'error' });
 return;
 }

 const newAcc = { ...newAccount, isActive: payoutAccounts.value.length === 0 };
 payoutAccounts.value.push(newAcc);
 
 if (newAcc.isActive) {
 await syncPayoutPreferences();
 } else {
 // Just sync metadata
 await updatePreferences({ 
 preference: payoutPreference.value,
 bankAccounts: payoutAccounts.value,
 metadata: { payoutAccounts: payoutAccounts.value }
 });
 }
 
 isAccountDrawerOpen.value = false;
 showToast({ title: 'Account Linked', message: 'Bank account added successfully.', toastType: 'success' });
};

const setActiveAccount = async (acc: PayoutAccount) => {
 payoutAccounts.value.forEach(a => a.isActive = a.accountNumber === acc.accountNumber);
 await syncPayoutPreferences();
 showToast({ title: 'Active Payout Changed', message: `Now paying to ${acc.bankName}`, toastType: 'success' });
};

const deletePayoutAccount = async (acc: PayoutAccount) => {
 payoutAccounts.value = payoutAccounts.value.filter(a => a.accountNumber !== acc.accountNumber);
 await updatePreferences({ 
 preference: payoutPreference.value,
 bankAccounts: payoutAccounts.value,
 metadata: { payoutAccounts: payoutAccounts.value }
 });
};

const syncPayoutPreferences = async () => {
 const active = payoutAccounts.value.find(a => a.isActive);
 await updatePreferences({
 preference: payoutPreference.value,
 bankDetails: active ? { bankCode: active.bankCode, bankName: active.bankName, accountNumber: active.accountNumber, accountName: active.accountName } : null,
 bankAccounts: payoutAccounts.value,
 metadata: { payoutAccounts: payoutAccounts.value }
 });
};

const updatePayoutPref = async (pref: string) => {
 payoutPreference.value = pref;
 await syncPayoutPreferences();
};

const saveProfile = async () => {
 savingProfile.value = true;
 try {
 const { GATEWAY_ENDPOINT_WITH_AUTH: api } = await import('@/api_factory/axios.config');
 await api.put(`/vendors/${vendorId.value}`, { ...profile });
 
 const { fetchProfile } = useVendorProfile();
 await fetchProfile();
 initialSubdomain.value = profile.subdomain;

 showToast({ title: 'Profile Synced', message: 'Your store data has been updated.', toastType: 'success' });
 } finally { savingProfile.value = false; }
};

const saveHours = async () => {
 savingHours.value = true;
 try {
 const { GATEWAY_ENDPOINT_WITH_AUTH: api } = await import('@/api_factory/axios.config');
 await api.put(`/vendors/${vendorId.value}`, {
 openingTime: profile.operatingHours.open,
 closingTime: profile.operatingHours.close,
 businessHours: profile.businessHours,
 preparationTime: profile.preparationTime,
 packs: profile.packs,
 packagingFee: profile.packs && profile.packs.length > 0 ? profile.packs[0].price : 300,
 minimumOrder: profile.minimumOrder,
 requiresTakeawayPack: profile.requiresTakeawayPack,
 requiresPrepTime: profile.requiresPrepTime,
 });
 showToast({ title: 'Schedule Updated', message: 'Service window adjusted successfully.', toastType: 'success' });
 } finally { savingHours.value = false; }
};

const handleLogoUpload = async (e: Event) => {
 const file = (e.target as HTMLInputElement).files?.[0];
 if (!file) return;
 logoUploading.value = true;
 try {
 const isVideo = file.type.startsWith('video/');
 const res = isVideo ? await vendors_api.uploadVideo(file) : await vendors_api.uploadImage(file);
 profile.logo = res?.data?.url || res?.data?.imageUrl || res?.data?.data?.url || '';
 await saveProfile();
 } catch (err: any) {
 showToast({ title: 'Upload Failed', message: err.response?.data?.message || err.message || 'Failed to upload logo', toastType: 'error' });
 } finally { logoUploading.value = false; }
};

const handleBannerUpload = async (e: Event) => {
 const file = (e.target as HTMLInputElement).files?.[0];
 if (!file) return;
 bannerUploading.value = true;
 try {
 const isVideo = file.type.startsWith('video/');
 const res = isVideo ? await vendors_api.uploadVideo(file) : await vendors_api.uploadImage(file);
 profile.banner = res?.data?.url || res?.data?.imageUrl || res?.data?.data?.url || '';
 await saveProfile();
 } catch (err: any) {
 showToast({ title: 'Upload Failed', message: err.response?.data?.message || err.message || 'Failed to upload banner', toastType: 'error' });
 } finally { bannerUploading.value = false; }
};

const addPack = () => {
 profile.packs.push({ name: '', price: 300, isActive: true });
};

const removePack = (index: number) => {
 profile.packs.splice(index, 1);
};

const toggleOnline = async () => {
 togglingOnline.value = true;
 try {
 await vendors_api.toggleOnline(vendorId.value);
 isOnline.value = !isOnline.value;
 } finally { togglingOnline.value = false; }
};

onMounted(loadInitialData);
onMounted(loadCampus);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
