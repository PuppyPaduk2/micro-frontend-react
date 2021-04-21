import React, { FC, ReactChild, ReactElement, useEffect, useState, lazy } from 'react';
import { ServiceKey } from 'common/types';
import { loadExpose } from 'libs/dynamic-script';
import { ErrorBoundary } from "common/components";
import { loadScriptRemote } from 'common/load-script-remote';

type Props = {
  serviceKey: ServiceKey,
  filename?: string;
  scope: string;
  expose: string;
  pending?: ReactElement;
  failed?: ReactElement;
  fallback?: string;
  errorTitle?: ReactChild;
};

export const Lazy: FC<Props> = (props) => {
  const { serviceKey, filename } = props;
  const [status, setStatus] = useState<null | "pending" | "loaded" | "failed">(null);

  useEffect(() => {
    loadScriptRemote({
      serviceKey,
      filename,
      onPending: () => setStatus("pending"),
      onLoaded: () => setStatus("loaded"),
      onFailed: () => setStatus("failed"),
    });
  }, [serviceKey, filename]);

  if (status === "pending") {
    return props.pending ?? null;
  } else if (status === "loaded") {
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
  } else if (status === "failed") {
    return props.failed ?? null;
  }

  return <></>;
};

