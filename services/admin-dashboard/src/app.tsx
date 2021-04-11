import React, { useEffect, useState } from 'react';

import { services } from "../l-libs/utils";

const { getConfig, getState, getSocket, useSocketEvent, useSocketConnect } = services;

const socket = getSocket("/controller");

export const App: React.FC = () => {
  const [servicesConfig, serServicesConfig] = useState<{ [key: string]: { port: number; publicPath: string } }>({});
  const [servicesState, serServicesState] = useState<{ [key: string]: { status: "stopped" | "run" } }>({});

  useEffect(() => {
    getConfig({ baseUrl: "/controller" }).then(({ data }) => serServicesConfig(data));
    getState({ baseUrl: "/controller" }).then(({ data }) => serServicesState(data));
  }, []);

  useSocketEvent(socket, "connect", () => {
    console.log(socket.id);
  });

  useSocketEvent(socket, "services/run", ({ serviceKey }) => serServicesState(prev => ({
    ...prev,
    [serviceKey]: { ...prev[serviceKey], status: "run" }
  })));

  useSocketEvent(socket, "services/stopped", ({ serviceKey }) => serServicesState(prev => ({
    ...prev,
    [serviceKey]: { ...prev[serviceKey], status: "stopped" }
  })));

  useSocketConnect(socket);

  return (
    <div>
      {Object.entries(servicesConfig).map(([serviceKey, { port, publicPath }]) => (
        <div key={serviceKey} style={{ display: "flex" }}>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Service key: </span>
            <span>{serviceKey}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Port: </span>
            <span>{port}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Public path: </span>
            <span>{publicPath}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>State: </span>
            <span>{servicesState[serviceKey] && servicesState[serviceKey].status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
