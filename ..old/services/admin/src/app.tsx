import React from 'react';

import { Layout } from "./layout";
import { Services } from "./services";

export const App: React.FC = () => {

  return (
    <Layout>
      <Services />
      {/* {Object.entries(servicesConfig).map(([serviceKey, { port, publicPath }]) => (
        <div key={serviceKey} style={{ display: "flex" }}>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Service key: </span>
            <span>{serviceKey}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Port: </span>
            <span>{port}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>Public path: </span>
            <span>{publicPath}</span>
          </div>
          <div style={{ margin: "0 48px 0 0 " }}>
            <span>State: </span>
            <span>{servicesState[serviceKey] && servicesState[serviceKey].status}</span>
          </div>
        </div>
      ))} */}
    </Layout>
  );
};
