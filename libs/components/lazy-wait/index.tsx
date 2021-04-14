import React, { FC, useEffect, useState } from "react";
import { useSocket } from "libs/hooks/use-socket";
import { ServiceKey, ServiceStatus, ServiceConfig } from "libs/types";
import { Lazy } from "libs/components/lazy";
import { getServiceState } from "api/controller";
import servicesConfig from "settings/services-config.json";

type Props = Omit<Parameters<typeof Lazy>[0], "src"> & {
  serviceKey: ServiceKey,
  filename?: string;
};

const useServiceStatus = (serviceKey: ServiceKey) => {
  const socket = useSocket("/", "/controller/socket");
  const [status, setStatus] = useState<ServiceStatus>("stopped");

  useEffect(() => {
    getServiceState(serviceKey).then(({ status }) => setStatus(status));
  }, [serviceKey]);

  useEffect(() => {
    const eventServicesRun = "services/run";
    const handler = (data: { serviceKey: ServiceKey }) => {
      if (serviceKey === data.serviceKey) setStatus("run");
    };

    socket.on(eventServicesRun, handler);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off(eventServicesRun, handler);
    };
  }, [socket, serviceKey]);

  return status;
};

const useServiceConfig = (serviceKey: ServiceKey) => {
  const [config, setConfig] = useState<ServiceConfig | null>(null);

  useEffect(() => {
    const serviceConfig = servicesConfig[serviceKey];

    if (serviceConfig) setConfig(serviceConfig);
  }, [serviceKey]);

  return config;
}

export const LazyWait: FC<Props> = (props) => {
  const { serviceKey, filename = "remote.js", ...lazyProps } = props;
  const status = useServiceStatus(serviceKey);
  const config = useServiceConfig(serviceKey);

  if (config && status === "run") {
    return (
      <Lazy
        src={`${config.publicPath}/${filename}`}
        scope={lazyProps.scope}
        expose={lazyProps.expose}
        pending={lazyProps.pending}
        failed={lazyProps.failed}
        fallback={lazyProps.fallback}
        errorTitle={lazyProps.errorTitle}
      >
        {lazyProps.children}
      </Lazy>
    );
  }

  return <></>;
};
