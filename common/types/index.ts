import servicesConfig from "settings/services-config.json";
import { ChildProcessWithoutNullStreams } from "child_process";

export type ServiceStatus = "stopped" | "run";

export type ServicePlaceOfStart = "terminal" | "controller" | null;

export type ServiceState = {
  status: ServiceStatus;
  placeOfStart: ServicePlaceOfStart;
};

export type ServicesConfig = typeof servicesConfig;

export type ServiceKey = keyof ServicesConfig;

export type ServiceConfig = {
  port: number;
  host: string;
  publicPath: string;
};

export type ServiceConfigWithKey = ServiceConfig & {
  serviceKey: ServiceKey;
};

export type ServiceProcess = {
  instance: ChildProcessWithoutNullStreams;
  logs: ArrayBuffer[];
};
