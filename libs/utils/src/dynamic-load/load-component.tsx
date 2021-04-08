import * as React from 'react';
import { useDynamicScript } from "./use-dynamic-script";
import { loadModule } from "./load-module";

export const LoadComponent: React.FC<{
  url: string;
  scope: string;
  modulePath: string;
}> = ({ url, scope, modulePath }) => {
  const { ready, failed } = useDynamicScript({ url });

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  const Component = React.lazy(loadModule(scope, modulePath));

  return (
    <React.Suspense fallback="Loading System">
      <Component />
    </React.Suspense>
  );
};