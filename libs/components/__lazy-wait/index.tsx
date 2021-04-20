import React, { FC, useEffect, useState } from "react";
import { ServiceKey } from "libs/types";
import { Lazy } from "libs/components/lazy";
import servicesConfig from "settings/services-config.json";
import { useService } from "libs/hooks/use-service";

type Props = Omit<Parameters<typeof Lazy>[0], "src"> & {
  serviceKey: ServiceKey,
  filename?: string;
};

export const LazyWait: FC<Props> = (props) => {
  const { serviceKey, filename = "remote.js", ...lazyProps } = props;
  const { status: serviceStatus } = useService(serviceKey);
  const config = servicesConfig[serviceKey];
  const [isInitService, setIsInitService] = useState<boolean>(false);

  useEffect(() => {
    if (serviceStatus === "run") setIsInitService(true);
  }, [serviceStatus]);

  if (config && isInitService) {
    // return (
    //   <Lazy
    //     src={`${config.publicPath}/${filename}`}
    //     scope={lazyProps.scope}
    //     expose={lazyProps.expose}
    //     pending={lazyProps.pending}
    //     failed={lazyProps.failed}
    //     fallback={lazyProps.fallback}
    //     errorTitle={lazyProps.errorTitle}
    //   >
    //     {lazyProps.children}
    //   </Lazy>
    // );
  }

  return <></>;
};
