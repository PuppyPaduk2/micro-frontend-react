import configServices from "configs/services.json";
import { ChildProcessWithoutNullStreams } from "child_process";

export type ServiceStatus = "stopped" | "run";

export type ServicePlaceOfStart = "terminal" | "controller" | null;

export type ServiceState = {
  status: ServiceStatus;
  placeOfStart: ServicePlaceOfStart;
};

export type ServiceKey = keyof typeof configServices;

export type ServiceConfig = {
  port: number;
  hostName: string;
  host: string;
};

export type ServiceConfigWithKey = ServiceConfig & {
  serviceKey: ServiceKey;
};

export type ServiceProcess = {
  instance: ChildProcessWithoutNullStreams;
  logs: ArrayBuffer[];
};
