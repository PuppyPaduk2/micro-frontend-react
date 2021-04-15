import express from "express";
import * as http from "http";
import axios from "axios";
import { Server } from 'socket.io';
import childProcess from 'child_process';

import servicesConfig from "settings/services-config.json";
import { ServiceState, ServiceKey, ServiceConfig, ServiceMode } from "libs/types";

const servicesState: Record<string, ServiceState> = {};
const port = process.env.PORT || servicesConfig.controller.port;
const app = express();

const server = http.createServer(app);
const io = new Server(server, { path: "/socket" });

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("disconnect", (_reason) => {
    console.log('a user disconnected');
  });
});

app.use(express.json());

app.get("/api/services/config", (_req, res) => {
  res.send(servicesConfig);
  res.end();
});

app.get("/api/services/config/:serviceKey", (req, res) => {
  const { serviceKey } = req.params;

  if (typeof serviceKey === "string") {
    res.send(servicesConfig[serviceKey as ServiceKey] ?? null);
  } else {
    res.send(servicesConfig);
  }

  res.end();
});

app.get("/api/services/state", (_req, res) => {
  res.send(servicesState);
  res.end();
});

app.get("/api/services/state/:serviceKey", (req, res) => {
  const { serviceKey } = req.params;

  if (typeof serviceKey === "string") {
    res.send(servicesState[serviceKey]);
  } else {
    res.send(servicesState);
  }

  res.end();
});

const processes: {
  [key in ServiceKey]?: {
    process: childProcess.ChildProcessWithoutNullStreams,
    log: ArrayBuffer[];
  }
} = {};

const killProcess = (serviceKey: ServiceKey) => {
  processes[serviceKey]?.process.kill("SIGINT");
  delete processes[serviceKey];
};

const killProcesses = () => {
  Object.keys(processes).forEach((key) => killProcess(key as ServiceKey));
};

process.on("SIGHUP", killProcesses);

process.on("SIGINT", killProcesses);

app.get("/api/services/process/log", (req, res) => {
  const { serviceKey } = req.query;
  console.log(req.params);

  if (serviceKey) {
    res.send(processes[serviceKey as ServiceKey]?.log ?? []);
  } else {
    res.status(400);
  }

  res.end();
});

app.post("/api/services/run", (req, res) => {
  const { serviceKey }: { serviceKey: ServiceKey } = req.body;

  if (serviceKey && !processes[serviceKey]) {
    const proc = childProcess.spawn("npm", ["run", `start-service-${serviceKey}`], {
      env: { ...process.env, SERVICE_MODE: "controller" },
    });

    processes[serviceKey] = {
      process: proc,
      log: [],
    };

    proc.stdout.on('data', (data) => {
      processes[serviceKey]?.log.push(data);
      io.emit(`services/${serviceKey}/stdout`, { data });
    });

    proc.stderr.on('data', (data) => {
      processes[serviceKey]?.log.push(data);
      io.emit(`services/${serviceKey}/stderr`, { data });
    });
  
    proc.on('close', (code) => {
      io.emit(`services/${serviceKey}/close`, { code });
    });

    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.post("/api/services/runed", (req, res) => {
  console.log("runed", req.body);

  const { serviceKey, mode }: { serviceKey: ServiceKey; mode: ServiceMode } = req.body;

  if (serviceKey) {
    const nextMode = servicesState[serviceKey].mode || mode;

    servicesState[serviceKey] = {
      ...servicesState[serviceKey],
      status: "run",
      mode: nextMode,
    };
    io.emit("services/run", { serviceKey, mode: nextMode });
    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.post("/api/services/stop", (req, res) => {
  const { serviceKey }: { serviceKey: ServiceKey } = req.body;

  if (serviceKey) {
    const serviceConfig = servicesConfig[serviceKey];

    killProcess(serviceKey);
    axios.post(`${serviceConfig.publicPath}/for-controller/api/service/stop`);
    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.post("/api/services/stopped", (req, res) => {
  console.log("stopped", req.body);

  const { serviceKey }: { serviceKey: ServiceKey } = req.body;

  if (serviceKey) {
    // const serviceConfig = servicesConfig[serviceKey];

    servicesState[serviceKey] = {
      ...servicesState[serviceKey],
      status: "stopped",
      mode: null,
    };
    io.emit("services/stopped", { serviceKey });
    // axios.get(`${serviceConfig.publicPath}/for-controller/api/service/stop`);
    res.status(200);
  } else {
    res.status(400);
  }

  res.end();
});

app.get("/for-controller/api/service/mode", (_, res) => {
  res.send("terminal");
  res.end();
});

app.get("*", (_, res) => {
  res.send("Server app");
  res.end();
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);

  const serviceConfig: Record<ServiceKey, ServiceConfig> = servicesConfig;

  Object.entries(serviceConfig).forEach(([serviceKey, config]) => {
    axios.get(config.publicPath).then(() => {
      axios.get(`${config.publicPath}/for-controller/api/service/mode`)
        .then(({ data: mode }) => {
          servicesState[serviceKey] = { status: "run", mode };
        });
    }).catch(() => {
      servicesState[serviceKey] = { status: "stopped", mode: null };
    });
  });
});
