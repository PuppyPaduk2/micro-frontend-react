import React, { FC, useEffect } from 'react';
import { Button, Input, Space } from "antd";
import { useStateGlobal } from 'libs/use-state-global';
import { getVisitorId } from './get-visitor-id';
import axios from 'axios';

export const App: React.FC = () => {
  useEffect(() => {
    console.log("Auth");

    axios.get("/controller/api/nonce").then(({ data: nonce }) => {
      console.log(nonce)
    });

    getVisitorId().then((visitorId) => {
      axios.post("/controller/api/sign-in", { visitorId });
    });
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
