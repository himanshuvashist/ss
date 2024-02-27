import axios, { AxiosInstance } from 'axios';

interface AxiosInstanceWithCancel extends AxiosInstance {
    cancel:(requestId:string)=>void;
  }

// Create axios instance with cancellation
const axiosInstance = axios.create() as AxiosInstanceWithCancel;
const abortControllers: Record<string, AbortController> = {};
  
// Define cancel method to cancel request
axiosInstance.cancel = (requestId:string) => {
      if (abortControllers[requestId]) {
          abortControllers[requestId].abort();
          delete abortControllers[requestId];
        }
    };

// Add request interceptor to handle cancellation
axiosInstance.interceptors.request.use((config) => {
  const requestId = config.url as string;
  if (abortControllers[requestId]) {
    axiosInstance.cancel(requestId);
  }
  abortControllers[requestId] = new AbortController();
  config.signal = abortControllers[requestId].signal;

  return config;
});

export default axiosInstance;