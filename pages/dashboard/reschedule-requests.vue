<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Reschedule Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Orders auto-rescheduled due to Exam Mode.</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>

    <template v-else>
      <div v-if="requests.length === 0" class="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">
          🗓️
        </div>
        <h3 class="text-lg font-bold text-gray-900">No requests yet</h3>
        <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">When customers place orders during your unavailable times, they will be asked to reschedule, and the requests will appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="req in requests" :key="req._id" class="bg-white rounded-2xl border border-gray-50 p-5 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" :class="getStatusBg(req.status)">
              <span v-if="req.status === 'PENDING'">⏳</span>
              <span v-else-if="req.status === 'ACCEPTED'">✅</span>
              <span v-else>❌</span>
            </div>
            
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-gray-900">Order #{{ req.orderId?.orderNumber || '...' }}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest" :class="getStatusColor(req.status)">
                  {{ req.status.replace('_', ' ') }}
                </span>
              </div>
              <p class="text-sm text-gray-500 flex items-center gap-2">
                <span class="line-through decoration-red-300">{{ formatDate(req.originalDate) }}</span>
                <span class="text-gray-300">→</span>
                <span class="font-bold text-gray-700">{{ formatDate(req.suggestedDate) }}</span>
              </p>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-xs text-gray-400 font-medium mb-1">Customer</p>
            <p class="text-sm font-bold text-gray-900">{{ req.customerId?.firstName }} {{ req.customerId?.lastName }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { exam_mode_api } from '@/api_factory/modules/exam-mode'
import { useCookie } from '#app'

definePageMeta({
  layout: 'dashboard'
})

const profile = useCookie<any>('errandr_vendor_profile')
const loading = ref(true)
const requests = ref<any[]>([])

const vendorId = profile.value?._id

const fetchRequests = async () => {
  if (!vendorId) return
  loading.value = true
  try {
    const res = await exam_mode_api.getRescheduleRequests(vendorId)
    if (res?.data) {
      requests.value = res.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-100 text-amber-700'
    case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-red-100 text-red-700'
  }
}

const getStatusBg = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50'
    case 'ACCEPTED': return 'bg-emerald-50'
    default: return 'bg-red-50'
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
