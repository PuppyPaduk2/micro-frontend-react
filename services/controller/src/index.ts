import express from "express";
import * as http from "http";
import servicesConfig from "./services-config.json"

const port = process.env.PORT || 2999;
const app = express();

type ServiceState = {};

const servicesState: { [Key in keyof typeof servicesConfig]?: ServiceState } = {};

app.use(express.json());

app.get("/api/services/config/:serviceKey", (req, res) => {
  const { params } = req;
  const { serviceKey } = params;

  if (typeof serviceKey === "string") {
    res.send(require("./services-config.json")[serviceKey] ?? null);
  } else {
    res.send(require("./services-config.json"));
  }

  res.end();
});

app.get("/api/services/state", (req, res) => {
  res.send(servicesState);
  res.end();
});

app.post("/api/services/run", (req, res) => {
  console.log("run", req.body);
  res.status(200);
  res.end();
});

app.post("/api/services/stopped", (req, res) => {
  console.log("stopped", req.body);
  res.status(200);
  res.end();
});

app.get("*", (req, res) => {
  res.send("Server app");
  res.end();
});

http.createServer(app)
  .listen(port, () => console.log(`http://localhost:${port}`));
