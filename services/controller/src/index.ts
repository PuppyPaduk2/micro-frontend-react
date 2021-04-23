import express from "express";
import * as http from "http";
import { Server } from 'socket.io';
import childProcess from "child_process";
import axios from 'axios';
import bcrypt from "bcrypt";
import Fingerprint from 'express-fingerprint';
import * as FingerprintParams from "express-fingerprint/lib/parameters";

import configServices from "configs/services.json";
import { ServiceConfig, ServiceKey, ServicePlaceOfStart, ServiceProcess, ServiceState } from "common/types";

const port = process.env.PORT;
const app = express();

const server = http.createServer(app);
const io = new Server(server, { path: "/socket" });

const servicesStates: { [key in ServiceKey]?: ServiceState } = {};

const onServiceStarted = (serviceKey: ServiceKey, placeOfStart: ServicePlaceOfStart) => {
  servicesStates[serviceKey] = {
    status: "run",
    placeOfStart: servicesStates[serviceKey]?.placeOfStart || placeOfStart,
  };
  io.emit(`service/${serviceKey}/started`, { state: servicesStates[serviceKey] });
};

const onServiceStopped = (serviceKey: ServiceKey) => {
  servicesStates[serviceKey] = {
    status: "stopped",
    placeOfStart: null,
  };
  io.emit(`service/${serviceKey}/stopped`, { state: servicesStates[serviceKey] });
};

const servicesProcesses: { [Key in ServiceKey]?: ServiceProcess } = {};

const onServiceStart = (serviceKey: ServiceKey) => {
  if (!servicesProcesses[serviceKey]) {
    const instance = childProcess.spawn("npm", ["run", `start-service-${serviceKey}`], {
      env: { ...process.env, PLACE_OF_START: "controller" },
    });

    console.log(serviceKey, servicesProcesses[serviceKey])
    servicesProcesses[serviceKey] = { instance, logs: [] };

    instance.stdout.on('data', (data) => {
      servicesProcesses[serviceKey]?.logs.push(data);
      io.emit(`service/${serviceKey}/process/stdout`, { data });
    });

    instance.stderr.on('data', (data) => {
      servicesProcesses[serviceKey]?.logs.push(data);
      io.emit(`service/${serviceKey}/process/stderr`, { data });
    });
  
    instance.on('close', (code) => {
      io.emit(`service/${serviceKey}/process/close`, { code });
    });
  }
};

const onServiceStop = (serviceKey: ServiceKey) => {
  servicesProcesses[serviceKey]?.instance.kill("SIGINT");
  delete servicesProcesses[serviceKey];
};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("disconnect", (_reason) => {
    console.log('a user disconnected');
  });
});

app.use(express.json());
app.use(Fingerprint({
  parameters:[
    FingerprintParams.useragent,
    FingerprintParams.acceptHeaders,
    // (_next, _req) => {
    //   const req: any = _req;
    //   const { visitorId } = req?.body ?? {};
    //   const next: any = _next;

    //   next(null, { visitorId });
    // },
  ],
}));

app.get("/api/services/state", (_req, res) => {
  res.send(servicesStates);
  res.end();
});

app.get("/api/service/:serviceKey/state", (req, res) => {
  const { serviceKey } = req.params;

  if (typeof serviceKey === "string") {
    res.send(servicesStates[serviceKey as ServiceKey]);
  } else {
    res.send(servicesStates);
  }

  res.end();
});

app.post("/api/service/:serviceKey/started", (req, res) => {
  const { serviceKey } = req.params;
  const { placeOfStart }: { placeOfStart: ServicePlaceOfStart } = req.body;

  if (serviceKey) {
    onServiceStarted(serviceKey as ServiceKey, placeOfStart);
    res.status(200);
  } else {
    res.status(400);
  }

  console.log("service started", servicesStates[serviceKey as ServiceKey]);

  res.end();
});

app.post("/api/service/:serviceKey/stopped", (req, res) => {
  const { serviceKey } = req.params;

  if (serviceKey) {
    onServiceStopped(serviceKey as ServiceKey);
    res.status(200);
  } else {
    res.status(400);
  }

  console.log("service stopped", servicesStates[serviceKey as ServiceKey]);

  res.end();
});

app.post("/api/service/:serviceKey/start", (req, res) => {
  const { serviceKey } = req.params;

  if (serviceKey) {
    onServiceStart(serviceKey as ServiceKey);
    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.post("/api/service/:serviceKey/stop", (req, res) => {
  const { serviceKey } = req.params;

  if (serviceKey) {
    axios.post(`${configServices[serviceKey as ServiceKey].host}/for-controller/api/service/stop`)
      .catch(() => {})
      .finally(() => onServiceStop(serviceKey as ServiceKey))
    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.get("/api/service/:serviceKey/process/logs", (req, res) => {
  const { serviceKey } = req.params;

  if (serviceKey) {
    res.send(servicesProcesses[serviceKey as ServiceKey]?.logs ?? []);
  } else {
    res.status(400);
  }

  res.end();
});

app.get("/for-controller/api/service/place-of-start", (_, res) => {
  res.send("terminal");
  res.end();
});

// For auth
app.get('/api/nonce', async (_, res) => {
  const saltRounds = 10;
  const nonce = await bcrypt.genSalt(saltRounds);
  res.send(nonce);
  res.end();
});

app.post("/api/sign-in", (req, res) => {
  const { hash,  } = req.fingerprint ?? { hash: "" };
  
  console.log("hash", hash, req.fingerprint?.components);
  res.status(200);
  res.end();
});

app.get("*", (_, res) => {
  res.send("Server app");
  res.end();
});

server.on("listening", async () => {
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);

  Object.entries(configServices).forEach(([serviceKey, { host }]: [string, ServiceConfig]) => {
    axios.get(`http://${host}`)
      .then(() => axios.get(`http://${host}/for-controller/api/service/place-of-start`))
      .then(({ data: placeOfStart }) => onServiceStarted(serviceKey as ServiceKey, placeOfStart))
      .catch(() => onServiceStopped(serviceKey as ServiceKey))
      .finally(() => console.log(serviceKey, servicesStates[serviceKey as ServiceKey]));
  });
});
