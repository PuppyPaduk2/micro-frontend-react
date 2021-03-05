import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { ServiceWrapper } from "./libs/service-wrapper";
import { routes } from "@mcfs/configs";

const { menu, content } = routes;

export const App: React.FC = () => {
  console.log("App");

  return (
    <BrowserRouter>
      <div>
        {menu.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>{item.title}</Link>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: "#e0e0e0" }}>
        <Switch>
          {content.map((item) => (
            <Route key={item.path} path={item.path}>
              <ServiceWrapper
                url={item.url}
                scope={item.scope}
                modulePath={item.modulePath}
              />
            </Route>
          ))}
        </Switch>
      </div>
    </BrowserRouter>
  );
};
