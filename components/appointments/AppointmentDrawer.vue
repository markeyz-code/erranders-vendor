<template>
  <UiSideDrawer 
    :isOpen="isOpen" 
    @close="$emit('close')"
  >
    <div v-if="appointment" class="flex flex-col h-full -mt-6">
      
      <!-- Top Actions (like Fresha's header) -->
      <div class="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div 
            class="w-12 h-12 rounded-md flex items-center justify-center text-xl font-bold text-white"
            :class="getStatusColor(appointment.status).bg"
          >
            {{ clientInitials }}
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ appointment.user?.firstName }} {{ appointment.user?.lastName }}</h3>
            <p class="text-sm text-gray-500">{{ appointment.user?.email || 'No email provided' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2 mb-8">
        <button 
          @click="showChatModal = true"
          class="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex justify-center items-center gap-2"
        >
          <MessageCircle class="w-4 h-4" /> Message
        </button>
        <a 
          :href="appointment.user?.phoneNumber ? `tel:${appointment.user.phoneNumber}` : '#'"
          class="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex justify-center items-center gap-2"
        >
          <Phone class="w-4 h-4" /> Call
        </a>
      </div>

      <!-- Service Details -->
      <div class="space-y-6 flex-1">
        <div>
          <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-parentPrimary" /> 
            {{ formattedDate }}
          </h4>
          
          <div class="p-4 bg-gray-50 rounded-md border border-gray-100 relative overflow-hidden group">
            <div class="absolute left-0 top-0 bottom-0 w-1" :class="getStatusColor(appointment.status).border"></div>
            
            <div class="pl-2">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-bold text-gray-900">{{ appointment.items?.[0]?.service?.name || 'Service' }}</h5>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ appointment.startTime }} - {{ appointment.endTime }} • {{ appointment.items?.[0]?.service?.durationInMinutes || 0 }}min
                  </p>
                </div>
                <span class="text-sm font-bold text-gray-900">₦{{ appointment.price?.toLocaleString() || 0 }}</span>
              </div>
              
              <div class="flex items-center gap-2 mt-3">
                <div class="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center shrink-0">
                  <User class="w-3 h-3 text-gray-500" />
                </div>
                <span class="text-xs font-semibold text-gray-600">With Store Owner</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Info class="w-4 h-4 text-gray-400" /> 
            Booking Info
          </h4>
          <div class="bg-white border border-gray-100 rounded-md p-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Status</span>
              <span 
                class="font-bold px-2 py-0.5 rounded-md text-xs uppercase tracking-wider"
                :class="getStatusColor(appointment.status).badge"
              >
                {{ appointment.status }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Payment</span>
              <span class="font-bold text-gray-900 capitalize">{{ appointment.paymentStatus?.replace('_', ' ') || 'Pending' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Reference</span>
              <span class="font-mono text-gray-900 text-xs">{{ appointment.paymentReference || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Direct Transfer Verification -->
      <div v-if="appointment.paymentStatus === 'pending_verification'" class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <h4 class="text-sm font-bold text-orange-800 mb-2">Direct Transfer - Action Required</h4>
        <p class="text-xs text-orange-700 mb-3">
          The client has indicated they paid via direct bank transfer. Please review their receipt and verify the payment to confirm the booking.
        </p>
        <div v-if="appointment.proofOfPayment" class="mb-4">
          <span class="text-xs font-semibold text-orange-900 block mb-1">Receipt Uploaded:</span>
          <a :href="appointment.proofOfPayment" target="_blank" class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <Paperclip class="w-3 h-3" /> View Proof of Payment
          </a>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="pt-6 mt-6 border-t border-gray-100 space-y-3 relative">
        <div v-if="loading" class="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
          <div class="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>

        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-500">Total Price</span>
          <span class="text-sm font-bold text-gray-900">₦{{ appointment.price?.toLocaleString() || 0 }}</span>
        </div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-500">Commitment Fee (Paid)</span>
          <span class="text-sm font-bold text-green-600">₦{{ appointment.commitmentFee?.toLocaleString() || 0 }}</span>
        </div>
        <div class="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
          <span class="text-sm font-bold text-gray-900">Balance to Collect</span>
          <span class="text-xl font-black text-gray-900">₦{{ appointment.pendingBalance?.toLocaleString() || 0 }}</span>
        </div>

        <div v-if="appointment.status === 'confirmed' || appointment.status === 'pending'" class="bg-blue-50 border border-blue-100 p-3 rounded-md mb-4 flex items-start gap-2">
          <Info class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p class="text-xs text-blue-800">
            Please collect the pending balance of <strong>₦{{ appointment.pendingBalance?.toLocaleString() || 0 }}</strong> in cash or transfer before completing this booking.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <!-- Primary Actions -->
          <button 
            v-if="appointment.paymentStatus === 'pending_verification'"
            @click="promptAction('verify')"
            :disabled="loading"
            class="w-full py-3 bg-orange-600 text-white rounded-md text-sm font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Verify Payment & Confirm
          </button>
          
          <button 
            v-else-if="appointment.status === 'pending'"
            @click="promptAction('status', 'confirmed')"
            :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Confirm Booking
          </button>
          
          <button 
            v-if="appointment.status === 'confirmed'"
            @click="promptAction('status', 'completed')"
            :disabled="loading"
            class="w-full py-3 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Checkout (Complete)
          </button>
          
          <!-- Secondary Action (Cancel) -->
          <button 
            v-if="appointment.status !== 'cancelled' && appointment.status !== 'completed'"
            @click="promptAction('status', 'cancelled')"
            :disabled="loading"
            class="w-full py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50 mt-2"
          >
            Cancel Booking
          </button>
        </div>
      </div>

    </div>
  </UiSideDrawer>

  <!-- Confirmation Modal -->
  <UiConfirmModal
    :is-open="confirmModal.isOpen"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm-text="confirmModal.confirmText"
    :variant="confirmModal.variant"
    @cancel="confirmModal.isOpen = false"
    @confirm="executeAction"
  />

  <!-- Chat Modal -->
  <AppointmentChatModal 
    v-if="appointment"
    :is-open="showChatModal"
    :appointment-id="appointment._id"
    :student-id="appointment.user?._id"
    :student-name="`${appointment.user?.firstName || ''} ${appointment.user?.lastName || ''}`.trim()"
    :student-avatar="appointment.user?.avatar"
    @close="showChatModal = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Calendar, MessageCircle, User, Info, Phone, Paperclip } from 'lucide-vue-next';
import UiSideDrawer from '@/components/ui/SideDrawer.vue';
import UiConfirmModal from '@/components/ui/ConfirmModal.vue';
import AppointmentChatModal from '@/components/core/AppointmentChatModal.vue';

const showChatModal = ref(false);

const props = defineProps<{
  isOpen: boolean;
  appointment: any;
  loading?: boolean;
}>();

const emit = defineEmits(['close', 'updateStatus', 'verifyPayment']);

// Confirmation Modal State
const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  variant: 'info' as 'info'|'warning'|'danger'|'success',
});

// Pending action to execute after confirmation
const pendingAction = ref<{ type: 'status' | 'verify', value?: string } | null>(null);

const promptAction = (type: 'status' | 'verify', statusValue?: string) => {
  pendingAction.value = { type, value: statusValue };
  
  if (type === 'verify') {
    confirmModal.value = {
      isOpen: true,
      title: 'Verify Payment',
      message: 'Are you sure you have verified the direct transfer receipt and want to confirm this booking?',
      confirmText: 'Yes, Verify & Confirm',
      variant: 'success'
    };
  } else if (type === 'status' && statusValue === 'confirmed') {
    confirmModal.value = {
      isOpen: true,
      title: 'Confirm Booking',
      message: 'Are you sure you want to accept and confirm this booking?',
      confirmText: 'Confirm',
      variant: 'info'
    };
  } else if (type === 'status' && statusValue === 'completed') {
    confirmModal.value = {
      isOpen: true,
      title: 'Complete Checkout',
      message: 'Are you sure you want to mark this booking as completely finished?',
      confirmText: 'Complete',
      variant: 'success'
    };
  } else if (type === 'status' && statusValue === 'cancelled') {
    confirmModal.value = {
      isOpen: true,
      title: 'Cancel Booking',
      message: 'Are you absolutely sure you want to cancel this booking? This action cannot be undone.',
      confirmText: 'Cancel Booking',
      variant: 'danger'
    };
  }
};

const executeAction = () => {
  confirmModal.value.isOpen = false;
  
  if (!pendingAction.value || !props.appointment) return;
  
  if (pendingAction.value.type === 'verify') {
    emit('verifyPayment', props.appointment._id);
  } else if (pendingAction.value.type === 'status' && pendingAction.value.value) {
    emit('updateStatus', { id: props.appointment._id, status: pendingAction.value.value });
  }
  
  pendingAction.value = null;
};

const clientInitials = computed(() => {
  if (!props.appointment?.user) return 'C';
  const f = props.appointment.user.firstName?.[0] || '';
  const l = props.appointment.user.lastName?.[0] || '';
  return (f + l).toUpperCase() || 'C';
});

const formattedDate = computed(() => {
  if (!props.appointment?.scheduledDate) return '';
  return new Date(props.appointment.scheduledDate).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending': 
      return { bg: 'bg-yellow-500', border: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' };
    case 'confirmed': 
      return { bg: 'bg-blue-500', border: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' };
    case 'completed': 
      return { bg: 'bg-emerald-500', border: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800' };
    case 'cancelled': 
      return { bg: 'bg-red-500', border: 'bg-red-500', badge: 'bg-red-100 text-red-800' };
    default: 
      return { bg: 'bg-gray-500', border: 'bg-gray-500', badge: 'bg-gray-100 text-gray-800' };
  }
};
</script>
