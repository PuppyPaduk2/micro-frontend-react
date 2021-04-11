import React, { FC, useEffect, useState } from 'react';

import { LoadComponent } from "./load-component";
import { getState, getSocket, useSocketEvent, useSocketConnect } from "../services";

const socket = getSocket("/controller");

export const ServiceComponent: FC<{ serviceKey: string; expose: string; }> = ({ serviceKey, expose }) => {
  const [serviceState, setServiceState] = useState<any>(null);

  useEffect(() => {
    getState({ baseUrl: "/controller", serviceKey })
      .then(({ data }) => setServiceState(data))
      .catch(() => {});
  }, [serviceKey]);

  useSocketEvent(socket, "services/run", () => setServiceState((prev) => ({ ...prev, status: "run" })));

  useSocketEvent(socket, "services/stopped", () => setServiceState((prev) => ({ ...prev, status: "stopped" })));

  useSocketConnect(socket);

  if (serviceState) {
    if (serviceState.status === "run") {
      return (
        <LoadComponent
          url={`/${serviceKey}/remote.js`}
          scope={serviceKey.replace(/\-/g, "_")}
          modulePath={expose}
        />
      );
    } else {
      return <>Service doesn't work</>;
    }
  }

  return <>Loading...</>;
};
