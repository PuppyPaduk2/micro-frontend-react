import React from 'react';

import { Layout } from "./layout";
import { Services } from "./services";

export const App: React.FC = () => {
  return (
    <Layout>
      <Services />
    </Layout>
  );
};
