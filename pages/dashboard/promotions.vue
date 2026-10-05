<template>
  <div class="space-y-6 animate-fade-in container mx-auto pb-20 mt-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight mb-1">Promotional Banners</h1>
        <p class="text-gray-500 text-sm">Upload banners to advertise special offers and discounts to students.</p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-5 py-2.5 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-parentPrimary transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> Create Banner
      </button>
    </div>

    <!-- Active Banners Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div v-for="i in 2" :key="i" class="h-48 bg-white rounded-md border border-gray-50 animate-pulse" />
    </div>

    <div v-else-if="banners.length === 0" class="text-center py-20 bg-white rounded-md border border-gray-50 mt-8">
      <div class="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center text-4xl mx-auto mb-4 border border-gray-50">
        <Megaphone class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">No active promotions</h3>
      <p class="text-sm text-gray-400 max-w-sm mx-auto mb-6">Create eye-catching banners to notify students about deals, new items, and discounts.</p>
      <button @click="showAddModal = true" class="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-parentPrimary transition-colors">
        Create Your First Banner
      </button>
    </div>

    <div v-else class="mt-8 bg-white rounded-xl border border-gray-50 overflow-hidden w-full min-w-0 shadow-sm">
      <div class="overflow-x-auto min-h-[300px] w-full hide-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50/50">
            <tr class="border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Banner</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Promotion info</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Target Link</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(banner, index) in banners" :key="index" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 w-48">
                <div class="h-16 w-32 rounded-lg bg-gray-100 relative overflow-hidden border border-gray-50">
                  <img v-if="banner.image" :src="banner.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon class="w-4 h-4 opacity-50" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <h3 class="text-sm font-bold text-gray-900 truncate">{{ banner.title || 'Untitled Promotion' }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ banner.description || 'No description provided.' }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="banner.productId" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-600 rounded-md text-sm font-medium border border-purple-100">
                  PRODUCT LINKED
                </div>
                <div v-else class="flex items-center text-sm font-bold text-parentPrimary truncate max-w-[150px]">
                  <LinkIcon class="w-3 h-3 mr-1.5 shrink-0" />
                  {{ banner.link || 'Internal Promotion' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="banner.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-500 border border-gray-25'" class="px-2.5 py-1 rounded-md text-sm font-medium inline-block">
                  {{ banner.isActive ? 'LIVE' : 'HIDDEN' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleBannerStatus(index)" :class="banner.isActive ? 'text-gray-400 hover:text-gray-900 border-transparent hover:border-gray-200 bg-white' : 'text-parentPrimary border-parentPrimary/20 bg-parentPrimary/5 hover:bg-parentPrimary hover:text-white'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all border">
                    <EyeOff v-if="banner.isActive" class="w-4 h-4" />
                    <Eye v-else class="w-4 h-4" />
                  </button>
                  <button @click="removeBanner(index)" class="w-8 h-8 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 border border-transparent flex items-center justify-center transition-all bg-rose-50/50 hover:">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Banner Modal -->
    <Modal :isOpen="showAddModal" @close="showAddModal = false" title="Create Promotional Banner">
      <div class="space-y-6">
        <!-- Image Upload Area -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
          <div class="relative w-full h-40 rounded-md border border-dashed border-gray-200 hover:border-parentPrimary bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-colors group">
            <template v-if="form.image">
              <img :src="form.image" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-white text-sm font-bold flex items-center gap-2"><Upload class="w-4 h-4" /> Change Image</span>
              </div>
            </template>
            <template v-else>
              <div class="text-center p-6">
                <div class="w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-parentPrimary transition-colors">
                  <Upload class="w-5 h-5" />
                </div>
                <p class="text-sm font-bold text-gray-600">Click to upload banner</p>
                <p class="text-sm text-gray-400 mt-1">Recommended size: 1200 x 400px (JPG, PNG)</p>
              </div>
            </template>
            <input type="file" required accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileUpload" />
            <div v-if="uploading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 class="w-6 h-6 animate-spin text-parentPrimary" />
              <span class="text-sm font-bold text-gray-900">UPLOADING...</span>
            </div>
          </div>
        </div>

        <UiAnimatedInput v-model="form.title" label="Promotion Title" placeholder="e.g. 50% Off Weekend Bonanza!" required />
        <UiAnimatedInput v-model="form.description" label="Short Description" placeholder="Describe your offer in a few words..." />
        
        <!-- Product Link -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Related Product (Optional)</label>
          <UiSelectInput 
            v-model="form.productId" 
            :options="[{ label: 'No specific product (General Store Promo)', value: '' }, ...products.map(p => ({ label: `${p.name} - ₦${p.price}`, value: p._id }))]" 
            class="w-full" 
          />
        </div>

        <UiAnimatedInput v-model="form.link" label="External Link (Optional)" placeholder="e.g. https://example.com/promo or leave blank" />

        <button 
          @click="addBanner" 
          :disabled="!form.image || !form.title || saving"
          class="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-parentPrimary transition-colors flex items-center justify-center gap-2"
        >
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin shrink-0" />
          <span v-else>PUBLISH BANNER</span>
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Megaphone, Upload, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'
import UiAnimatedInput from '@/components/ui/AnimatedInput.vue'
import Modal from '@/components/ui/Modal.vue'
import { useConfirmModal } from '@/composables/core/useConfirmModal'

definePageMeta({ layout: 'vendor' })
useHead({ title: 'Promotions - Errander Vendor' })

const { showToast } = useCustomToast()
const { confirm } = useConfirmModal()
const { user } = useUser()

const vendorId = ref('')
const banners = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const saving = ref(false)
const uploading = ref(false)

const form = ref({
  image: '',
  title: '',
  description: '',
  link: '',
  productId: '',
  isActive: true
})

const fetchVendorProfile = async () => {
  loading.value = true
  try {
    const res = await api.get('/vendors/mine')
    vendorId.value = res.data._id
    banners.value = res.data.banners || []
  } catch (error) {
    console.error('Failed to load profile', error)
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  try {
    const res = await api.get('/products/vendor/mine')
    products.value = res.data?.products || res.data || []
  } catch (error) {
    console.error('Failed to load products', error)
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('upload?resourceType=image', formData)
    
    if (!res.data || !res.data.url) throw new Error('Upload failed')
    form.value.image = res.data.url
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to upload image', toastType: 'error' })
  } finally {
    uploading.value = false
    target.value = ''
  }
}

const saveBanners = async (updatedBanners: any[]) => {
  saving.value = true
  try {
    await api.put(`/vendors/${vendorId.value}`, { banners: updatedBanners })
    banners.value = updatedBanners
    showToast({ title: 'Success', message: 'Promotions updated successfully.', toastType: 'success' })
    showAddModal.value = false
    form.value = { image: '', title: '', description: '', link: '', productId: '', isActive: true }
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save banner', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const addBanner = () => {
  const updatedBanners = [{ ...form.value }, ...banners.value]
  saveBanners(updatedBanners)
}

const removeBanner = async (index: number) => {
  const isConfirmed = await confirm({ title: 'Delete Banner', message: 'Are you sure you want to delete this promotional banner?', variant: 'danger', confirmText: 'Delete' })
  if (!isConfirmed) return
  const updatedBanners = [...banners.value]
  updatedBanners.splice(index, 1)
  saveBanners(updatedBanners)
}

const toggleBannerStatus = (index: number) => {
  const updatedBanners = [...banners.value]
  updatedBanners[index].isActive = !updatedBanners[index].isActive
  saveBanners(updatedBanners)
}

onMounted(() => {
  fetchVendorProfile()
  fetchProducts()
})
</script>
