import React, { FC, useState } from 'react';
import { Button, Input, notification, Space } from "antd";
import { signIn } from 'api/auth';

export const App: React.FC = () => {
  return (
    <div>
      <Form />
    </div>
  );
};

const Form: FC = () => {
  const [password, setPass] = useState("");

  return (
    <Space direction="vertical">
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPass(event.currentTarget.value)}
      />
      <Button
        block
        type="primary"
        onClick={() => {
          signIn(password).then(() => {
            setPass("");
          }).catch(() => {
            notification.error({
              message: "Credentials is incorrect",
              placement: "bottomLeft",
            });
          });
        }}
      >
        Send
      </Button>
    </Space>
  );
};
