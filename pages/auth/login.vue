<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <!-- Form Card -->
    <div class="w-full max-w-md flex flex-col justify-center px-0 sm:px-6 py-12 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-10 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-4 inline-block group">
          <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo.png" class="h-12 w-auto" />
          </div>
        </NuxtLink>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
        <p class="text-gray-500 text-base">Sign in to your vendor dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 max-w-md">
        <UiAnimatedInput 
          v-model="email" 
          type="email" 
          label="Email Address" 
          :hasError="!!validationErrors.email"
          :errorMessage="validationErrors.email"
          @input="validationErrors.email = ''" 
          required 
        />
        
        <div class="space-y-2">
          <UiAnimatedInput 
            v-model="password" 
            type="password" 
            label="Password" 
            :hasError="!!validationErrors.password"
            :errorMessage="validationErrors.password"
            @input="validationErrors.password = ''" 
            required 
          />
          <div class="flex justify-end">
            <NuxtLink to="/auth/forgot-password" class="text-sm font-semibold text-[#FF5C1A] hover:underline">
              Forgot password?
            </NuxtLink>
          </div>
        </div>

        <transition name="fade">
          <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600">
            <AlertCircle class="w-5 h-5 shrink-0" />
            {{ error }}
          </div>
        </transition>

        <button type="submit" :disabled="loading"
          class="w-full py-3.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#FF5C1A]/20">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          {{ loading ? 'signing in...' : 'sign in' }}
        </button>
      </form>

      <div class="max-w-md w-full mt-6">
        <button type="button" @click="firebaseLogin()" :disabled="firebaseLoading" class="w-full py-3.5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          <Loader2 v-if="firebaseLoading" class="animate-spin w-5 h-5" />
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ firebaseLoading ? 'Connecting...' : 'Continue with Google' }}
        </button>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-sm text-gray-400 font-bold">or</span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <p class="text-center text-gray-600 font-medium mt-8 text-base">
          Don't have a store yet? <NuxtLink to="/auth/register" class="text-[#FF5C1A] font-bold hover:underline">Open one now</NuxtLink>
        </p>
      </div>

      <div class="mt-auto pt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Erranders</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Store, Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Merchant Sign In - Erranders' })

const { login, firebaseLogin, loading, firebaseLoading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')

const validationErrors = reactive({
  email: '',
  password: ''
})

const validate = () => {
  let isValid = true
  validationErrors.email = ''
  validationErrors.password = ''

  if (!email.value) {
    validationErrors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationErrors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    validationErrors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  error.value = ''
  if (!validate()) return

  try { 
    await login({ email: email.value, password: password.value }) 
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Invalid credentials' 
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
