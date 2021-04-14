import axios from "axios";
import { ServiceKey, ServiceState } from "libs/types";

export const getServicesState = () => {
  return axios.get("/controller/api/services/state")
    .then<Record<ServiceKey, ServiceState>>(({ data }) => data);
}

export const getServiceState = (serviceKey: ServiceKey) => {
  return axios.get(`/controller/api/services/state/${serviceKey}`)
    .then<ServiceState>(({ data }) => data);
};

// export const getServiceConfig = (serviceKey: ServiceKey) => {
//   return axios.get(`/controller/api/services/config/${serviceKey}`)
//     .then<ServiceConfig>(({ data }) => data);
// };
