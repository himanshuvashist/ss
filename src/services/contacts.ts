// import axios from "axios";
import config from "../config/config";
import { CONTACT,PURCHASE } from "../constants/backend.constants";
import axiosInstance from "../utils/axios.utils";

type purchasesContactsApi = {
  query?: Record<string, any>;
};

const listPurchasesContacts = (args?: purchasesContactsApi) => {
  let url = config.BACKEND_BASE + PURCHASE.LIST + CONTACT.LIST;

  let query = args?.query || {};
  return axiosInstance.get(url, {
    params: query,
  });
};

export { listPurchasesContacts };
