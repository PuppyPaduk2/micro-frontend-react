import React from 'react';
import { Layout } from "libs/components/layout";

import { Services } from "./services";

export const App: React.FC = () => {
  return (
    <Layout footer={<>@service/admin</>}>
      <Services />
    </Layout>
  );
};
