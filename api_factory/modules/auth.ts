import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const auth_api = {
  register: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/register', payload);
  },

  login: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/login', payload);
  },

  firebaseLogin: (payload: { idToken: string; role?: string; isSignUp?: boolean }) => {
    return GATEWAY_ENDPOINT.post('/auth/firebase', payload);
  },

  verifyOtp: (payload: { email: string; otp: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/verify-otp', payload);
  },

  resendOtp: (email: string) => {
    return GATEWAY_ENDPOINT.post('/auth/send-otp', { email });
  },

  forgotPassword: (email: string) => {
    return GATEWAY_ENDPOINT.post('/auth/forgot-password', { email });
  },

  verifyResetOtp: (payload: { email: string; otp: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/verify-reset-otp', payload);
  },

  resetPassword: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/reset-password', payload);
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/profile');
  },

  updateProfile: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/users/me', payload);
  },
};
