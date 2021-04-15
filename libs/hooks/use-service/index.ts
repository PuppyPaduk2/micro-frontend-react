import { ServiceKey } from "libs/types";
import { useCallback, useEffect, useState } from "react";
import { Service } from "libs/hooks/use-services";
import servicesConfig from "settings/services-config.json";
import { getServiceState } from "api/controller";
import { DataRun, DataStopped, useServicesRunStopped } from "../use-services-run-stopped";

export const useService = (
  serviceKey: ServiceKey,
  quiet: boolean = false,
): Service => {
  const [state, setState] = useState<{ service: Service; isInit: boolean }>({
    service: {
      serviceKey,
      publicPath: servicesConfig[serviceKey].publicPath,
      status: null,
      mode: null,
    },
    isInit: false,
  });

  useEffect(() => {
    getServiceState(serviceKey).then(({ status, mode }) => {
      setState((state) => ({
        isInit: status === "run",
        service: { ...state.service, status, mode },
      }));
    });
  }, [serviceKey]);

  const onRun = useCallback((data: DataRun) => {
    if (data.serviceKey === serviceKey) {
      setState((state) => {
        state.service.status = "run";
        state.service.mode = data.mode;

        if (quiet && state.isInit) return state;
        else return { ...state };
      });
    }
  }, [serviceKey, quiet]);

  const onStopped = useCallback((data: DataStopped) => {
    if (data.serviceKey === serviceKey) {
      setState((state) => {
        state.service.status = "stopped";
        state.service.mode = null;

        if (quiet && state.isInit) return state;
        else return { ...state };
      });
    }
  }, [serviceKey, quiet]);

  useServicesRunStopped({ onRun, onStopped });

  return state.service;
};