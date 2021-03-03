export type Route = {
  port: number;
  piblicPath: string;
};

export type routes = {
  composite: Route;
  signIn: Route;
  dashboard: Route;
};

export type MenuItem = {
  path: string;
  title: string;
};

export type appMenu = MenuItem[];
