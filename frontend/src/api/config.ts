// src/api/apiConfig.ts

export const API_DOMAIN = "http://localhost:5000";
export const API_VERSION = "v1";

export const BASE_URLS = {
  main: `${API_DOMAIN}/api/${API_VERSION}`, // Your API_ROOT
};

export const ENDPOINTS = {
  main: {
    transactions: "/transactions/",
    dashboard_data: "/transactions/dashboard_data/",
  },
} as const;

export type ServiceKey = keyof typeof ENDPOINTS;
export type EndpointKey<S extends ServiceKey> = keyof typeof ENDPOINTS[S];