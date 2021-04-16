import React, { FC, useEffect } from 'react';
import { Layout } from "libs/components/layout";
import { LazyWait } from "libs/components/lazy-wait";
import { requestExpose } from "libs/request-expose";

export const App: FC = () => {
  useEffect(() => {
    requestExpose({ serviceKey: "auth", scope: "auth", expose: "./guard" }).then(({ add }) => {
      console.log("@", add("core1", 1));
      console.log("@", add("core2", 2));
    });
  }, []);

  return (
    <Layout footer={<>@service/core</>}>
      <LazyWait serviceKey="auth" scope="auth" expose="./App" />
      <LazyWait serviceKey="dashboard" scope="dashboard" expose="./App" />
      <LazyWait serviceKey="users" scope="users" expose="./App" />
    </Layout>
  );
};
