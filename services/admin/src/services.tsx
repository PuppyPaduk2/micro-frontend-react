import React, { FC, useEffect, useState } from "react";
import { Table } from "antd";
import servicesConfig from "settings/services-config.json";
import { getServicesState } from "api/controller";
import { ServiceKey } from "libs/types";
import { useSocket } from "libs/hooks/use-socket";

type Service = {
  serviceKey: ServiceKey;
  publicPath: string,
  status: "stopped" | "run" | null;
};

const _services: Service[] = Object.entries(servicesConfig).map(([serviceKey, config]) => ({
  serviceKey: serviceKey as ServiceKey,
  publicPath: config.publicPath,
  status: null,
}));

const columns = [
  {
    title: 'Service key',
    dataIndex: 'serviceKey',
    key: 'serviceKey',
  },
  {
    title: 'Public path',
    dataIndex: 'publicPath',
    key: 'publicPath',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

export const Services:FC = () => {
  const [services, setServices] = useState<Service[]>(_services);

  useEffect(() => {
    getServicesState().then((servicesState) => {
      setServices((services) => services.map((service) => {
        const state = servicesState[service.serviceKey];
        if (state) service.status = state.status;
        return service;
      }));
    });
  }, []);

  const socket = useSocket("/", "/controller/socket");

  useEffect(() => {
    const run = (data: { serviceKey: ServiceKey }) => {
      setServices((services) => services.map((service) => {
        if (service.serviceKey === data.serviceKey) service.status = "run";
        return service;
      }));
    };

    const stopped = (data: { serviceKey: ServiceKey }) => {
      setServices((services) => services.map((service) => {
        if (service.serviceKey === data.serviceKey) service.status = "stopped";
        return service;
      }));
    };

    socket.on("services/run", run);
    socket.on("services/stopped", stopped);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("services/run", run);
      socket.off("services/stopped", stopped);
    }
  }, [socket]);

  return <Table rowKey="serviceKey" dataSource={services} columns={columns} />;
};
