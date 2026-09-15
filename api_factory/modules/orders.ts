import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const orders_api = {
  getOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/mine');
  },
  
  getMyVendorOrders: (params?: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/vendor/mine', { params });
  },
  
  getOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/orders/${id}`);
  },

  createOrder: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/orders', payload);
  },

  updateOrderStatus: (id: string, status: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: (id: string, reason: string = 'Cancelled by vendor') => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/cancel`, { reason });
  },

  getErranderOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/available');
  },

  assignOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/accept`);
  },

  getRecurringForecasts: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/recurring-orders/vendor-forecast');
  }
};
