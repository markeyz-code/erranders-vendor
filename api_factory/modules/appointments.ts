import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const appointments_api = {
  getAppointments: (params?: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/appointments/vendor', { params });
  },
  updateStatus: (id: string, status: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/appointments/${id}/status`, { status });
  },
  verifyPayment: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/appointments/${id}/verify-payment`);
  }
};
