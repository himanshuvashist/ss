import config from "../config/config";
import { PRODUCT } from "../constants/backend.constants";
import axiosInstance from "../utils/axios.utils";

type ListProductApi = {
  query?: Record<string, any>;
};

const listProducts = (args?: ListProductApi) => {
  let url = config.BACKEND_BASE + PRODUCT.LIST;

  let query = args?.query || {};
  return axiosInstance.get(url, {
    params: query,
  });
};

export { listProducts };
