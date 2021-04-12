import React, { FC, useEffect, useState } from 'react';

import { LoadComponent } from "./load-component";
import { getState, getSocket, useSocketEvent, useSocketConnect } from "../services";

const socket = getSocket("/controller");

export const ServiceComponent: FC<{
  serviceKey: string;
  expose: string;
  baseUrl?: string;
  remoteFile?: string;
  scope?: string;
}> = ({
  serviceKey,
  expose,
  baseUrl = "/controller",
  remoteFile = "/remote.js",
  scope = serviceKey.replace(/\-/g, "_"),
}) => {
  const [serviceState, setServiceState] = useState<any>(null);

  useEffect(() => {
    getState({ serviceKey, baseUrl })
      .then(({ data }) => setServiceState(data))
      .catch(() => {});
  }, [serviceKey, baseUrl]);

  useSocketEvent(
    socket,
    "services/run",
    () => setServiceState((prev) => !prev ? prev : ({ ...prev, status: "run" })),
  );

  // useSocketEvent(socket, "services/stopped", () => setServiceState((prev) => ({ ...prev, status: "stopped" })));

  useSocketConnect(socket);

  if (serviceState) {
    if (serviceState.status === "run") {
      return (
        <LoadComponent
          url={`/${serviceKey}${remoteFile}`}
          scope={scope}
          modulePath={expose}
        />
      );
    } else {
      return <>Service doesn't work</>;
    }
  }

  return <>Loading...</>;
};
