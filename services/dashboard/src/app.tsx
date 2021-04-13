import { requestExpose } from 'libs/request-expose';
import React, { useEffect } from 'react';

export const App: React.FC = () => {
  useEffect(() => {
    requestExpose({ serviceKey: "auth", scope: "auth", expose: "./guard" }).then(({ add }) => {
      console.log(add("dash1", 1));
      console.log(add("dash2", 2));
    });
  }, []);

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
};
