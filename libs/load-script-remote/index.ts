import { getServiceState, offSocket, onSocket } from "api/controller";
import { createScript } from "libs/dynamic-script";
import { ServiceKey } from "libs/types";
import servicesConfig from "settings/services-config.json";

export const loadScriptRemote = (payload: {
  serviceKey: ServiceKey;
  onPending?: () => void;
  onLoaded?: () => void;
  onFailed?: () => void;
  filename?: string,
}) => {
  const { serviceKey, onFailed = () => {} } = payload;

  return new Promise((resolve, reject) => {
    getServiceState(serviceKey)
      .then(({ status }) => {
        if (status === "run") {
          loadScript(payload).then(resolve).catch(reject).catch(onFailed);
        } else {
          const onStarted = () => {
            loadScript(payload).then(resolve).catch(reject).catch(onFailed);
            offSocket.serviceStarted(serviceKey, onStarted);
          };

          onSocket.serviceStarted(serviceKey, onStarted);
        }
      })
      .catch(() => {
        // Try load from service without controller
        loadScript(payload).then(resolve).catch(() => {
          const onConnect = () => {
            loadScriptRemote(payload);
            offSocket.connect(onConnect);
          };

          onSocket.connect(onConnect);
          getScript(payload).remove();
        });
      });
  });
};

const loadScript = (payload: {
  serviceKey: ServiceKey;
  onPending?: () => void;
  onLoaded?: () => void;
  filename?: string;
}) => {
  const { onPending = () => {}, onLoaded = () => {} } = payload;
  onPending();
  return getScript(payload).load().then(onLoaded);
};

const getScript = (payload: {
  serviceKey: ServiceKey;
  filename?: string;
}) => {
  const { serviceKey, filename = "remote.js" } = payload;
  const { publicPath } = servicesConfig[serviceKey];
  return createScript(`${publicPath}/${filename}`);
};