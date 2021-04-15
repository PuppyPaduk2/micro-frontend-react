import servicesConfig from 'settings/services-config.json'

export type ServiceStatus = "stopped" | "run";

export type ServiceMode = "terminal" | "controller" | null;

export type ServiceState = {
  status: ServiceStatus;
  mode: ServiceMode;
};

export type ServicesConfig = typeof servicesConfig;

export type ServiceKey = keyof ServicesConfig;

export type ServiceConfig = {
  port: number;
  host: string;
  publicPath: string;
};
