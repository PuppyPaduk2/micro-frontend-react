import { Button, Space } from "antd";
import { stopService, runService } from "api/controller";
import { useService } from "libs/hooks/use-service";
import { useSocket } from "libs/hooks/use-socket";
import { ServiceKey } from "libs/types";
import React, { FC, useCallback, useEffect, useState } from "react";

type ToolsBarProps = {
  serviceKey: ServiceKey;
};

export const ServiceToolsBar: FC<ToolsBarProps> = ({ serviceKey }) => {
  const serviceState = useService(serviceKey);

  return (
    <Space>
      <div>Service tools</div>
      <Button onClick={() => runService(serviceKey)}>Run</Button>
      <Button onClick={() => stopService(serviceKey)}>Stop</Button>
      <div>{serviceState.status}</div>
      <div>{serviceState.mode}</div>
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
  const [lines, setLines] = useState<string[]>([]);

  const addLines = useCallback(({ data }: { data: ArrayBuffer }) => {
    const enc = new TextDecoder("utf-8");

    setLines((prev) => [...prev, ...enc.decode(data).split("\n")]);
  }, []);

  useEffect(() => {
    const onClose = ({ code }: { code: number | null }) => {
      setLines((prev) => [...prev, code?.toString() || ""])
    };

    socket.on(`services/${serviceKey}/stdout`, addLines);
    socket.on(`services/${serviceKey}/stderr`, addLines);
    socket.on(`services/${serviceKey}/close`, onClose);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off(`services/${serviceKey}/stdout`, addLines);
      socket.off(`services/${serviceKey}/stderr`, addLines);
      socket.off(`services/${serviceKey}/close`, onClose);
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