import { getServiceState, offSocket, onSocket } from "api/controller";
import { createScript } from "libs/dynamic-script";
import { ServiceKey } from "common/types";

export const loadScriptRemote = (payload: {
  serviceKey: ServiceKey;
  onPending?: () => void;
  onLoaded?: () => void;
  onFailed?: (error: Error) => void;
  filename?: string,
}) => {
  const { serviceKey, onLoaded = () => {} } = payload;

  // TODO Загрузка скрипта после быстрого включения / выключения
  return new Promise<void>((resolve) => {
    getServiceState(serviceKey)
      .then(({ status }) => {
        if (status === "run") {
          loadScript(payload).then(resolve)
        } else {
          onServiceStarted({
            ...payload,
            onLoaded: () => {
              onLoaded();
              resolve();
            },
          });
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
        });
      });
  });
};

const onServiceStarted = (payload: {
  serviceKey: ServiceKey;
  onPending?: () => void;
  onLoaded?: () => void;
  onFailed?: (error: Error) => void;
  filename?: string;
}) => {
  const { serviceKey } = payload;

  const onStarted = () => {
    loadScript(payload).catch(() => {
      onServiceStarted(payload);
    });
    offSocket.serviceStarted(serviceKey, onStarted);
  };

  onSocket.serviceStarted(serviceKey, onStarted);
}

const loadScript = (payload: {
  serviceKey: ServiceKey;
  onPending?: () => void;
  onLoaded?: () => void;
  onFailed?: (error: Error) => void;
  filename?: string;
}) => {
  const { onPending = () => {}, onLoaded = () => {}, onFailed = () => {} } = payload;
  onPending();
  return getScript(payload).then((script) => script.load().then(onLoaded).catch((error) => {
    onFailed(error);
    script.remove();
    throw error;
  }))
};

const getScript = async (payload: {
  serviceKey: ServiceKey;
  filename?: string;
}) => {
  const { serviceKey, filename = "remote.js" } = payload;
  return createScript(`${window.location.origin}/${serviceKey}/${filename}`);
};