import axios from "axios";
import { ServiceKey, ServiceMode, ServiceState } from "libs/types";

export const getServicesState = () => {
  return axios.get("/controller/api/services/state")
    .then<Record<ServiceKey, ServiceState>>(({ data }) => data);
}

export const getServiceState = (serviceKey: ServiceKey) => {
  return axios.get(`/controller/api/services/state/${serviceKey}`)
    .then<ServiceState>(({ data }) => data);
};

export const runService = (serviceKey: ServiceKey, mode: ServiceMode = "controller") => {
  return axios.post(`/controller/api/services/run`, { serviceKey, mode });
};

export const stopService = (serviceKey: ServiceKey) => {
  return axios.post(`/controller/api/services/stop`, { serviceKey });
};

