import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <div>
          <Link to="/dashboard/accounts">Accounts</Link>
        </div>
        <div>
          <Link to="/dashboard/settings">Settings</Link>
        </div>
      </div>
      <div style={{ backgroundColor: "#e0e0e0" }}>
        <Switch>
          <Route path="/dashboard/accounts">
            <div>Accounts</div>
          </Route>
          <Route path="/dashboard/settings">
            <div>Settings</div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
