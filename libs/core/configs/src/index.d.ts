export type MenuItem = {
  path: string;
  title: string;
};

export type ContentItem = {
  path: string;
  url: string;
  scope: string;
  modulePath: string;
};

export declare const routes: {
  paths: {
    signIn: () => string,
    signInAuth: () => string,
    siginInChangePass: () => string,
    dashboard: () => string,
    dashboardAccounts: () => string,
    dashboardSettings: () => string,
  };
  menu: MenuItem[];
  content: ContentItem[];
};

export type Expose = {
  key: string;
  path: string;
};

export type ServiceConfig<Custom extends { exposes: object }> = {
  scope: string;
  port: number;
  exposes: Custom["exposes"];
};

export declare const services: {
  nameRemoteScript: string;
  configs: {
    composite: ServiceConfig<{
      exposes: {};
    }>;
    signIn: ServiceConfig<{
      exposes: {
        DashboardApp: Expose;
      };
    }>;
    dashboard: ServiceConfig<{
      exposes: {
        SignInApp: Expose;
      };
    }>;
  };
  convertExposes: (exposes: Record<string, Expose>) => Record<string, string>;
};
