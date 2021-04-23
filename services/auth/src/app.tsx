import React, { FC, useEffect } from 'react';
import { Button, Input, Space } from "antd";
import { useStateGlobal } from 'libs/use-state-global';
import { getVisitorId } from './get-visitor-id';
import axios from 'axios';

export const App: React.FC = () => {
  useEffect(() => {
    console.log("Auth");

    // axios.get("/controller/api/nonce").then(({ data: nonce }) => {
    //   console.log(nonce)
    // });

    // getVisitorId().then((visitorId) => {
    //   axios.post("/controller/api/sign-in", { visitorId });
    // });
  }, []);

  return (
    <div>
      <div>Auth</div>
      <Form />
    </div>
  );
};

const Form: FC = () => {
  const [pass, setPass] = useStateGlobal("", "password", "auth/form");

  const [visitorId, setVisitorId] = useStateGlobal("", "visitorId", "auth");

  return (
    <Space direction="vertical">
      <div>66d9caf1463195aa75742bde77616d4b</div>
      <div>{visitorId}</div>
      <Input placeholder="Password" type="password" value={pass} onChange={(event) => setPass(event.currentTarget.value)}  />
      <Button block type="primary" onClick={() => {
        getVisitorId().then((visitorId) => {
          setVisitorId(visitorId);
          axios.post("/controller/api/sign-in", { visitorId });
        });
      }}>Send</Button>
    </Space>
  );
};
