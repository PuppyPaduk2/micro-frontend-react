import React, { FC, useMemo, useState } from "react";
import { Button, Drawer, Space, Table, Typography } from "antd";
import { ServiceConfigWithKey, ServiceKey } from "libs/types";
import { ApiOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import servicesConfig from "settings/services-config.json"

import { ServiceTools, ServiceToolsBar } from "./service-tools";
import { startService, stopService } from "api/controller";
import { useService } from "libs/hooks/use-service";

const defServices: ServiceConfigWithKey[] = Object.entries(servicesConfig).map(([serviceKey, config]) => ({
  ...config,
  serviceKey: serviceKey as ServiceKey,
}));

const Status: FC<ServiceConfigWithKey> = ({ serviceKey }) => {
  const { status } = useService(serviceKey);

  return status
    ? <>{status}</>
    : <Typography.Text type="secondary">unknown</Typography.Text>
};

const PlaceOfStart: FC<ServiceConfigWithKey> = ({ serviceKey }) => {
  const { placeOfStart } = useService(serviceKey);

  return placeOfStart
    ? <>{placeOfStart}</>
    : <Typography.Text type="secondary">unknown</Typography.Text>
};

const Actions: FC<ServiceConfigWithKey & { onOpenTools?: (serviceKey: ServiceKey) => void }> = ({ serviceKey, onOpenTools = () => {} }) => {
  return (
    <Space>
      <Button
        type="link"
        icon={<PlayCircleOutlined />}
        disabled={serviceKey === "controller"}
        onClick={() => startService(serviceKey)}
      />
      <Button
        type="link"
        icon={<StopOutlined />}
        disabled={serviceKey === "controller"}
        onClick={() => stopService(serviceKey)}
      />
      <Button
        type="link"
        icon={<ApiOutlined />}
        disabled={serviceKey === "controller"}
        onClick={() => onOpenTools(serviceKey)}
      />
    </Space>
  );
};

export const Services: FC = () => {
  const [services] = useState<ServiceConfigWithKey[]>(defServices);
  const [serviceKey, setServiceKey] = useState<ServiceKey | null>(null);

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
      key: 'status',
      render: Status,
    },
    {
      title: 'Place of start',
      key: 'placeOfStart',
      render: PlaceOfStart,
    },
    {
      title: "Actions",
      key: "tools",
      render: (record: ServiceConfigWithKey) => <Actions {...record} onOpenTools={setServiceKey} />,
    },
  ], []);

  return (
    <>
      <Table rowKey="serviceKey" dataSource={services} columns={columns} />
      <Drawer
        title={serviceKey && <ServiceToolsBar serviceKey={serviceKey} />}
        visible={Boolean(serviceKey)} onClose={() => setServiceKey(null)}
        width="70%"
      >
        {serviceKey && <ServiceTools serviceKey={serviceKey} />}
      </Drawer>
    </>
  );
};
