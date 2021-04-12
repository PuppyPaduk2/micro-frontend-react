import React, { useEffect } from 'react';
import { Button } from "antd";

export const App: React.FC = () => {
  useEffect(() => {
    console.log("Auth");
  }, []);

  return (
    <div>
      <Button>Send</Button>
    </div>
  );
};
