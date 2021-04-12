import * as React from 'react';
import { dynamicLoad } from "../l-libs/utils";

const { ServiceComponent } = dynamicLoad;

export const App: React.FC = () => {
  return <div>
    <ServiceComponent
      serviceKey="auth"
      expose="./App"
    />
  </div>;
};
