<template>
  <div class="min-h-screen w-full bg-white sm:bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-parentPrimary/10 rounded-md blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-md blur-[120px] translate-x-1/2 translate-y-1/2"></div>

    <div class="w-full max-w-[340px] relative z-10">
      <!-- Back Link -->
      <button 
        @click="handleBack" 
        class="absolute -top-16 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
      >
        <ArrowLeft class="w-4 h-4" /> {{ currentStep === 'password' ? 'Back' : 'Back to Sign In' }}
      </button>

      <!-- Main Content -->
      <div class="w-full">
        <!-- STEP 1: OTP Verification Screen -->
        <div v-if="currentStep === 'otp'" class="space-y-6">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-md bg-parentPrimary/10 text-parentPrimary mb-6">
              <MailCheck class="w-8 h-8" />
            </div>
            <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Verify Identity</h1>
            <p class="text-gray-500 font-medium text-sm leading-relaxed">
              We sent a 6-digit security code to <br />
              <span class="text-gray-900 font-bold">{{ email }}</span>
            </p>
          </div>

          <!-- Official 6-Digit OTP Field Container -->
          <div class="flex justify-between gap-2 max-w-[340px] mx-auto my-8">
            <input 
              v-for="(_, i) in 6" 
              :key="i" 
              :ref="el => { if (el) otpRefs[i] = el as HTMLInputElement }" 
              v-model="otpDigits[i]" 
              @input="handleOTPInput(i)" 
              @keydown.backspace="handleOTPBackspace(i, $event)" 
              @paste.prevent="handleOTPPaste" 
              type="text" 
              maxlength="1" 
              inputmode="numeric" 
              class="w-12 h-14 text-center text-lg font-medium bg-gray-50 border border-gray-200 rounded-md focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 outline-none transition-all" 
            />
          </div>

          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-md text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button 
            @click="handleVerifyOTP" 
            :disabled="loading || otpDigits.join('').length < 6"
            class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-md font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <span v-else>Verify Reset Code</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <!-- Resend Area -->
          <div class="mt-5 text-center pt-6 border-t border-gray-100">
            <p class="text-gray-500 font-medium text-sm">
              Didn't receive a code? 
              <button 
                @click="handleResendCode" 
                :disabled="cooldown > 0"
                type="button" 
                class="text-parentPrimary font-bold hover:underline focus:outline-none disabled:opacity-50 disabled:no-underline"
              >
                {{ cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code' }}
              </button>
            </p>
          </div>
        </div>

        <!-- STEP 2: Password Reset Screen -->
        <div v-else-if="currentStep === 'password'" class="space-y-6 animate-fade-in">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-md bg-emerald-50 text-emerald-600 mb-6">
              <LockKeyhole class="w-8 h-8" />
            </div>
            <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">New Password</h1>
            <p class="text-gray-500 font-medium text-sm">Create a strong password to secure your account</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <UiAnimatedInput 
              v-model="newPassword" 
              type="password" 
              label="New Password" 
              :hasError="!!validationErrors.newPassword"
              :errorMessage="validationErrors.newPassword"
              @input="validationErrors.newPassword = ''" 
            />

            <UiAnimatedInput 
              v-model="confirmPassword" 
              type="password" 
              label="Confirm Password" 
              :hasError="!!validationErrors.confirmPassword"
              :errorMessage="validationErrors.confirmPassword"
              @input="validationErrors.confirmPassword = ''" 
            />

            <transition name="fade">
              <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-md text-[13px] font-bold text-red-600">
                <AlertCircle class="w-4 h-4 shrink-0" />
                {{ error }}
              </div>
            </transition>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-md font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
              <span v-else>Set New Password</span>
              <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
      
      <!-- Copy info -->
      <div class="mt-5 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Erranders</p>
        <span class="w-1 h-1 bg-gray-300 rounded-md"></span>
        <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MailCheck, LockKeyhole, Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Verify Reset Code - Erranders' })

const route = useRoute()
const router = useRouter()
const { verifyResetOtp, resetPassword, forgotPassword, loading } = useAuth()

const currentStep = ref<'otp' | 'password'>('otp')
const email = ref('')
const error = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const otpDigits = reactive(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])

const validationErrors = reactive({
  newPassword: '',
  confirmPassword: ''
})

// Cooldown state for Resend Button
const cooldown = ref(60)
let cooldownTimer: any = null

const startCooldown = () => {
  cooldown.value = 60
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--
    } else {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email as string
  } else {
    // If no email query is found, route back to forgot-password
    router.push('/auth/forgot-password')
  }
  startCooldown()
  
  // Focus first OTP field automatically
  setTimeout(() => {
    otpRefs.value[0]?.focus()
  }, 200)
})

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// OTP Navigation Methods
const handleOTPInput = (i: number) => {
  // Clear any errors
  error.value = ''
  // Move focus to next field if input was filled
  if (otpDigits[i] && i < 5) {
    otpRefs.value[i + 1]?.focus()
  }
}

const handleOTPBackspace = (i: number, e: KeyboardEvent) => {
  // Move focus back on backspace if current field is empty
  if (!otpDigits[i] && i > 0) {
    otpRefs.value[i - 1]?.focus()
  }
}

const handleOTPPaste = (e: ClipboardEvent) => {
  const pasted = e.clipboardData?.getData('text') || ''
  const numericPasted = pasted.replace(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < 6; i++) {
    otpDigits[i] = numericPasted[i] || ''
  }
  
  // Focus last inputted or empty slot
  const focusIndex = Math.min(numericPasted.length, 5)
  otpRefs.value[focusIndex]?.focus()
}

// Back Button Navigation
const handleBack = () => {
  if (currentStep.value === 'password') {
    currentStep.value = 'otp'
    error.value = ''
    setTimeout(() => {
      otpRefs.value[0]?.focus()
    }, 200)
  } else {
    router.push('/auth/login')
  }
}

// Action Handlers
const handleVerifyOTP = async () => {
  error.value = ''
  const code = otpDigits.join('')
  
  if (code.length < 6) {
    error.value = 'Please enter the full 6-digit reset code'
    return
  }

  try {
    await verifyResetOtp({
      email: email.value,
      otp: code
    })
    // Successfully verified, navigate to set password screen!
    currentStep.value = 'password'
  } catch (e: any) {
    error.value = e.data?.message || e.response?.data?.message || 'Invalid or expired verification code.'
  }
}

const handleResetPassword = async () => {
  error.value = ''
  validationErrors.newPassword = ''
  validationErrors.confirmPassword = ''

  let isValid = true
  if (!newPassword.value) {
    validationErrors.newPassword = 'Password is required'
    isValid = false
  } else if (newPassword.value.length < 6) {
    validationErrors.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  if (newPassword.value !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  if (!isValid) return

  try {
    await resetPassword({
      email: email.value,
      otp: otpDigits.join(''),
      newPassword: newPassword.value
    })
    // Successfully reset! Route to Sign In
    router.push('/auth/login')
  } catch (e: any) {
    error.value = e.data?.message || e.response?.data?.message || 'Failed to set password. Try requesting a new code.'
  }
}

const handleResendCode = async () => {
  error.value = ''
  try {
    await forgotPassword(email.value)
    // Restart resend timer
    startCooldown()
    // Reset OTP boxes
    for (let i = 0; i < 6; i++) otpDigits[i] = ''
    otpRefs.value[0]?.focus()
  } catch (e: any) {
    error.value = e.data?.message || e.response?.data?.message || 'Failed to resend code.'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
