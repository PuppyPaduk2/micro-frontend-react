export type routes = {
  paths: {
    [keys: string]: (...args: any) => string;
  };
};

export type ServiceConfig = {
  port: number;
};

export type services = {
  configs: {
    composite: ServiceConfig;
    signIn: ServiceConfig;
    dashboard: ServiceConfig;
  };
};
