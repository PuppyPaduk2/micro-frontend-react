import React, { FC } from 'react';
import { Button, Input, Space } from "antd";
import { useStateGlobal } from 'libs/use-state-global';
import { signIn } from 'api/auth';
import { useAccess } from 'common/hooks';

export const App: React.FC = () => {
  const access = useAccess();

  console.log("@access-auth", access);

  return (
    <div>
      <div>Auth</div>
      <Form />
    </div>
  );
};

const Form: FC = () => {
  const [password, setPass] = useStateGlobal("", "password", "auth/form");

  return (
    <Space direction="vertical">
      <Input placeholder="Password" type="password" value={password} onChange={(event) => setPass(event.currentTarget.value)}  />
      <Button block type="primary" onClick={() => {
        signIn(password);
      }}>Send</Button>
    </Space>
  );
};
