import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { App as SignIn } from "@mcfs/sign-in";
import { App as Dashboard } from "@mcfs/dashboard";

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
      <div>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/*">
            <SignIn />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
