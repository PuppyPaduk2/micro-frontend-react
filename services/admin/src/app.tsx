import React from 'react';
import { Layout } from "common/components";

import { Services } from "./services";

export const App: React.FC = () => {
  return (
    <Layout footer={<>@service/admin</>}>
      <Services />
    </Layout>
  );
};
