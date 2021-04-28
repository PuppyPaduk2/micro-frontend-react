import { requestExpose } from 'common/request-expose';
import React, { FC, useEffect } from 'react';
import { Button, Input, Space } from "antd";
import { useStateGlobal } from 'libs/use-state-global';
import { useAccess } from 'common/hooks';

export const App: React.FC = () => {
  const [access] = useAccess();

  console.log("@access-dashboard", access);

  useEffect(() => {
    requestExpose({ serviceKey: "auth", scope: "auth", expose: "./guard" }).then(({ add: _add }) => {
      // console.log(add("dash1", 1));
      // console.log(add("dash2", 2));
    });
  }, []);

  return (
    <div>
      <div>Dashboard (ns: auth/form)</div>
      <Form ns="auth/form" />
      <div>Dashboard (ns: dashboard/form)</div>
      <Form ns="dashboard/form" />
    </div>
  );
};

const Form: FC<{ ns: string }> = ({ ns }) => {
  const [login, setLogin] = useStateGlobal("", "login", ns);
  const [pass, setPass] = useStateGlobal("", "password", ns);

  return (
    <Space direction="vertical">
      <Input placeholder="Login" value={login} onChange={(event) => setLogin(event.currentTarget.value)} />
      <Input placeholder="Password" type="password" value={pass} onChange={(event) => setPass(event.currentTarget.value)}  />
      <Button block type="primary">Send</Button>
    </Space>
  );
};
