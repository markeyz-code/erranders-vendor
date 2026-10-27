import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useNetworkStatus } from '@/composables/core/useNetworkStatus'// const { showToast } = useCustomToast(); // Removed top-level call

// const { token, logOut } = useUser(); // REMOVED TOP-LEVEL CALL

const isDev = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;
const rawBaseUrl = envApiUrl || (isDev ? "http://localhost:3000" : "https://api.erranders.org");
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = cleanBaseUrl;
const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${cleanBaseUrl}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = cleanBaseUrl;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
  IMAGE_UPLOAD_ENDPOINT
];

/**
 * The signed-in vendor's campus, read from the `errandr_vendor_user` cookie the
 * same way the token above is read from `errandr_vendor_token`.
 *
 * Accepts a plain ObjectId/slug (`user.institution`) or a populated document
 * (`user.institution._id`). Returns '' when the account has no campus, in which
 * case no header is sent and the backend keeps its previous unscoped behaviour.
 */
const readInstitutionId = (): string => {
  let rawUser: any = null;

  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )errandr_vendor_user=([^;]+)'));
    if (match) {
      try {
        rawUser = JSON.parse(decodeURIComponent(match[2]));
      } catch (e) {}
    }
    // `setUser` also mirrors the user into localStorage, so fall back to it
    // when the cookie was dropped.
    if (!rawUser) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) rawUser = JSON.parse(stored);
      } catch (e) {}
    }
  } else {
    try {
      const { useCookie } = require('#app');
      const cookieUser = useCookie('errandr_vendor_user').value;
      rawUser = typeof cookieUser === 'string' ? JSON.parse(cookieUser) : cookieUser;
    } catch (e) {}
  }

  const institution = rawUser?.institution;
  if (!institution) return '';

  const ref = typeof institution === 'object'
    ? (institution._id || institution.slug)
    : institution;
  return typeof ref === 'string' ? ref.trim() : '';
};

instanceArray.forEach((instance) => {
  instance.defaults.timeout = 15000; // Set global timeout to 15 seconds
  instance.interceptors.request.use((config: any) => {
    let currentToken = null;
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )errandr_vendor_token=([^;]+)'));
      if (match) {
        currentToken = match[2];
      } else if (typeof localStorage !== 'undefined') {
        currentToken = localStorage.getItem('token') || localStorage.getItem('errandr_vendor_token') || null;
      }
    } else {
      try {
        const { useCookie } = require('#app');
        currentToken = useCookie('errandr_vendor_token').value;
      } catch (e) {}
    }
    
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    // A vendor belongs to exactly one campus, so every request is pinned to it.
    // The backend resolves tenancy from the authenticated user *before* this
    // header, so it can never widen or move the account's campus — sending it
    // simply makes the scoping explicit.
    const institutionId = readInstitutionId();
    if (institutionId) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('X-Institution-Id', institutionId);
      } else {
        config.headers['X-Institution-Id'] = institutionId;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    async (err: any) => {
      // Check for timeout or network connection error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || typeof err.response === "undefined") {
        try {
          const { recordSlowNetwork } = useNetworkStatus();
          recordSlowNetwork();
        } catch (e) {}

        let errorMessage = "Network Error. Please check your connection.";
        // In a browser, if it's a Network Error and we are online, it's highly likely a CORS error or server down
        if (typeof window !== 'undefined' && window.navigator.onLine && err.message?.includes('Network Error')) {
          errorMessage = "Network Error (or CORS error). The server might be unreachable or rejecting the request origin.";
        }

        useCustomToast().showToast({
          title: "Connection Error",
          message: errorMessage,
          toastType: "error",
          duration: 4000
        });

        return {
          type: "ERROR",
          ...(err.response || { status: 0, statusText: errorMessage }),
        };
      }
      if (err.response.status === 401) {
        const originalRequest = err.config;

        if (originalRequest && !originalRequest._retry && typeof window !== 'undefined') {
          originalRequest._retry = true;
          let refreshToken = '';
          const match = document.cookie.match(new RegExp('(^| )errandr_vendor_refresh_token=([^;]+)'));
          if (match) {
            refreshToken = match[2];
          } else if (typeof localStorage !== 'undefined') {
            refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('errandr_vendor_refresh_token') || '';
          }

          if (refreshToken) {
            try {
              const res = await axios.post(`${$GATEWAY_ENDPOINT}/auth/refresh`, { refreshToken });
              const resData = res.data?.data || res.data;
              const newToken = resData?.token;
              const newRefresh = resData?.refreshToken;
              const newUser = resData?.user;

              if (newToken) {
                const { setToken, setRefreshToken, setUser } = useUser();
                setToken(newToken);
                if (newRefresh) setRefreshToken(newRefresh);
                if (newUser) setUser(newUser);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
              }
            } catch (refreshErr) {
              console.warn('Vendor token refresh failed:', refreshErr);
            }
          }
        }

        // Only log out if on a protected route requiring auth
        const isOnAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');
        const isProtectedRoute = typeof window !== 'undefined' && (
          window.location.pathname.startsWith('/dashboard') || 
          window.location.pathname.startsWith('/orders') || 
          window.location.pathname.startsWith('/menu') || 
          window.location.pathname.startsWith('/settings')
        );

        if (!isOnAuthPage && isProtectedRoute && typeof window !== 'undefined') {
          const { logOut } = useUser();
          logOut();
          useCustomToast().showToast({
            title: "Session Expired",
            message: "Please login to continue",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 404) {
        // Removed aggressive redirect to /auth/register for 'Vendor not found'
        // This allows the UI to handle the empty state or onboarding flow naturally
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data.message) {
          useCustomToast().showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
