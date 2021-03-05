// const _window: any = window;

// const importWrapper = (value: Promise<any>) => value
//   .then((module) => module)
//   .catch((error) => {
//     console.error(error)
//   });

// function loadScript(url: string, _module: any): Promise<any> {
//   return new Promise<any>((resolve) => {
//     const script: any = document.createElement("script")
//     script.type = "text/javascript";
//     script.async = true;
  
//     if (script.readyState) {  //IE
//       script.onreadystatechange = function() {
//         if (script.readyState == "loaded" || script.readyState == "complete"){
//           script.onreadystatechange = null;
//           resolve(_module);
//         }
//       };
//     } else {
//       script.onload = () => {
//         console.log("loaded", url);
//         resolve(_module);
//       };
//     }
  
//     script.src = url;
//     document.getElementsByTagName("head")[0].appendChild(script);
//   });
// }

// _window.signIn = loadScript("http://localhost:5001/remote.js", _window.signIn);
// _window.signIn.then(() => importWrapper(import("signIn/SignInApp")));
// _window.dashboard = loadScript("http://localhost:5002/remote.js", _window.dashboard);
// _window.signIn.then(() => importWrapper(import("dashboard/DashboardApp")));

import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

