import * as React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const importWrapper = (value: Promise<any>) => value
  .then((module) => module)
  .catch((error) => console.error(error));

const DashboardApp = React.lazy(() => importWrapper(import("dashboard/DashboardApp")));

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
          <Route path="/dashboard">
            <React.Suspense fallback="">
              <DashboardApp />
            </React.Suspense>
          </Route>
          <Route path="/*">
            {/* <SignIn /> */}
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
