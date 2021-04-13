import React, { FC, lazy, ReactChild, ReactElement } from 'react';
import { useDynamicScript } from "libs/hooks/use-dynamic-script";
import { loadExpose } from "libs/dynamic-script";
import { ErrorBoundary } from "libs/components/error-boundary";

type Props = {
  src: string;
  scope: string;
  expose: string;
  pending?: ReactElement;
  failed?: ReactElement;
  fallback?: string;
  errorTitle?: ReactChild;
};

export const Lazy: FC<Props> = (props) => {
  const status = useDynamicScript(props.src);

  if (status === null) {
    return props.pending ?? null;
  } else if (status === "failed") {
    return props.failed ?? null;
  }

  const Component = lazy(loadExpose(props.scope, props.expose));

  return (
    <ErrorBoundary title={props.errorTitle}>
      <React.Suspense fallback={props.fallback ?? ""}>
        <Component>
          {props.children}
        </Component>
      </React.Suspense>
    </ErrorBoundary>
  );
};
