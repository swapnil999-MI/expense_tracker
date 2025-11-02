// api/axiosClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URLS, ENDPOINTS, ServiceKey, EndpointKey } from "./config";

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URLS.main,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const api = {
  get: async <S extends ServiceKey, E extends EndpointKey<S>, T = any>(
    service: S,
    endpoint: E,
    slug: string = "",
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const url = `${ENDPOINTS[service][endpoint]}${slug}`;
    return axiosClient.get(url, config);
  },

  post: async <S extends ServiceKey, E extends EndpointKey<S>, T = any>(
    service: S,
    endpoint: E,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const url = ENDPOINTS[service][endpoint];
    return axiosClient.post(url, data, config);
  },

  put: async <S extends ServiceKey, E extends EndpointKey<S>, T = any>(
    service: S,
    endpoint: E,
    slug: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const url = `${ENDPOINTS[service][endpoint]}${slug}`;
    return axiosClient.put(url, data, config);
  },

  delete: async <S extends ServiceKey, E extends EndpointKey<S>, T = any>(
    service: S,
    endpoint: E,
    slug: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const url = `${ENDPOINTS[service][endpoint]}${slug}`;
    return axiosClient.delete(url, config);
  },
};