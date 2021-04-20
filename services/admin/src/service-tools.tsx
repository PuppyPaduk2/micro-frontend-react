import { Button, Space, Tag } from "antd";
import { stopService, startService, getServiceProcessLog, onSocket, offSocket } from "api/controller";
import { useStateGlobal } from "libs/hooks/use-state-global";
import { useService } from "libs/hooks/use-service";
import { ServiceKey } from "libs/types";
import React, { FC, useCallback, useEffect } from "react";

type ToolsBarProps = {
  serviceKey: ServiceKey;
};

export const ServiceToolsBar: FC<ToolsBarProps> = ({ serviceKey }) => {
  const { status, placeOfStart } = useService(serviceKey);

  return (
    <Space>
      <div>Service tools</div>
      <Tag color="blue">{serviceKey}</Tag>
      <Tag>Status: {status}</Tag>
      {placeOfStart && <Tag>Place of start: {placeOfStart}</Tag>}
      <Button
        disabled={status === "run"}
        onClick={() => startService(serviceKey)}
      >
        Run
      </Button>
      <Button
        onClick={() => stopService(serviceKey)}
      >
        Stop
      </Button>
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
  
    onSocket.serviceProcessStdout(serviceKey, addLines);
    onSocket.serviceProcessStderr(serviceKey, addLines);
    onSocket.serviceProcessClose(serviceKey, onClose);

    return () => {
      offSocket.serviceProcessStdout(serviceKey, addLines);
      offSocket.serviceProcessStderr(serviceKey, addLines);
      offSocket.serviceProcessClose(serviceKey, onClose);
    };
  }, [serviceKey]);

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};
