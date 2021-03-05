import * as React from 'react';
import { useDynamicScript } from "../use-dynamic-script";
import { loadComponent } from "../load-component";

export const ServiceWrapper: React.FC<{
  url: string;
  scope: string;
  modulePath: string;
}> = ({ url, scope, modulePath }) => {
  const { ready, failed } = useDynamicScript({ url });

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  const Component = React.lazy(loadComponent(scope, modulePath));

  return (
    <React.Suspense fallback="Loading System">
      <Component />
    </React.Suspense>
  );
};