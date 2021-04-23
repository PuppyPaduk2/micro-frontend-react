type ScriptState = {
  element: HTMLScriptElement;
  loaded: boolean;
  failed: boolean;
  loadPromise: Promise<void> | null;
};

const scripts: Record<string, ScriptState> = {};

export const createScript = (src: string) => {
  const cache: ScriptState = scripts[src]
    ?? { element: document.createElement("script"), loaded: false, failed: false, loadPromise: null };

  cache.element.src = src;
  cache.element.type = "text/javascript";
  cache.element.async = true;

  const script = {
    loaded: () => scripts[src].loaded,
    failed: () => scripts[src].failed,
    load: (): Promise<void> => {
      const loadPromise = scripts[src].loadPromise || new Promise((resolve, reject) => {
        scripts[src].loaded = false;
        scripts[src].failed = false;
        cache.element.onload = () => {
          console.log(`Dynamic Script Loaded: ${src}`);
          scripts[src].loaded = true;
          resolve();
        };
        cache.element.onerror = function(_event, _source, _lineno, _colno, _error) {
          console.error(`Dynamic Script Error: ${src}`);
          scripts[src].failed = true;
          reject(_error);
        };
        document.getElementsByTagName("head")[0].appendChild(cache.element);
      });

      cache.loadPromise = loadPromise;

      return loadPromise;
    },
    remove: () => {
      if (scripts[src].loadPromise) {
        console.log(`Dynamic Script Removed: ${src}`);
        const element = document.createElement("script");
        element.src = src;
        element.type = "text/javascript";
        element.async = true;
        scripts[src].element = element;
        scripts[src].loaded = false;
        scripts[src].failed = false;
        scripts[src].loadPromise = null;
      }
    },
  };

  if (!scripts[src]) scripts[src] = cache;

  return script;
};

declare function __webpack_init_sharing__(v: string): any;
declare const __webpack_share_scopes__: { default: () => any };

export const loadExpose = (scope: string, expose: string) => {
  return async () => {
    const _window: any = window;

    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");

    const container = _window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await _window[scope].get(expose);
    const Module = factory();
    return Module;
  };
};
