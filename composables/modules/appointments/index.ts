import { ref } from 'vue';
import { appointments_api } from "@/api_factory/modules/appointments";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";

export const useVendorAppointments = () => {
  const { showToast } = useCustomToast();
  const { startLoading, stopLoading } = useLoader();
  const appointmentsList = ref<any[]>([]);
  const loading = ref(false);

  const fetchAppointments = async (params?: any) => {
    loading.value = true;
    try {
      const res = await appointments_api.getAppointments(params);
      appointmentsList.value = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: string, status: string) => {
    startLoading('Updating appointment status...');
    try {
      await appointments_api.updateStatus(id, status);
      showToast({
        title: "Status Updated",
        message: `Appointment is now ${status}.`,
        toastType: "success",
      });
      await fetchAppointments();
      return true;
    } finally {
      stopLoading();
    }
  };

  const verifyPayment = async (id: string) => {
    startLoading('Verifying payment...');
    try {
      await appointments_api.verifyPayment(id);
      showToast({
        title: "Payment Verified",
        message: "Payment successfully verified.",
        toastType: "success",
      });
      await fetchAppointments();
      return true;
    } catch (e: any) {
      showToast({
        title: "Error",
        message: e.response?.data?.message || "Failed to verify payment",
        toastType: "error",
      });
      return false;
    } finally {
      stopLoading();
    }
  };

  return { appointmentsList, loading, fetchAppointments, updateStatus, verifyPayment };
};
