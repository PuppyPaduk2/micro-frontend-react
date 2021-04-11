import * as React from 'react';
import { dynamicLoad } from "../l-libs/utils";

const { ServiceComponent } = dynamicLoad;

export const App: React.FC = () => {
  return <div>
    <ServiceComponent
      serviceKey="sign-in"
      expose="./App"
    />
  </div>;
};
