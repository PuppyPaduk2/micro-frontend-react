import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <div>
          <Link to="/signin/accounts">Accounts</Link>
        </div>
        <div>
          <Link to="/signin/settings">Settings</Link>
        </div>
      </div>
      <div style={{ backgroundColor: "#e0e0e0" }}>
        <Switch>
          <Route path="/signin/accounts">
            <div>Accounts</div>
          </Route>
          <Route path="/signin/settings">
            <div>Settings</div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
