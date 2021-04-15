import { ServiceKey, ServiceMode } from "libs/types";
import { useEffect } from "react";
import { useSocket } from "libs/hooks/use-socket";

export type DataRun = {
  serviceKey: ServiceKey,
  mode: ServiceMode
};

export type DataStopped = {
  serviceKey: ServiceKey;
};

type Props = {
  onRun?: (data: DataRun) => void;
  onStopped?: (data: DataStopped) => void;
};

export const useServicesRunStopped = ({ onRun, onStopped }: Props) => {
  const socket = useSocket("/", "/controller/socket");

  useEffect(() => {
    if (onRun) socket.on("services/run", onRun);
    if (onStopped) socket.on("services/stopped", onStopped);
    if (!socket.connected) socket.connect();

    return () => {
      if (onRun) socket.off("services/run", onRun);
      if (onStopped) socket.off("services/stopped", onStopped);
    };
  }, [socket, onRun, onStopped]);
};
