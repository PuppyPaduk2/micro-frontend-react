import { loadExpose } from "libs/dynamic-script";
import { loadScriptRemote } from "libs/load-script-remote";
import { ServiceKey } from "libs/types";

type Props = {
  serviceKey: ServiceKey;
  scope: string;
  expose: string;
  filename?: string;
};

export const requestExpose = (props: Props) => {
  return loadScriptRemote({ serviceKey: props.serviceKey }).then(() => {
    return loadExpose(props.scope, props.expose)();
  });
};
