import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { ServiceWrapper } from "./libs/service-wrapper";

export const App: React.FC = () => {
  console.log("App");

  return (
    <BrowserRouter>
      <div>
        <div>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div>
          <Link to="/signin">Sign in</Link>
        </div>
      </div>
      <div style={{ backgroundColor: "#e0e0e0" }}>
        <Switch>
          <Route path="/signin">
            <ServiceWrapper
              url="http://localhost:5001/remote.js"
              scope="signIn"
              modulePath="./SignInApp"
            />
          </Route>
          <Route path="/dashboard">
            <ServiceWrapper
              url="http://localhost:5002/remote.js"
              scope="dashboard"
              modulePath="./DashboardApp"
            />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
