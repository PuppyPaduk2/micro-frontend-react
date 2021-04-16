import { Button, Space, Tag } from "antd";
import { stopService, runService, getServiceProcessLog } from "api/controller";
import { useStateGlobal } from "libs/hooks/use-state-global";
import { useService } from "libs/hooks/use-service";
import { useSocket } from "libs/hooks/use-socket";
import { ServiceKey } from "libs/types";
import React, { FC, useCallback, useEffect } from "react";

type ToolsBarProps = {
  serviceKey: ServiceKey;
};

export const ServiceToolsBar: FC<ToolsBarProps> = ({ serviceKey }) => {
  const { status, mode } = useService(serviceKey);

  return (
    <Space>
      <div>Service tools</div>
      <Tag color="blue">{serviceKey}</Tag>
      <Button
        disabled={status === "run"}
        onClick={() => runService(serviceKey)}
      >
        Run
      </Button>
      <Button
        onClick={() => stopService(serviceKey)}
      >
        Stop
      </Button>
      <Tag>Status: {status}</Tag>
      {mode && <Tag>Mode: {mode}</Tag>}
    </Space>
  );
};

type ToolsProps = {
  serviceKey: ServiceKey;
};

export const ServiceTools: FC<ToolsProps> = ({ serviceKey }) => {
  return (
    <div>
      <Terminal serviceKey={serviceKey} />
    </div>
  );
};

type TerminalProps = {
  serviceKey: ServiceKey;
};

const Terminal: FC<TerminalProps> = ({ serviceKey }) => {
  const socket = useSocket("/", "/controller/socket");
  const [isInit, setIsInit] = useStateGlobal<boolean>(false, `terminal-is-init/${serviceKey}`);
  const [lines, setLines] = useStateGlobal<string[]>([], `terminal-lines/${serviceKey}`);

  const addLines = useCallback(({ data }: { data: ArrayBuffer }) => {
    const enc = new TextDecoder("utf-8");

    setLines((prev) => [...prev, ...enc.decode(data).split("\n")]);
  }, []);

  useEffect(() => {
    if (!isInit) {
      getServiceProcessLog(serviceKey)
        .then((result) => result.forEach(({ data }) => {
          addLines({ data: new Uint8Array(data) });
        }));
      setIsInit(true);
    }
  }, [isInit, serviceKey, addLines]);

  useEffect(() => {
    const onClose = ({ code }: { code: number | null }) => {
      if (code === 0) setLines([]);
    };

    const onStopped = () => setLines([]);

    socket.on(`services/${serviceKey}/stdout`, addLines);
    socket.on(`services/${serviceKey}/stderr`, addLines);
    socket.on(`services/${serviceKey}/close`, onClose);
    socket.on(`services/stopped`, onStopped);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off(`services/${serviceKey}/stdout`, addLines);
      socket.off(`services/${serviceKey}/stderr`, addLines);
      socket.off(`services/${serviceKey}/close`, onClose);
      socket.off(`services/stopped`, onStopped);
    };
  }, [socket, serviceKey, addLines]);

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};
