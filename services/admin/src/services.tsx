import React, { FC, useMemo, useState } from "react";
import { Button, Drawer, Table, Typography } from "antd";
import { ServiceKey, ServiceMode, ServiceStatus } from "libs/types";
import { ApiOutlined } from "@ant-design/icons";

import { ServiceTools, ServiceToolsBar } from "./service-tools";
import { useServices } from "libs/hooks/use-services";

type Service = {
  serviceKey: ServiceKey;
  publicPath: string,
  status: ServiceStatus | null;
  mode: ServiceMode;
};

export const Services: FC = () => {
  const services = useServices();
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
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Mode',
      key: 'mode',
      render: ({ mode }: Service) => (
        mode
          ? <>{mode}</>
          : <Typography.Text type="secondary">unknown</Typography.Text>
      ),
    },
    {
      key: "tools",
      render: ({ serviceKey }: Service) => (
        <Button
          type="link"
          icon={<ApiOutlined />}
          disabled={serviceKey === "controller"}
          onClick={() => setServiceKey(serviceKey)}
        />
      ),
    },
  ], []);

  return (
    <>
      <Table rowKey="serviceKey" dataSource={services} columns={columns} />
      <Drawer
        closeIcon={false}
        title={serviceKey && <ServiceToolsBar serviceKey={serviceKey} />}
        visible={Boolean(serviceKey)} onClose={() => setServiceKey(null)}
        width="70%"
      >
        {serviceKey && <ServiceTools serviceKey={serviceKey} />}
      </Drawer>
    </>
  );
};
