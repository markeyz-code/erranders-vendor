import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const wallets_api = {
  getWallet: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/mine');
  },

  getTransactions: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/transactions');
  },

  updatePreferences: (payload: { preference: string; bankDetails?: any }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/wallets/preferences', payload);
  },

  withdraw: (amount: number, bankAccount?: any, isInstant?: boolean) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/wallets/withdraw', { amount, bankAccount, isInstant });
  },

  downloadReceipt: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/wallets/transactions/${id}/receipt`, { responseType: 'blob' });
  },
};
