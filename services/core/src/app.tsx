import * as React from 'react';
import { ServiceComponent } from "libs/utils/dynamic-load";
import { Layout } from "libs/components/layout";

export const App: React.FC = () => {
  return (
    <Layout>
      <ServiceComponent
        serviceKey="auth"
        expose="./App"
      />
    </Layout>
  );
};
