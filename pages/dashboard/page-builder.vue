<template>
  <div class="min-h-screen bg-slate-50/70 pb-24 font-sans text-slate-900">
    <!-- Top Global Sticky Navbar -->
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div class="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700 shadow-2xs transition-all hover:border-[#FF5C1A] hover:bg-orange-50 hover:text-[#FF5C1A] cursor-pointer"
            @click="handleBackNavigation"
          >
            <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-slate-500 group-hover:text-[#FF5C1A]" />
            <span>{{ activeView === 'templates' ? 'Back to Editor' : 'Storefront Styles' }}</span>
          </button>

          <div class="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Storefront Designer
              </h1>
              <a
                v-if="profile?.subdomain"
                :href="`https://${storeUrl}`"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-extrabold text-[#FF5C1A] border border-orange-200/60 hover:bg-orange-100 transition"
                title="Open live storefront"
              >
                <span>{{ storeUrl }}</span>
                <ExternalLink class="h-3 w-3" />
              </a>
            </div>
            <p class="text-[11px] font-medium text-slate-500 hidden md:block">
              {{ activeView === 'templates' ? 'Choose from specialized kitchen, food storage & campus styles' : 'Craft & customize your custom branded campus storefront' }}
            </p>
          </div>
        </div>

        <!-- Middle: View Switcher Tabs -->
        <div class="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
            :class="activeView === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            @click="activeView = 'editor'"
          >
            <Palette class="h-3.5 w-3.5 text-[#FF5C1A]" />
            <span>Editor Canvas</span>
            <span v-if="blocks.length" class="ml-1 rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-black text-slate-600">
              {{ blocks.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
            :class="activeView === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            @click="activeView = 'templates'"
          >
            <LayoutTemplate class="h-3.5 w-3.5 text-amber-500" />
            <span>Storefront Styles</span>
            <span class="ml-1 rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-black text-amber-800">
              {{ allTemplates.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
            :class="activeView === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            @click="activeView = 'preview'"
          >
            <Eye class="h-3.5 w-3.5 text-cyan-600" />
            <span>Live Preview</span>
          </button>
        </div>

        <!-- Right: Actions (Preview & Save/Publish) -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            @click="openPreviewModal('desktop')"
          >
            <Eye class="h-3.5 w-3.5 text-slate-400" />
            <span>Modal Preview</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-[#FF5C1A] disabled:opacity-50 cursor-pointer"
            :disabled="saving"
            @click="save"
          >
            <Loader2 v-if="saving" class="h-3.5 w-3.5 animate-spin" />
            <Save v-else class="h-3.5 w-3.5" />
            <span>{{ saving ? 'Publishing…' : 'Publish Storefront' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Global Notice Banner -->
    <div class="mx-auto max-w-[1600px] px-4 sm:px-6 pt-4">
      <div
        v-if="notice"
        class="flex items-center justify-between rounded-2xl p-4 text-xs font-bold shadow-2xs animate-fade-in"
        :class="noticeError ? 'border border-red-200 bg-red-50 text-red-800' : 'border border-emerald-200 bg-emerald-50 text-emerald-900'"
      >
        <div class="flex items-center gap-2.5">
          <AlertCircle v-if="noticeError" class="h-4 w-4 text-red-600 shrink-0" />
          <CheckCircle2 v-else class="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{{ notice }}</span>
        </div>
        <button type="button" @click="notice = ''" class="text-slate-400 hover:text-slate-700 font-black ml-4">✕</button>
      </div>
    </div>

    <!-- MAIN BODY BASED ON ACTIVE VIEW -->
    <main class="mx-auto max-w-[1600px] px-4 sm:px-6 py-6">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid lg:grid-cols-[280px_1fr_360px] gap-6">
        <div class="h-[600px] rounded-3xl bg-white border border-slate-200 animate-pulse" />
        <div class="h-[600px] rounded-3xl bg-white border border-slate-200 animate-pulse" />
        <div class="h-[600px] rounded-3xl bg-white border border-slate-200 animate-pulse" />
      </div>

      <!-- ════════════════════════════════════════════════════════════════════ -->
      <!-- VIEW 1: STOREFRONT SELECTION LIST (TEMPLATES & DESIGN STYLES)       -->
      <!-- ════════════════════════════════════════════════════════════════════ -->
      <section v-else-if="activeView === 'templates'" class="space-y-8 animate-fade-in">
        <!-- Hero Header for Storefront Styles -->
        <div class="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 p-6 sm:p-8 shadow-xs">
          <div class="max-w-3xl space-y-3">
            <div class="inline-flex items-center gap-2 rounded-full bg-[#FF5C1A] px-3.5 py-1 text-xs font-black text-white shadow-xs">
              <Sparkles class="h-3.5 w-3.5" />
              <span>Tailored Storefront Design Styles</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Choose a Storefront Design Style for Your Store
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Whether you cook hot kitchen meals, sell bulk soup tubs, package weekly hostel meal preps, or run cold storage,
              pick a ready-to-use storefront layout. You can customize every photo, word, and section at any time.
            </p>
          </div>

          <!-- Category Filter Bar & Search -->
          <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-6">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="cat in templateCategories"
                :key="cat.key"
                type="button"
                class="rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer"
                :class="selectedTemplateCategory === cat.key ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
                @click="selectedTemplateCategory = cat.key"
              >
                <span>{{ cat.label }}</span>
                <span class="ml-1.5 text-[10px] opacity-75 font-black">({{ countForCategory(cat.key) }})</span>
              </button>
            </div>

            <!-- Search input -->
            <div class="relative w-full sm:w-64">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                v-model="templateSearchQuery"
                type="text"
                placeholder="Search styles (e.g. kitchen, soup)..."
                class="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#FF5C1A] focus:outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        <!-- Template Cards Grid -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-[#FF5C1A] hover:shadow-xl shadow-xs"
          >
            <!-- Card Header Banner with Gradient & Badges -->
            <div
              class="relative h-32 w-full bg-gradient-to-br p-4 text-white flex flex-col justify-between"
              :class="tpl.previewGradient || 'from-slate-800 to-slate-900'"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="rounded-full bg-black/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
                  {{ tpl.categoryLabel }}
                </span>

                <span
                  v-if="tpl.badge || isSuggested(tpl)"
                  class="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-900 shadow-sm"
                >
                  {{ isSuggested(tpl) ? 'Recommended for you' : tpl.badge }}
                </span>
              </div>

              <div>
                <h3 class="text-lg font-black text-white leading-tight drop-shadow-sm">
                  {{ tpl.name }}
                </h3>
              </div>
            </div>

            <!-- Card Content Body -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p class="text-xs leading-relaxed text-slate-600 font-medium">
                {{ tpl.description }}
              </p>

              <!-- Included Sections Tags -->
              <div>
                <p class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Includes {{ tpl.sections.length }} Sections:
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(sec, sIdx) in tpl.sections"
                    :key="sIdx"
                    class="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 border border-slate-200/60"
                  >
                    {{ sectionLabel(sec) }}
                  </span>
                </div>
              </div>

              <!-- Card Action Buttons -->
              <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white transition-all hover:bg-[#FF5C1A] shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  @click="promptApplyTemplate(tpl)"
                >
                  <Sparkles class="h-3.5 w-3.5" />
                  <span>Use This Style</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Inline Confirm Modal when applying template -->
        <div
          v-if="pendingTemplate"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
        >
          <div class="max-w-md w-full rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">
                Apply "{{ pendingTemplate.name }}"?
              </h3>
              <p class="mt-1 text-xs text-slate-600 leading-relaxed">
                Applying this style will replace your current
                <span class="font-extrabold text-slate-900">{{ blocks.length }} active section{{ blocks.length === 1 ? '' : 's' }}</span>
                with the curated sections of this layout.
              </p>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                @click="pendingTemplate = null"
              >
                Keep Current
              </button>
              <button
                type="button"
                class="rounded-xl bg-[#FF5C1A] px-4 py-2 text-xs font-black text-white hover:bg-[#E54D12] shadow-xs cursor-pointer"
                @click="confirmApplyTemplate"
              >
                Yes, Apply Style
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════════════ -->
      <!-- VIEW 2: VISUAL EDITOR CANVAS                                        -->
      <!-- ════════════════════════════════════════════════════════════════════ -->
      <section v-else-if="activeView === 'editor'" class="grid lg:grid-cols-[280px_1fr_380px] gap-6 items-start animate-fade-in">
        <!-- ── Left: Add Sections Palette ── -->
        <aside class="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs lg:sticky lg:top-20">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Add Sections</p>
              <h3 class="text-xs font-extrabold text-slate-800 mt-0.5">Components Palette</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
              {{ blocks.length }} active
            </span>
          </div>

          <!-- Section Search / Filter -->
          <div class="mt-3 mb-2">
            <input
              v-model="sectionPaletteSearch"
              type="text"
              placeholder="Search components..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#FF5C1A] focus:bg-white focus:outline-none"
            />
          </div>

          <!-- Scrollable Section List -->
          <div class="space-y-4 max-h-[72vh] overflow-y-auto pr-1 mt-2">
            <div
              v-for="group in filteredPaletteGroups"
              :key="group.category"
              class="space-y-1.5"
            >
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 pt-1">
                {{ group.label }}
              </p>

              <button
                v-for="def in group.items"
                :key="def.type"
                type="button"
                class="group w-full flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 text-left transition-all hover:border-[#FF5C1A] hover:bg-orange-50/50 hover:shadow-2xs cursor-pointer"
                @click="addBlock(def.type)"
              >
                <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 group-hover:text-[#FF5C1A] group-hover:border-orange-200 shrink-0 shadow-2xs transition-colors">
                  <component :is="def.icon" class="w-4 h-4" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-xs font-extrabold text-slate-800 group-hover:text-[#FF5C1A] truncate leading-tight">
                    {{ def.label }}
                  </p>
                  <p class="text-[10px] text-slate-400 truncate mt-0.5">
                    {{ def.description }}
                  </p>
                </div>

                <span class="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#FF5C1A] group-hover:border-orange-200 shrink-0 shadow-2xs transition-colors">
                  <Plus class="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        </aside>

        <!-- ── Middle: Main Canvas ── -->
        <div class="min-h-[550px] space-y-4">
          <!-- Canvas Top Subheader -->
          <div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p class="text-xs font-bold text-slate-700">
                Visual Canvas Order: <span class="font-extrabold text-slate-900">{{ blocks.length }} Sections</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                @click="activeView = 'templates'"
              >
                Browse Styles
              </button>
              <button
                v-if="blocks.length > 0"
                type="button"
                class="rounded-lg px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                @click="clearAllBlocks"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          <!-- Empty Canvas State -->
          <div
            v-if="blocks.length === 0"
            class="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center space-y-5"
          >
            <div class="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center mx-auto text-2xl shadow-inner">
              🎨
            </div>
            <div class="max-w-md mx-auto space-y-2">
              <h3 class="text-lg font-black text-slate-900">Your Storefront Canvas is Empty</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Start by picking a tailored Storefront Design Style for kitchens, food storage, or student shops, or add sections one by one from the left palette.
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                class="rounded-xl bg-[#FF5C1A] px-5 py-2.5 text-xs font-black text-white hover:bg-[#E54D12] transition shadow-xs cursor-pointer flex items-center gap-2"
                @click="activeView = 'templates'"
              >
                <LayoutTemplate class="w-4 h-4" />
                <span>Browse Storefront Styles</span>
              </button>
              <button
                type="button"
                class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer flex items-center gap-2"
                @click="addBlock('hero')"
              >
                <Plus class="w-4 h-4 text-slate-400" />
                <span>Add Hero Banner</span>
              </button>
            </div>
          </div>

          <!-- Active Blocks List -->
          <div v-else class="space-y-3">
            <div
              v-for="(block, index) in blocks"
              :key="block.id"
              draggable="true"
              class="group relative rounded-2xl border bg-white transition-all cursor-pointer shadow-2xs overflow-hidden"
              :class="[
                selectedId === block.id ? 'border-[#FF5C1A] ring-2 ring-[#FF5C1A]/20' : 'border-slate-200 hover:border-slate-300',
                dragIndex === index ? 'opacity-30' : '',
                dropIndex === index ? 'border-t-4 border-t-[#FF5C1A]' : '',
              ]"
              @dragstart="onDragStart(index)"
              @dragover.prevent="onDragOver(index)"
              @dragleave="onDragLeave(index)"
              @drop.prevent="onDrop(index)"
              @dragend="onDragEnd"
              @click="selectedId = block.id"
            >
              <!-- Card Toolbar -->
              <div class="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                <!-- Drag Handle -->
                <GripVertical class="w-4 h-4 text-slate-300 group-hover:text-slate-500 cursor-grab shrink-0" />

                <!-- Up / Down Quick Reorder Buttons -->
                <div class="flex items-center gap-0.5 border-r border-slate-200 pr-2">
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 cursor-pointer"
                    :disabled="index === 0"
                    title="Move section up"
                    @click.stop="moveBlock(index, -1)"
                  >
                    <ChevronUp class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 cursor-pointer"
                    :disabled="index === blocks.length - 1"
                    title="Move section down"
                    @click.stop="moveBlock(index, 1)"
                  >
                    <ChevronDown class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Section Icon & Label -->
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <div class="w-6 h-6 rounded-lg bg-orange-50 text-[#FF5C1A] flex items-center justify-center shrink-0">
                    <component :is="definitionFor(block.type)?.icon" class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-black text-slate-800 truncate">
                    {{ definitionFor(block.type)?.label || block.type }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-400">#{{ index + 1 }}</span>
                </div>

                <!-- Visibility Toggle Button -->
                <button
                  type="button"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors"
                  :class="block.isVisible ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-400 bg-slate-100 border border-slate-200'"
                  :title="block.isVisible ? 'Visible to students' : 'Hidden from students'"
                  @click.stop="toggleVisible(block)"
                >
                  {{ block.isVisible ? 'Visible' : 'Hidden' }}
                </button>

                <!-- Duplicate Button -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Duplicate section"
                  @click.stop="duplicateBlock(index)"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>

                <!-- Remove Button -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Remove section"
                  @click.stop="removeBlock(index)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Card Content Preview Mockup -->
              <div class="p-4" :class="{ 'opacity-40': !block.isVisible }">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-extrabold text-slate-900 truncate">
                      {{ block.props.headline || block.props.title || definitionFor(block.type)?.label }}
                    </p>
                    <p v-if="block.props.subheadline || block.props.subtitle || block.props.note || block.props.body" class="text-xs text-slate-500 mt-1 line-clamp-2">
                      {{ block.props.subheadline || block.props.subtitle || block.props.note || block.props.body }}
                    </p>
                    <p v-else class="text-[11px] text-slate-400 mt-1">
                      {{ definitionFor(block.type)?.description }}
                    </p>
                  </div>

                  <!-- Mini thumbnail preview if hero image exists -->
                  <div v-if="block.props.image" class="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img :src="block.props.image" class="w-full h-full object-cover" />
                  </div>
                </div>

                <!-- Section Spec / Badge pill preview for complex sections -->
                <div v-if="Array.isArray(block.props.items) && block.props.items.length" class="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <span
                    v-for="(itm, iIdx) in block.props.items.slice(0, 3)"
                    :key="iIdx"
                    class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 truncate max-w-[140px]"
                  >
                    {{ itm.name || itm.title || itm.method || itm.q || 'Item' }}
                  </span>
                  <span v-if="block.props.items.length > 3" class="text-[10px] font-extrabold text-slate-400 self-center">
                    +{{ block.props.items.length - 3 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right: Section Inspector & Settings ── -->
        <aside class="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs lg:sticky lg:top-20">
          <template v-if="selectedBlock">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center">
                  <component :is="definitionFor(selectedBlock.type)?.icon" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Section Settings</p>
                  <h4 class="text-xs font-black text-slate-900 leading-tight">
                    {{ definitionFor(selectedBlock.type)?.label }}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                @click="selectedId = ''"
              >
                Done
              </button>
            </div>

            <!-- Fields Editor List -->
            <div class="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              <template v-for="field in definitionFor(selectedBlock.type)?.fields || []" :key="field.key">
                <!-- Text & URL Input -->
                <div v-if="field.type === 'text' || field.type === 'url'" class="space-y-1">
                  <label class="text-[11px] font-extrabold text-slate-700">{{ field.label }}</label>
                  <input
                    v-model="selectedBlock.props[field.key]"
                    type="text"
                    :placeholder="field.placeholder || ''"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#FF5C1A] focus:bg-white focus:outline-none transition"
                  />
                  <p v-if="field.help" class="text-[10px] text-slate-400">{{ field.help }}</p>
                </div>

                <!-- Textarea Input -->
                <div v-else-if="field.type === 'textarea'" class="space-y-1">
                  <label class="text-[11px] font-extrabold text-slate-700">{{ field.label }}</label>
                  <textarea
                    v-model="selectedBlock.props[field.key]"
                    rows="3"
                    :placeholder="field.placeholder || ''"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#FF5C1A] focus:bg-white focus:outline-none transition resize-none"
                  />
                </div>

                <!-- Image Input with Food Presets -->
                <div v-else-if="field.type === 'image'" class="space-y-2">
                  <label class="text-[11px] font-extrabold text-slate-700">{{ field.label }}</label>
                  <input
                    v-model="selectedBlock.props[field.key]"
                    type="text"
                    placeholder="https://images.unsplash.com/…"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#FF5C1A] focus:bg-white focus:outline-none transition"
                  />

                  <!-- Quick Food Banner Preset Chips -->
                  <div>
                    <p class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Or use a curated photo preset:</p>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        v-for="preset in FOOD_IMAGE_PRESETS"
                        :key="preset.name"
                        type="button"
                        class="rounded-lg border border-slate-200 bg-slate-50/80 p-1.5 text-left text-[10px] font-bold text-slate-700 hover:border-[#FF5C1A] hover:bg-orange-50 transition cursor-pointer truncate"
                        @click="selectedBlock.props[field.key] = preset.url"
                      >
                        {{ preset.name }}
                      </button>
                    </div>
                  </div>

                  <!-- Live Image Preview -->
                  <div v-if="selectedBlock.props[field.key]" class="relative rounded-2xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                    <img :src="selectedBlock.props[field.key]" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute top-2 right-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-black"
                      @click="selectedBlock.props[field.key] = ''"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <!-- List Repeater Field -->
                <div v-else-if="field.type === 'list'" class="space-y-2 pt-2 border-t border-slate-100">
                  <div class="flex items-center justify-between">
                    <label class="text-[11px] font-extrabold text-slate-800">{{ field.label }}</label>
                    <span class="text-[10px] font-bold text-slate-400">
                      {{ listRows(selectedBlock, field.key).length }} items
                    </span>
                  </div>

                  <div class="space-y-2.5">
                    <div
                      v-for="(row, rIdx) in listRows(selectedBlock, field.key)"
                      :key="rIdx"
                      class="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 space-y-2 shadow-2xs"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black text-slate-400">#{{ rIdx + 1 }}</span>
                        <button
                          type="button"
                          class="text-[10px] font-extrabold text-red-500 hover:text-red-700 cursor-pointer"
                          @click="removeRow(selectedBlock, field.key, rIdx)"
                        >
                          Remove
                        </button>
                      </div>

                      <template v-for="item in field.itemFields || []" :key="item.key">
                        <div class="space-y-0.5">
                          <label class="text-[9px] font-black uppercase text-slate-400">{{ item.label }}</label>
                          <textarea
                            v-if="item.type === 'textarea'"
                            :value="row[item.key]"
                            rows="2"
                            :placeholder="item.label"
                            class="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#FF5C1A] focus:outline-none"
                            @input="setRowValue(selectedBlock, field.key, rIdx, item.key, ($event.target as HTMLTextAreaElement).value)"
                          />
                          <input
                            v-else
                            :value="row[item.key]"
                            type="text"
                            :placeholder="item.label"
                            class="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#FF5C1A] focus:outline-none"
                            @input="setRowValue(selectedBlock, field.key, rIdx, item.key, ($event.target as HTMLInputElement).value)"
                          />
                        </div>
                      </template>
                    </div>

                    <button
                      type="button"
                      class="w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-black text-slate-600 hover:border-[#FF5C1A] hover:bg-orange-50 hover:text-[#FF5C1A] transition cursor-pointer"
                      @click="addRow(selectedBlock, field.key)"
                    >
                      + Add {{ field.label }} Item
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <div v-else class="py-24 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MousePointerClick class="w-6 h-6" />
            </div>
            <h4 class="text-xs font-extrabold text-slate-800">Select Any Section on Canvas</h4>
            <p class="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
              Click any section on the canvas to configure its headlines, images, specials, and guidelines.
            </p>
          </div>
        </aside>
      </section>

      <!-- ════════════════════════════════════════════════════════════════════ -->
      <!-- VIEW 3: LIVE INTERACTIVE PREVIEW SIMULATOR                          -->
      <!-- ════════════════════════════════════════════════════════════════════ -->
      <section v-else-if="activeView === 'preview'" class="space-y-4 animate-fade-in">
        <!-- Preview Device Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-2xs">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-600">Simulate Device:</span>
            <div class="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                class="rounded-lg px-3 py-1 transition cursor-pointer"
                :class="previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'"
                @click="previewDevice = 'mobile'"
              >
                <Smartphone class="mr-1 inline h-3.5 w-3.5" /> Mobile (390px)
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1 transition cursor-pointer"
                :class="previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'"
                @click="previewDevice = 'tablet'"
              >
                <Tablet class="mr-1 inline h-3.5 w-3.5" /> Tablet (768px)
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1 transition cursor-pointer"
                :class="previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'"
                @click="previewDevice = 'desktop'"
              >
                <Monitor class="mr-1 inline h-3.5 w-3.5" /> Desktop (Full)
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a
              :href="previewUrl"
              target="_blank"
              rel="noopener"
              class="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>Open in New Tab</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Simulator Frame Canvas -->
        <div class="flex justify-center rounded-3xl border border-slate-200 bg-slate-100/90 p-4 sm:p-8 min-h-[750px] overflow-hidden">
          <div
            class="h-[800px] rounded-2xl border border-slate-300 bg-white shadow-2xl overflow-hidden transition-all duration-300"
            :class="{
              'w-[390px]': previewDevice === 'mobile',
              'w-[768px]': previewDevice === 'tablet',
              'w-full max-w-6xl': previewDevice === 'desktop',
            }"
          >
            <iframe
              :src="previewUrl"
              class="h-full w-full border-0"
              :title="`${storeUrl} live preview`"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Preview Overlay (Teleported) -->
    <Teleport to="body">
      <div v-if="previewModalOpen" class="fixed inset-0 z-[300] flex flex-col bg-slate-900/70 p-3 backdrop-blur-sm sm:p-6 animate-fade-in">
        <div class="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Modal Preview</p>
              <p class="text-sm font-extrabold text-slate-900">{{ storeUrl }}</p>
            </div>

            <div class="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition"
                :class="previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
                @click="previewDevice = 'mobile'"
              >
                <Smartphone class="mr-1 inline h-3.5 w-3.5" /> Mobile
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition"
                :class="previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
                @click="previewDevice = 'desktop'"
              >
                <Monitor class="mr-1 inline h-3.5 w-3.5" /> Desktop
              </button>
            </div>

            <div class="flex items-center gap-2">
              <a :href="previewUrl" target="_blank" rel="noopener" class="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                Open in tab
              </a>
              <button type="button" class="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800" @click="previewModalOpen = false">
                Close
              </button>
            </div>
          </div>

          <div class="flex flex-1 justify-center overflow-auto bg-slate-50 p-4">
            <div
              class="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all"
              :class="previewDevice === 'mobile' ? 'w-[390px] max-w-full' : 'w-full'"
            >
              <StorefrontPreview :blocks="blocks" :vendor="profile" :products="previewProducts" class="h-full overflow-y-auto" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Eye,
  GripVertical,
  MousePointerClick,
  Loader2,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Search,
  LayoutTemplate,
  Palette,
  CheckCircle2,
  AlertCircle,
} from 'lucide-vue-next';
import { useVendorProfile } from '@/composables/modules/vendors';
import { vendors_api } from '@/api_factory/modules/vendors';
import StorefrontPreview from '@/components/dashboard/StorefrontPreview.vue';
import {
  BLOCK_DEFINITIONS,
  definitionFor,
  makeBlock,
  STOREFRONT_TEMPLATES,
  templatesForVendor,
  blocksFromTemplate,
  type StorefrontTemplate,
} from '@/composables/usePageBlocks';

definePageMeta({ layout: 'vendor' });
useHead({ title: 'Storefront Page Designer - Errander Vendor' });

const router = useRouter();
const { profile, fetchProfile } = useVendorProfile();

// Active view modes: 'editor' | 'templates' | 'preview'
const activeView = ref<'editor' | 'templates' | 'preview'>('editor');

const blocks = ref<any[]>([]);
const selectedId = ref('');
const loading = ref(true);
const saving = ref(false);
const notice = ref('');
const noticeError = ref(false);

const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

const previewDevice = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
const previewModalOpen = ref(false);

const selectedTemplateCategory = ref<string>('all');
const templateSearchQuery = ref('');
const sectionPaletteSearch = ref('');
const pendingTemplate = ref<StorefrontTemplate | null>(null);

// High quality food & store banner presets
const FOOD_IMAGE_PRESETS = [
  { name: '🍛 Party Jollof & Stew', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80' },
  { name: '🍲 Soup Pot & Swallow', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80' },
  { name: '🥗 Weekly Meal Prep Box', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80' },
  { name: '🍗 Crispy Chicken & Grills', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80' },
  { name: '🥤 Chilled Parfait & Berry', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80' },
  { name: '🥐 Oven Fresh Pastries', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80' },
];

const templateCategories = [
  { key: 'all', label: 'All Styles' },
  { key: 'kitchen', label: '🍳 Kitchen & Hot Meals' },
  { key: 'storage', label: '❄️ Food Storage & Meal Prep' },
  { key: 'drinks', label: '🥤 Smoothies & Chilled Drinks' },
  { key: 'bakery', label: '🥐 Bakery & Pastries' },
  { key: 'retail', label: '🛍️ Campus Mart & Retail' },
  { key: 'services', label: '✂️ Services & Care' },
];

const storeUrl = computed(() => {
  const sub = profile.value?.subdomain;
  return sub ? `${sub}.erranders.org` : 'yourstore.erranders.org';
});

const previewUrl = computed(() => {
  const p = profile.value;
  if (!p) return '#';
  if (p.subdomain) return `https://${p.subdomain}.erranders.org`;
  const id = p._id || p.id;
  return `https://student.erranders.org/vendors/${id}`;
});

const selectedBlock = computed(() => blocks.value.find((b) => b.id === selectedId.value) || null);

const allTemplates = computed(() =>
  templatesForVendor(profile.value?.vendorType, profile.value?.category, profile.value?.storeName),
);

const countForCategory = (catKey: string) => {
  if (catKey === 'all') return allTemplates.value.length;
  return allTemplates.value.filter((t) => t.category === catKey).length;
};

const filteredTemplates = computed(() => {
  let list = allTemplates.value;

  if (selectedTemplateCategory.value !== 'all') {
    list = list.filter((t) => t.category === selectedTemplateCategory.value);
  }

  if (templateSearchQuery.value.trim()) {
    const q = templateSearchQuery.value.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q),
    );
  }

  return list;
});

const filteredPaletteGroups = computed(() => {
  const query = sectionPaletteSearch.value.toLowerCase().trim();
  const groups = [
    { category: 'core', label: 'Core Sections', items: [] as any[] },
    { category: 'food', label: 'Kitchen & Food Storage', items: [] as any[] },
    { category: 'trust', label: 'Trust & Proof', items: [] as any[] },
    { category: 'info', label: 'Information & Hours', items: [] as any[] },
  ];

  for (const def of BLOCK_DEFINITIONS) {
    if (query && !def.label.toLowerCase().includes(query) && !def.description.toLowerCase().includes(query)) {
      continue;
    }
    const grp = groups.find((g) => g.category === def.category) || groups[0];
    grp.items.push(def);
  }

  return groups.filter((g) => g.items.length > 0);
});

onMounted(async () => {
  loading.value = true;
  try {
    if (!profile.value) {
      await fetchProfile();
    }
    const current = profile.value?.pageBlocks || [];
    blocks.value = JSON.parse(JSON.stringify(current));
    if (blocks.value.length > 0) {
      selectedId.value = blocks.value[0]?.id || '';
    } else {
      // Default to templates selection list if brand new empty canvas
      activeView.value = 'templates';
    }
  } catch (err) {
    console.error('Failed to load page blocks', err);
  } finally {
    loading.value = false;
  }
});

// Navigation Back Button Logic
const handleBackNavigation = () => {
  if (activeView.value === 'templates') {
    // If on templates view, return to editor canvas (or dashboard if canvas was empty)
    if (blocks.value.length > 0) {
      activeView.value = 'editor';
    } else {
      router.push('/dashboard');
    }
  } else if (activeView.value === 'preview') {
    activeView.value = 'editor';
  } else {
    // In editor: clicking the back button opens the Storefront Selection List
    activeView.value = 'templates';
  }
};

const openPreviewModal = (device: 'mobile' | 'desktop' = 'desktop') => {
  previewDevice.value = device;
  previewModalOpen.value = true;
};

const isSuggested = (template: StorefrontTemplate) =>
  (template.appliesTo || []).some((key: string) =>
    [profile.value?.vendorType, profile.value?.category, profile.value?.storeName]
      .map((v) => String(v || '').toLowerCase())
      .filter(Boolean)
      .some((h) => h.includes(key)),
  );

const sectionLabel = (sec: any) => {
  const type = typeof sec === 'string' ? sec : sec?.type;
  return definitionFor(type)?.label || type;
};

const promptApplyTemplate = (template: StorefrontTemplate) => {
  if (blocks.value.length > 0) {
    pendingTemplate.value = template;
    return;
  }
  applyTemplateNow(template);
};

const confirmApplyTemplate = () => {
  if (pendingTemplate.value) {
    applyTemplateNow(pendingTemplate.value);
    pendingTemplate.value = null;
  }
};

const applyTemplateNow = (template: StorefrontTemplate) => {
  blocks.value = blocksFromTemplate(template);
  selectedId.value = blocks.value[0]?.id || '';
  activeView.value = 'editor';
  notice.value = `Applied "${template.name}" style! Customize the text and photos below.`;
  noticeError.value = false;
};

const addBlock = (type: string) => {
  const fresh = makeBlock(type);
  blocks.value.push(fresh);
  selectedId.value = fresh.id;
};

const moveBlock = (index: number, direction: number) => {
  const target = index + direction;
  if (target < 0 || target >= blocks.value.length) return;
  const item = blocks.value.splice(index, 1)[0];
  blocks.value.splice(target, 0, item);
};

const duplicateBlock = (index: number) => {
  const orig = blocks.value[index];
  if (!orig) return;
  const clone = JSON.parse(JSON.stringify(orig));
  clone.id = `${orig.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  blocks.value.splice(index + 1, 0, clone);
  selectedId.value = clone.id;
};

const removeBlock = (index: number) => {
  const removed = blocks.value.splice(index, 1)[0];
  if (removed?.id === selectedId.value) {
    selectedId.value = blocks.value[0]?.id || '';
  }
};

const clearAllBlocks = () => {
  if (confirm('Are you sure you want to clear all sections from the canvas?')) {
    blocks.value = [];
    selectedId.value = '';
    activeView.value = 'templates';
  }
};

const toggleVisible = (block: any) => {
  block.isVisible = !block.isVisible;
};

// Drag and drop handlers
const onDragStart = (idx: number) => {
  dragIndex.value = idx;
};

const onDragOver = (idx: number) => {
  if (dragIndex.value === null || dragIndex.value === idx) return;
  dropIndex.value = idx;
};

const onDragLeave = (_idx: number) => {
  dropIndex.value = null;
};

const onDrop = (idx: number) => {
  if (dragIndex.value === null) return;
  const item = blocks.value.splice(dragIndex.value, 1)[0];
  blocks.value.splice(idx, 0, item);
  dragIndex.value = null;
  dropIndex.value = null;
};

const onDragEnd = () => {
  dragIndex.value = null;
  dropIndex.value = null;
};

// List Repeater Helpers
const listRows = (block: any, key: string) => {
  if (!Array.isArray(block.props[key])) {
    block.props[key] = [];
  }
  return block.props[key];
};

const addRow = (block: any, key: string) => {
  listRows(block, key).push({});
};

const removeRow = (block: any, key: string, rIdx: number) => {
  listRows(block, key).splice(rIdx, 1);
};

const setRowValue = (block: any, fieldKey: string, rIdx: number, itemKey: string, val: string) => {
  const row = listRows(block, fieldKey)[rIdx] || {};
  row[itemKey] = val;
};

const save = async () => {
  saving.value = true;
  notice.value = '';
  noticeError.value = false;

  try {
    // updateProfile(payload) PUTs to /vendors/profile and takes ONE argument. It was being called
    // with two — so the request body was the vendor id string and pageBlocks was never sent.
    // The call resolved, the success notice appeared, and nothing was saved.
    await vendors_api.updateProfile({ pageBlocks: blocks.value });
    notice.value = 'Storefront design published successfully! Students can now see your updated page.';
    await fetchProfile();
  } catch (err: any) {
    noticeError.value = true;
    notice.value = err?.message || 'Could not save page design.';
  } finally {
    saving.value = false;
  }
};
</script>
