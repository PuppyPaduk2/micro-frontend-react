import React, { FC, useEffect } from 'react';
import { ServiceComponent } from "libs/utils/dynamic-load";
import { Layout } from "libs/components/layout";

import { useDynamicScript, loadModule } from "libs/utils/dynamic-load"

export const App: FC = () => {
  return (
    <Layout>
      <ServiceComponent
        serviceKey="dashboard"
        expose="./App"
      />
      <ServiceComponent
        serviceKey="auth"
        expose="./App"
      />
      <Test />
    </Layout>
  );
};

const Test: FC = () => {
  const { ready } = useDynamicScript({ url: "/auth/remote.js" });

  useEffect(() => {
    console.log("Test");
  }, []);

  useEffect(() => {
    if (ready) {
      loadModule("auth", "./guard")().then(({ add }) => {
        console.log(add("test3", 13));
        console.log(add("test24", 125));
      });
    }
  }, [ready]);

  return <></>;
};
