<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Content Planner</h1>
        <p class="text-sm text-gray-500 mt-1">Schedule your posts while you are away in Exam Mode.</p>
      </div>
      <button 
        @click="showModal = true" 
        class="bg-[#FF5C1A] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:brightness-110 transition-all flex items-center gap-2"
      >
        <span>+ Schedule Post</span>
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>

    <template v-else>
      <div v-if="plans.length === 0" class="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">
          🗓️
        </div>
        <h3 class="text-lg font-bold text-gray-900">No scheduled content</h3>
        <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Plan ahead by writing captions and scheduling them to be posted automatically.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="plan in plans" :key="plan._id" class="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm group hover:border-[#FF5C1A]/30 transition-all">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold px-2 py-1 rounded-md uppercase " :class="getStatusClass(plan.status)">
              {{ plan.status }}
            </span>
            <button @click="deletePlan(plan._id)" class="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          
          <p class="text-sm text-gray-700 font-medium mb-6 line-clamp-4 whitespace-pre-wrap">{{ plan.caption }}</p>
          
          <div class="pt-4 border-t border-gray-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase ">Scheduled For</p>
              <p class="text-sm font-bold text-gray-900">{{ formatDate(plan.scheduledDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Create Plan Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">Schedule New Post</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-900 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">Caption text</label>
            <textarea 
              v-model="newPlan.caption" 
              rows="4" 
              placeholder="Write what you want to post..."
              class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">Scheduled Date & Time</label>
            <input 
              type="datetime-local" 
              v-model="newPlan.scheduledDate" 
              class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" 
            />
          </div>
        </div>
        
        <div class="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showModal = false" class="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            @click="submitPlan" 
            :disabled="saving"
            class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <span v-if="saving" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ saving ? 'Scheduling...' : 'Schedule Post' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { exam_mode_api } from '@/api_factory/modules/exam-mode'
import { useCookie } from '#app'
import { Trash2, X, Calendar } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'dashboard'
})

const profile = useCookie<any>('errandr_vendor_profile')
const { pushToast } = useCustomToast()

const loading = ref(true)
const saving = ref(false)
const plans = ref<any[]>([])
const showModal = ref(false)

const vendorId = profile.value?._id

const newPlan = ref({
  caption: '',
  scheduledDate: '',
  type: 'feed',
  status: 'SCHEDULED'
})

const fetchPlans = async () => {
  if (!vendorId) return
  loading.value = true
  try {
    const res = await exam_mode_api.getContentPlans(vendorId)
    if (res?.data) {
      plans.value = res.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const submitPlan = async () => {
  if (!newPlan.value.caption || !newPlan.value.scheduledDate) {
    pushToast('Error', 'Please fill in all fields.', 'ERROR')
    return
  }
  
  if (!vendorId) return
  saving.value = true
  try {
    const payload = {
      ...newPlan.value,
      scheduledDate: new Date(newPlan.value.scheduledDate).toISOString()
    }
    await exam_mode_api.createContentPlan(vendorId, payload)
    pushToast('Success', 'Content plan scheduled successfully.', 'SUCCESS')
    showModal.value = false
    newPlan.value = { caption: '', scheduledDate: '', type: 'feed', status: 'SCHEDULED' }
    fetchPlans()
  } catch (error) {
    console.error(error)
    pushToast('Error', 'Failed to schedule plan.', 'ERROR')
  } finally {
    saving.value = false
  }
}

const deletePlan = async (id: string) => {
  if (!vendorId) return
  if (!confirm('Are you sure you want to delete this scheduled post?')) return
  try {
    await exam_mode_api.deleteContentPlan(vendorId, id)
    plans.value = plans.value.filter(p => p._id !== id)
    pushToast('Success', 'Plan deleted.', 'SUCCESS')
  } catch (error) {
    console.error(error)
    pushToast('Error', 'Failed to delete plan.', 'ERROR')
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'bg-indigo-50 text-indigo-600'
    case 'POSTED': return 'bg-emerald-50 text-emerald-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
