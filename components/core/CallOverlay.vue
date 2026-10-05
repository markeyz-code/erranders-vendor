<template>
  <div v-if="callState !== 'idle'" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm text-white">
    <!-- INCOMING CALL -->
    <div v-if="callState === 'incoming'" class="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div class="relative">
        <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        <img :src="remoteUser?.avatar || '/placeholder-avatar.png'" class="w-32 h-32 rounded-full border-4 border-primary object-cover relative z-10" />
      </div>
      <div class="text-center">
        <h2 class="text-3xl font-semibold mb-2">{{ remoteUser?.name || 'Unknown' }}</h2>
        <p class="text-white/70 text-lg">Incoming {{ isVideoCall ? 'Video' : 'Audio' }} Call...</p>
      </div>
      <div class="flex items-center gap-8 pt-8">
        <button @click="rejectCall" class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-110">
          <Phone class="w-8 h-8 rotate-135" />
        </button>
        <button @click="acceptCall" class="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <Phone class="w-8 h-8 animate-bounce" />
        </button>
      </div>
    </div>

    <!-- CALLING / RINGING -->
    <div v-else-if="callState === 'calling'" class="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div class="relative">
        <div class="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
        <img :src="remoteUser?.avatar || '/placeholder-avatar.png'" class="w-32 h-32 rounded-full border-4 border-white/20 object-cover relative z-10" />
      </div>
      <div class="text-center">
        <h2 class="text-3xl font-semibold mb-2">{{ remoteUser?.name || 'Unknown' }}</h2>
        <p class="text-white/70 text-lg">Ringing...</p>
      </div>
      <div class="pt-8">
        <button @click="endCall" class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-110">
          <Phone class="w-8 h-8 rotate-135" />
        </button>
      </div>
    </div>

    <!-- CONNECTED -->
    <div v-else-if="callState === 'connected'" class="w-full h-full relative flex items-center justify-center bg-black">
      
      <!-- Remote Video (Full Screen) -->
      <video v-if="isVideoCall" ref="remoteVideoEl" autoplay playsinline class="w-full h-full object-cover"></video>
      <!-- Remote Audio (Hidden) -->
      <audio v-else ref="remoteAudioEl" autoplay playsinline></audio>

      <!-- Audio Call UI (No Video) -->
      <div v-if="!isVideoCall" class="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div class="relative mb-8">
          <div class="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
          <img :src="remoteUser?.avatar || '/placeholder-avatar.png'" class="w-40 h-40 rounded-full border-4 border-primary/50 object-cover relative z-10" />
        </div>
        <h2 class="text-4xl font-semibold mb-2">{{ remoteUser?.name || 'Unknown' }}</h2>
        <p class="text-primary text-xl">00:00</p>
      </div>

      <!-- Local Video (Picture in Picture) -->
      <div v-if="isVideoCall" class="absolute top-6 right-6 w-32 md:w-48 aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/20 z-20 transition-all hover:scale-105">
        <video ref="localVideoEl" autoplay playsinline muted class="w-full h-full object-cover transform -scale-x-100"></video>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-gray-900/80 backdrop-blur-md px-8 py-4 rounded-full z-30 border border-white/10 shadow-xl">
        <button @click="toggleMute" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors" :class="isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'">
          <MicOff v-if="isMuted" class="w-6 h-6" />
          <Mic v-else class="w-6 h-6" />
        </button>
        <button v-if="isVideoCall" @click="toggleVideo" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors" :class="isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'">
          <VideoOff v-if="isVideoOff" class="w-6 h-6" />
          <Video v-else class="w-6 h-6" />
        </button>
        <button @click="endCall" class="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-110 ml-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <Phone class="w-7 h-7 rotate-135" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Phone, Mic, MicOff, Video, VideoOff } from 'lucide-vue-next'
import { useWebRTC } from '~/composables/useWebRTC'

const {
  callState,
  remoteUser,
  isVideoCall,
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  acceptCall,
  rejectCall,
  endCall,
  toggleMute,
  toggleVideo
} = useWebRTC()

const localVideoEl = ref(null)
const remoteVideoEl = ref(null)
const remoteAudioEl = ref(null)

watch(localStream, (stream) => {
  if (localVideoEl.value && stream && isVideoCall.value) {
    localVideoEl.value.srcObject = stream
  }
})

watch(remoteStream, (stream) => {
  if (stream) {
    if (isVideoCall.value && remoteVideoEl.value) {
      remoteVideoEl.value.srcObject = stream
    } else if (!isVideoCall.value && remoteAudioEl.value) {
      remoteAudioEl.value.srcObject = stream
    }
  }
})
</script>
