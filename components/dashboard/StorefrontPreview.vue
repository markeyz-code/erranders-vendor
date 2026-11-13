<template>
  <div class="min-h-full w-full bg-white">
    <!-- Hero -->
    <div v-if="blockOf('hero')" class="relative overflow-hidden bg-slate-900 px-6 py-12 text-white">
      <img v-if="hero.image" :src="hero.image" class="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div class="relative">
        <h1 class="text-2xl font-black leading-tight tracking-tight sm:text-3xl">{{ hero.headline || 'Your headline' }}</h1>
        <p class="mt-2 max-w-md text-sm text-white/80">{{ hero.subheadline }}</p>
        <span v-if="hero.ctaLabel" class="mt-4 inline-flex rounded-xl bg-[#FF5C1A] px-4 py-2 text-xs font-bold">{{ hero.ctaLabel }}</span>
      </div>
    </div>

    <!-- About -->
    <section v-if="blockOf('about')" class="px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ about.title || 'About us' }}</h2>
      <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{{ about.body || 'Tell customers who you are.' }}</p>
    </section>

    <!-- Services -->
    <section v-if="blockOf('services')" class="bg-slate-50 px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ services.title || 'What we offer' }}</h2>
      <p v-if="services.note" class="mt-1 text-xs text-slate-500">{{ services.note }}</p>
      <ul class="mt-3 grid gap-2 sm:grid-cols-2">
        <li v-for="(s, i) in serviceList" :key="i" class="rounded-xl border border-slate-200 bg-white p-3">
          <p class="text-sm font-bold text-slate-900">{{ s.name }}</p>
          <p v-if="s.description" class="mt-0.5 text-[11px] text-slate-500">{{ s.description }}</p>
          <p v-if="s.price" class="mt-1 text-xs font-black text-[#FF5C1A]">₦{{ Number(s.price).toLocaleString() }}</p>
        </li>
      </ul>
    </section>

    <!-- Products -->
    <section v-if="blockOf('products')" class="px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ products.title || 'Our products' }}</h2>
      <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div v-for="p in productList" :key="p._id" class="overflow-hidden rounded-xl border border-slate-200">
          <div class="flex h-24 items-center justify-center bg-slate-100 text-[10px] text-slate-400">
            <img v-if="p.image" :src="p.image" class="h-full w-full object-cover" />
            <span v-else>no image</span>
          </div>
          <div class="p-2">
            <p class="truncate text-[11px] font-bold text-slate-900">{{ p.name }}</p>
            <p class="text-[11px] font-black text-[#FF5C1A]">₦{{ Number(p.price || 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section v-if="blockOf('gallery')" class="bg-slate-50 px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ gallery.title || 'Our work' }}</h2>
      <div class="mt-3 grid grid-cols-3 gap-2">
        <div v-for="(g, i) in galleryImages" :key="i" class="aspect-square overflow-hidden rounded-lg bg-slate-200">
          <img v-if="g.url" :src="g.url" class="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <!-- Hours -->
    <section v-if="blockOf('hours')" class="px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ hours.title || 'Opening hours' }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ hours.note || 'When students can find you open.' }}</p>
    </section>

    <!-- Testimonials -->
    <section v-if="blockOf('testimonials')" class="bg-slate-50 px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ testimonials.title || 'What customers say' }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ testimonials.note || 'Reviews and quotes from students.' }}</p>
    </section>

    <!-- FAQ -->
    <section v-if="blockOf('faq')" class="px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ faq.title || 'Questions' }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ faq.note || 'Answers to what customers ask most.' }}</p>
    </section>

    <!-- Call to action -->
    <section v-if="blockOf('cta')" class="px-6 py-8">
      <div class="rounded-2xl bg-[#12300F] px-5 py-6 text-center text-white">
        <p class="text-base font-black">{{ cta.title || 'Ready to order?' }}</p>
        <p v-if="cta.note" class="mt-1 text-xs text-white/70">{{ cta.note }}</p>
        <span class="mt-3 inline-flex rounded-xl bg-[#FF5C1A] px-4 py-2 text-xs font-bold">{{ cta.label || 'Order now' }}</span>
      </div>
    </section>

    <!-- Contact -->
    <section v-if="blockOf('contact')" class="border-t border-slate-100 px-6 py-8">
      <h2 class="text-lg font-black tracking-tight text-slate-900">{{ contact.title || 'Contact us' }}</h2>
      <p class="mt-1 text-xs text-slate-500">{{ contact.note || 'Direct phone, WhatsApp and location.' }}</p>
    </section>

    <p v-if="!visible.length" class="p-10 text-center text-sm text-slate-400">
      No sections yet — pick a template to see it here.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ blocks: any[]; vendor?: any; products?: any[] }>();

const visible = computed(() => (props.blocks || []).filter((b: any) => b?.isVisible !== false));
const blockOf = (type: string) => visible.value.find((b: any) => b.type === type)?.props || null;

const hero = computed(() => blockOf('hero') || {});
const about = computed(() => blockOf('about') || {});
const services = computed(() => blockOf('services') || {});
const products = computed(() => blockOf('products') || {});
const gallery = computed(() => blockOf('gallery') || {});
const hours = computed(() => blockOf('hours') || {});
const testimonials = computed(() => blockOf('testimonials') || {});
const faq = computed(() => blockOf('faq') || {});
const cta = computed(() => blockOf('cta') || {});
const contact = computed(() => blockOf('contact') || {});

const serviceList = computed(() => (services.value?.items || []).length ? services.value.items : []);
const productList = computed(() => (props.products || []).slice(0, 6));
const galleryImages = computed(() => (gallery.value?.images || []).slice(0, 6));
</script>
