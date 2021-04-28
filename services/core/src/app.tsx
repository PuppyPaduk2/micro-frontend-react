import React, { FC, ReactElement, useEffect } from 'react';
import { Layout, Lazy } from "common/components";
import { requestExpose } from "common/request-expose";
import { useAccess } from 'common/hooks';
import { Button } from 'antd';
import { signOut } from 'api/auth';

export const App: FC = () => {
  const [access] = useAccess();
  let result: ReactElement | null = null;

  useEffect(() => {
    requestExpose({ serviceKey: "auth", scope: "auth", expose: "./guard" }).then(({ add: _add }) => {
      // console.log("@", add("core1", 1));
      // console.log("@", add("core2", 2));
    });
  }, []);

  console.log(access);

  if (access) {
    result = (
      <Layout headerExtra={<Button onClick={() => signOut()}>Sign out</Button>} footer={<>@service/core</>}>
        <Lazy serviceKey="dashboard" scope="dashboard" expose="./App" />
        <Lazy serviceKey="users" scope="users" expose="./App" />
      </Layout>
    );
  } else {
    result = (
      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Lazy serviceKey="auth" scope="auth" expose="./App" />
      </div>
    );
  }

  return result;
};
