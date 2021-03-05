export function loadComponent(scope: string, module: string) {
  return async () => {
    const _window: any = window;

    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");

    const container = _window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await _window[scope].get(module);
    const Module = factory();
    return Module;
  };
}
