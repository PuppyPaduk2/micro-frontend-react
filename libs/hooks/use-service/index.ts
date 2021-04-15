import { ServiceKey } from "libs/types";
import { useCallback, useEffect, useState } from "react";
import { Service } from "libs/hooks/use-services";
import servicesConfig from "settings/services-config.json";
import { getServiceState } from "api/controller";
import { DataRun, DataStopped, useServicesRunStopped } from "../use-services-run-stopped";

export const useService = (serviceKey: ServiceKey): Service => {
  const [service, setService] = useState<Service>({
    serviceKey,
    publicPath: servicesConfig[serviceKey].publicPath,
    status: null,
    mode: null,
  });

  useEffect(() => {
    getServiceState(serviceKey).then((state) => {
      setService((service) => ({
        ...service,
        status: state.status,
        mode: state.mode,
      }));
    });
  }, [serviceKey]);

  const onRun = useCallback((data: DataRun) => {
    if (data.serviceKey === serviceKey) {
      setService((service) => ({
        ...service,
        status: "run",
        mode: data.mode,
      }));
    }
  }, [serviceKey]);

  const onStopped = useCallback((data: DataStopped) => {
    if (data.serviceKey === serviceKey) {
      setService((service) => ({
        ...service,
        status: "stopped",
        mode: null,
      }));
    }
  }, [serviceKey]);

  useServicesRunStopped({ onRun, onStopped });

  return service;
};