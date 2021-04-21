import { getServiceState, offSocket, onSocket } from "api/controller";
import { ServiceKey, ServiceState } from "common/types";
import { useEffect, useState } from "react";

export const useService = (
  serviceKey: ServiceKey,
): ServiceState => {
  const [serviceState, setServiceState] = useState<ServiceState>({
    status: "stopped",
    placeOfStart: null,
  });

  useEffect(() => {
    getServiceState(serviceKey).then(setServiceState);

    const onChangeState = ({ state }: { state: ServiceState }) => setServiceState(state);

    onSocket.serviceStarted(serviceKey, onChangeState);
    onSocket.serviceStopped(serviceKey, onChangeState);

    return () => {
      offSocket.serviceStarted(serviceKey, onChangeState);
      offSocket.serviceStopped(serviceKey, onChangeState);
    };
  }, [serviceKey]);

  return serviceState;
};