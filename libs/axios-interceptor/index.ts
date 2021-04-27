import Emittery from 'emittery';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosInterceptor = new Emittery<{
  request: AxiosRequestConfig;
  response: AxiosResponse<any>;
  failure: any;
}>();

axios.interceptors.request.use((request) => {
  axiosInterceptor.emit("request", request);
  return request;
});

axios.interceptors.response.use((response) => {
  axiosInterceptor.emit("response", response);
  return response;
}, (error) => {
  axiosInterceptor.emit("failure", error);
  return Promise.reject(error);
});
