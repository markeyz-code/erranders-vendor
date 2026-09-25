<template>
  <div class="min-h-screen w-full bg-white sm:bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-parentPrimary/10 rounded-md blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-md blur-[120px] translate-x-1/2 translate-y-1/2"></div>

    <div class="w-full max-w-[340px] relative z-10">
      <!-- Back to Login -->
      <NuxtLink to="/auth/login" class="absolute -top-16 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to Sign In
      </NuxtLink>

      <!-- Main Content -->
      <div class="w-full">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-md bg-parentPrimary/10 text-parentPrimary mb-6">
            <KeyRound class="w-8 h-8" />
          </div>
          <h1 class="text-lg font-medium text-gray-900 tracking-tight mb-2">Forgot Password</h1>
          <p class="text-gray-500 font-medium text-sm">Enter your email to receive a password reset code</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <UiAnimatedInput 
            v-model="email" 
            type="email" 
            label="Email Address" 
            :hasError="!!validationError"
            :errorMessage="validationError"
            @input="validationError = ''" 
          />

          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-md text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button type="submit" :disabled="loading"
            class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-md font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98]">
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <span v-else>Send Code</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center pt-8 border-t border-gray-200">
          <p class="text-gray-500 font-medium text-sm">
            Remembered your password? 
            <NuxtLink to="/auth/login" class="text-parentPrimary font-bold hover:underline">Sign in</NuxtLink>
          </p>
        </div>
      </div>
      
      <div class="mt-5 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Erranders</p>
        <span class="w-1 h-1 bg-gray-300 rounded-md"></span>
        <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound, Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Forgot Password - Erranders' })

const router = useRouter()
const { forgotPassword, loading } = useAuth()

const email = ref('')
const error = ref('')
const validationError = ref('')

const validate = () => {
  validationError.value = ''
  if (!email.value) {
    validationError.value = 'Email address is required'
    return false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationError.value = 'Please enter a valid email address'
    return false
  }
  return true
}

const handleSubmit = async () => {
  error.value = ''
  if (!validate()) return

  try { 
    await forgotPassword(email.value)
    // Navigate to reset password page with email in query
    router.push({
      path: '/auth/reset-password',
      query: { email: email.value }
    })
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Failed to request reset OTP. Check your internet connection.' 
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
