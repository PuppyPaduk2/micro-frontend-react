import { getServicesState } from "api/controller";
import { ServiceKey, ServicePlaceOfStart, ServiceStatus } from "libs/types";
import { useCallback, useEffect, useState } from "react";
import servicesConfig from "settings/services-config.json";
import { DataRun, DataStopped, useServicesRunStopped } from "../use-services-run-stopped";

export type Service = {
  serviceKey: ServiceKey;
  publicPath: string,
  status: ServiceStatus | null;
  mode: ServicePlaceOfStart;
};

const defServices: Service[] = Object.entries(servicesConfig).map(([serviceKey, config]) => ({
  serviceKey: serviceKey as ServiceKey,
  publicPath: config.publicPath,
  status: null,
  mode: null,
}));

export const useServices = (): Service[] => {
  const [services, setServices] = useState<Service[]>(defServices);

  useEffect(() => {
    getServicesState().then((servicesState) => {
      setServices((services) => services.map((service) => {
        const state = servicesState[service.serviceKey];
        if (state) {
          service.status = state.status;
          service.mode = state.placeOfStart;
        }
        return service;
      }));
    });
  }, []);

  const onRun = useCallback((data: DataRun) => {
    setServices((services) => services.map((service) => {
      if (service.serviceKey === data.serviceKey) {
        service.status = "run";
        service.mode = data.mode;
      }
      return service;
    }));
  }, []);

  const onStopped = useCallback((data: DataStopped) => {
    setServices((services) => services.map((service) => {
      if (service.serviceKey === data.serviceKey) {
        service.status = "stopped";
        service.mode = null;
      }
      return service;
    }));
  }, []);

  useServicesRunStopped({ onRun, onStopped });

  return services;
};