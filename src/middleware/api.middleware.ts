import AppConfig from "../config/config";
import axiosInstance from "../utils/axios.utils";

export const requestApiMiddleware = () => {

  axiosInstance.interceptors.request.use((config: any) => {
    let token = AppConfig.BACKEND_TOKEN;
    if (token) {
      config["headers"]["Authorization"] = "Token " + token;
    }
    return config;
  });
};
