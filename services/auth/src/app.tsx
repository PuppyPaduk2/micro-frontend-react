import React, { FC, useEffect } from 'react';
import { Button, Input, Space } from "antd";
import { useStateGlobal } from 'libs/use-state-global';

export const App: React.FC = () => {
  useEffect(() => {
    console.log("Auth");
  }, []);

  return (
    <div>
      <div>Auth</div>
      <Form />
    </div>
  );
};

const Form: FC = () => {
  const [login, setLogin] = useStateGlobal("", "login", "auth/form");
  const [pass, setPass] = useStateGlobal("", "password", "auth/form");

  return (
    <Space direction="vertical">
      <Input placeholder="Login" value={login} onChange={(event) => setLogin(event.currentTarget.value)} />
      <Input placeholder="Password" type="password" value={pass} onChange={(event) => setPass(event.currentTarget.value)}  />
      <Button block type="primary">Send</Button>
    </Space>
  );
};
