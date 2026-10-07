<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Exam Mode</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your availability, auto-replies, and study schedules.</p>
      </div>
      <button 
        @click="saveSettings" 
        :disabled="saving"
        class="bg-[#FF5C1A] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <span v-if="saving" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ saving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>

    <div v-if="loading" class="space-y-6">
      <div class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
      <div class="h-64 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>

    <template v-else>
      <!-- Master Toggle -->
      <div class="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm flex items-start gap-4 transition-all" :class="availability.isExamModeActive ? 'ring-2 ring-[#FF5C1A]/20' : ''">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors" :class="availability.isExamModeActive ? 'bg-[#FF5C1A]/10 text-[#FF5C1A]' : 'bg-gray-100 text-gray-400'">
          📚
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-gray-900">Enable Exam Mode</h3>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="availability.isExamModeActive" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
            </label>
          </div>
          <p class="text-sm text-gray-500">When active, your store will adhere to your unavailable ranges and auto-reply rules. Orders outside these ranges will be automatically rescheduled.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" :class="{ 'opacity-50 pointer-events-none grayscale transition-all': !availability.isExamModeActive }">
        
        <!-- Unavailable Ranges -->
        <div class="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900">Unavailable Dates</h3>
              <p class="text-sm text-gray-500 mt-1">Days when you cannot fulfill any orders.</p>
            </div>
            <button @click="addRange" class="text-sm font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1.5 rounded-lg hover:bg-[#FF5C1A]/20 transition-colors">
              + Add Dates
            </button>
          </div>

          <div v-if="availability.unavailableRanges.length === 0" class="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p class="text-sm text-gray-400 font-medium">No unavailable dates set.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(range, idx) in availability.unavailableRanges" :key="idx" class="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-50 group">
              <div class="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase  mb-1">Start</label>
                  <UiDatePicker v-model="range.startDate" class="w-full" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase  mb-1">End</label>
                  <UiDatePicker v-model="range.endDate" class="w-full" />
                </div>
              </div>
              <button @click="removeRange(idx)" class="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors self-end">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Auto-Reply Settings -->
        <div class="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-gray-900">Auto-Reply (Inbox)</h3>
              <p class="text-sm text-gray-500 mt-1">Automatically respond to customers outside your reply hours.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="availability.autoReplyEnabled" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div :class="{ 'opacity-50 pointer-events-none': !availability.autoReplyEnabled }" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Auto-Reply Message</label>
              <textarea 
                v-model="availability.autoReplyMessage" 
                rows="3" 
                placeholder="E.g. I am currently studying and will reply during my active windows."
                class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <div class="pt-2 border-t border-gray-100">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-bold text-gray-700">Active Reply Hours</label>
                <button @click="addReplyHour" class="text-[10px] font-bold text-indigo-600 uppercase  hover:underline">
                  + Add Window
                </button>
              </div>

              <div v-if="availability.replyHours.length === 0" class="text-sm text-gray-400 font-medium ">
                No active reply hours. Auto-reply will always trigger.
              </div>

              <div v-else class="space-y-2">
                <div v-for="(window, idx) in availability.replyHours" :key="idx" class="flex items-center gap-2">
                  <input type="time" v-model="window.startTime" class="flex-1 bg-gray-50 border border-gray-25 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-indigo-500" />
                  <span class="text-gray-400 font-bold text-sm">to</span>
                  <input type="time" v-model="window.endTime" class="flex-1 bg-gray-50 border border-gray-25 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-indigo-500" />
                  <button @click="removeReplyHour(idx)" class="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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
import { Trash2, X } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'dashboard'
})

const profile = useCookie<any>('errandr_vendor_profile')
const { pushToast } = useCustomToast()

const loading = ref(true)
const saving = ref(false)

const availability = ref({
  isExamModeActive: false,
  unavailableRanges: [],
  autoReplyEnabled: false,
  replyHours: [],
  autoReplyMessage: 'I am currently preparing for exams and will reply as soon as I am free.'
})

const vendorId = profile.value?._id

const fetchSettings = async () => {
  if (!vendorId) return
  loading.value = true
  try {
    const res = await exam_mode_api.getAvailability(vendorId)
    if (res?.data) {
      const data = res.data
      availability.value.isExamModeActive = data.isExamModeActive || false
      availability.value.autoReplyEnabled = data.autoReplyEnabled || false
      availability.value.autoReplyMessage = data.autoReplyMessage || 'I am currently preparing for exams and will reply as soon as I am free.'
      
      // Format dates for input[type="date"]
      availability.value.unavailableRanges = (data.unavailableRanges || []).map((r: any) => ({
        startDate: r.startDate ? new Date(r.startDate).toISOString().split('T')[0] : '',
        endDate: r.endDate ? new Date(r.endDate).toISOString().split('T')[0] : ''
      }))
      availability.value.replyHours = data.replyHours || []
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const addRange = () => {
  availability.value.unavailableRanges.push({ startDate: '', endDate: '' })
}
const removeRange = (idx: number) => {
  availability.value.unavailableRanges.splice(idx, 1)
}
const addReplyHour = () => {
  availability.value.replyHours.push({ startTime: '09:00', endTime: '17:00' })
}
const removeReplyHour = (idx: number) => {
  availability.value.replyHours.splice(idx, 1)
}

const saveSettings = async () => {
  if (!vendorId) return
  saving.value = true
  try {
    const payload = {
      isExamModeActive: availability.value.isExamModeActive,
      autoReplyEnabled: availability.value.autoReplyEnabled,
      autoReplyMessage: availability.value.autoReplyMessage,
      unavailableRanges: availability.value.unavailableRanges.filter(r => r.startDate && r.endDate).map(r => ({
        startDate: new Date(r.startDate).toISOString(),
        endDate: new Date(r.endDate).toISOString()
      })),
      replyHours: availability.value.replyHours.filter(r => r.startTime && r.endTime)
    }
    await exam_mode_api.updateAvailability(vendorId, payload)
    pushToast('Success', 'Exam mode settings saved.', 'SUCCESS')
  } catch (error) {
    console.error(error)
    pushToast('Error', 'Failed to save settings.', 'ERROR')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
