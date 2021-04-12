import React, { FC, useEffect, useMemo, useState } from "react";
import { Table } from "antd";

import { getConfig, getSocket, getState, useSocketConnect, useSocketEvent } from "../l-libs/utils/src/services";

type Service = {
  serviceKey: string;
  publicPath: string,
  status: "stopped" | "run" | null;
};

const socket = getSocket("/controller");

export const Services:FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getConfig({ baseUrl: "/controller" })
      .then(({ data }) => setServices(
        Object.entries(data).map(([serviceKey, config]) => ({ ...config, serviceKey, status: null, })),
      ));
    getState({ baseUrl: "/controller" })
      .then(({ data }) => setServices(
        (services) => services.map((service) => ({ ...service, status: data[service.serviceKey].status })),
      ));
  }, []);

  useSocketEvent(socket, "connect", () => {
    console.log(socket.id);
  });

  useSocketEvent(socket, "services/run", ({ serviceKey }) => {
    setServices((services) => services.map((service) => {
      if (service.serviceKey === serviceKey) service.status = "run";
      return service;
    }));
  });

  useSocketEvent(socket, "services/stopped", ({ serviceKey }) => {
    setServices((services) => services.map((service) => {
      if (service.serviceKey === serviceKey) service.status = "stopped";
      return service;
    }));
  });

  useSocketConnect(socket);

  const columns = useMemo(() => [
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
  ], []);

  return <Table rowKey="serviceKey" dataSource={services} columns={columns} />;
};
