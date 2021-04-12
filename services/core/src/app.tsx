import * as React from 'react';

import { ServiceComponent } from "libs/utils/dynamic-load";

export const App: React.FC = () => {
  return (
    <div>
      <ServiceComponent
        serviceKey="auth"
        expose="./App"
      />
    </div>
  );
};
