import axios from "axios";
import { createSocket } from "libs/socket";
import { ServiceKey, ServiceState } from "common/types";

export const getServicesState = () => {
  return axios.get("/controller/api/services/state")
    .then<Record<ServiceKey, ServiceState>>(({ data }) => data);
}

export const getServiceState = (serviceKey: ServiceKey) => {
  return axios.get(`/controller/api/service/${serviceKey}/state`)
    .then<ServiceState>(({ data }) => data);
};

export const startService = (serviceKey: ServiceKey) => {
  return axios.post(`/controller/api/service/${serviceKey}/start`);
};

export const stopService = (serviceKey: ServiceKey) => {
  return axios.post(`/controller/api/service/${serviceKey}/stop`);
};

export const getServiceProcessLog = (serviceKey: ServiceKey) => {
  return axios.get(`/controller/api/service/${serviceKey}/process/logs`)
    .then<{ type: string, data: number[] }[]>(({ data }) => data);
};

export const getSocket = () => {
  return createSocket("/", "/controller/socket");
};

export const onSocket = {
  connect: (callback: () => void) => {
    getSocket().on("connect", callback);
  },
  serviceStarted: (serviceKey: ServiceKey, callback: (payload: { state: ServiceState }) => void) => {
    getSocket().on(`service/${serviceKey}/started`, callback);
  },
  serviceStopped: (serviceKey: ServiceKey, callback: (payload: { state: ServiceState }) => void) => {
    getSocket().on(`service/${serviceKey}/stopped`, callback);
  },
  serviceProcessStdout: (serviceKey: ServiceKey, callback: (payload: { data: ArrayBuffer }) => void) => {
    getSocket().on(`service/${serviceKey}/process/stdout`, callback);
  },
  serviceProcessStderr: (serviceKey: ServiceKey, callback: (payload: { data: ArrayBuffer }) => void) => {
    getSocket().on(`service/${serviceKey}/process/stderr`, callback);
  },
  serviceProcessClose: (serviceKey: ServiceKey, callback: (payload: { code: number }) => void) => {
    getSocket().on(`service/${serviceKey}/process/close`, callback);
  },
};

export const offSocket = {
  connect: (callback: () => void) => {
    getSocket().off("connect", callback);
  },
  serviceStarted: (serviceKey: ServiceKey, callback: (payload: { state: ServiceState }) => void) => {
    getSocket().off(`service/${serviceKey}/started`, callback);
  },
  serviceStopped: (serviceKey: ServiceKey, callback: (payload: { state: ServiceState }) => void) => {
    getSocket().off(`service/${serviceKey}/stopped`, callback);
  },
  serviceProcessStdout: (serviceKey: ServiceKey, callback: (payload: { data: ArrayBuffer }) => void) => {
    getSocket().off(`service/${serviceKey}/process/stdout`, callback);
  },
  serviceProcessStderr: (serviceKey: ServiceKey, callback: (payload: { data: ArrayBuffer }) => void) => {
    getSocket().off(`service/${serviceKey}/process/stderr`, callback);
  },
  serviceProcessClose: (serviceKey: ServiceKey, callback: (payload: { code: number }) => void) => {
    getSocket().off(`service/${serviceKey}/process/close`, callback);
  },
};
