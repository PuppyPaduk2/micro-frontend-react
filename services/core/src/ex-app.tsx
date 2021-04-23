import React, { FC, useEffect } from 'react';
import { Layout, Lazy } from "common/components";
import { requestExpose } from "common/request-expose";

export const App: FC = () => {
  useEffect(() => {
    requestExpose({ serviceKey: "auth", scope: "auth", expose: "./guard" }).then(({ add }) => {
      console.log("@", add("core1", 1));
      console.log("@", add("core2", 2));
    });
  }, []);

  return (
    <Layout footer={<>@service/core</>}>
      <Lazy serviceKey="auth" scope="auth" expose="./App" />
      <Lazy serviceKey="dashboard" scope="dashboard" expose="./App" />
      <Lazy serviceKey="users" scope="users" expose="./App" />
    </Layout>
  );
};
