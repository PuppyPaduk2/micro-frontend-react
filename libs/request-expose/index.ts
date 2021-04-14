import { getServiceState } from "api/controller";
import { createScript, loadExpose } from "libs/dynamic-script";
import { createSocket } from "libs/socket";
import { ServiceKey, ServiceStatus } from "libs/types";
import servicesConfig from "settings/services-config.json";

type Props = {
  serviceKey: ServiceKey;
  scope: string;
  expose: string;
  filename?: string;
};

// TODO Maybe need to match with Lazy (Component)
const waitService = (serviceKey: ServiceKey): Promise<ServiceStatus> => {
  return getServiceState(serviceKey).then(({ status }) => {
    if (status === "run") {
      return "run";
    } else {
      return new Promise<ServiceStatus>((resolve) => {
        const socket = createSocket("/", "/controller/socket");

        const eventServicesRun = "services/run";
        const handler = (data: { serviceKey: ServiceKey }) => {

          if (data.serviceKey === serviceKey) {
            socket.off(eventServicesRun, handler);
            resolve("run");
          }
        };

        socket.on(eventServicesRun, handler);

        if (!socket.connected) socket.connect();
      });
    }
  });
};

export const requestExpose = (props: Props) => {
  return waitService(props.serviceKey).then(async () => {
    const config = servicesConfig[props.serviceKey];
    const script = createScript(`${config.publicPath}/${props.filename ?? "remote.js"}`);

    await script.load();
    return loadExpose(props.scope, props.expose)();
  });
};
