import React, { useEffect } from 'react';
import { useDynamicScript, loadModule } from "libs/utils/dynamic-load"

export const App: React.FC = () => {
  // const { ready } = useDynamicScript({ url: "/auth/remote.js" });

  useEffect(() => {
    console.log("Dashboard");
  }, []);

  useEffect(() => {
    // if (ready) {
      loadModule("auth", "./guard")().then(({ add }) => {
        console.log(add("test", 1));
        console.log(add("test2", 12));
      });
    // }
  }, []);

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
};
