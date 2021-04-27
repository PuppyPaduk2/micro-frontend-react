import { checkAccess } from "api/auth";
import Emittery from "emittery";
import { axiosInterceptor } from "libs/axios-interceptor";
import { useStateGlobal } from "libs/use-state-global";
import { useEffect } from "react";

let promiseCheckAccess: null | Promise<boolean> = null;
let onResponseUnsubscribe: null | Emittery.UnsubscribeFn = null;
let onFailureUnsubscribe: null | Emittery.UnsubscribeFn = null;

export const useAccess = (): boolean => {
  const [value, setValue] = useStateGlobal<boolean>(false, "access", "auth");

  useEffect(() => {
    if (!promiseCheckAccess) {
      promiseCheckAccess = checkAccess();
      promiseCheckAccess.then(setValue).catch(setValue);
    }

    if (!onResponseUnsubscribe) {
      onResponseUnsubscribe = axiosInterceptor.on("response", (response) => {
        if (response.config.url === "/auth-be/api/sign-in" && response.status === 200) {
          setValue(true);
        }
      });
    }

    if (!onFailureUnsubscribe) {
      onFailureUnsubscribe = axiosInterceptor.on("failure", (error) => {
        if (error.response.status === 401) {
          setValue(false);
        }
      });
    }

    return () => {
      if (onResponseUnsubscribe) {
        onResponseUnsubscribe();
        onResponseUnsubscribe = null;
      }

      if (onFailureUnsubscribe) {
        onFailureUnsubscribe();
        onFailureUnsubscribe = null;
      }
    };
  }, []);

  return value;
};
