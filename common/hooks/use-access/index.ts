import { checkAccess } from "api/auth";
import Emittery from "emittery";
import { axiosInterceptor } from "libs/axios-interceptor";
import { SetStateAction, useStateGlobal } from "libs/use-state-global";
import { useEffect } from "react";

let promiseCheckAccess: null | Promise<boolean> = null;
let onResponseUnsubscribe: null | Emittery.UnsubscribeFn = null;
let onFailureUnsubscribe: null | Emittery.UnsubscribeFn = null;
let countListeners: number = 0;

export const useStateAccess = () => {
  return useStateGlobal<boolean>(false, "access", "auth");
};

export const useAccess = (): [boolean, (value: SetStateAction<boolean>) => void] => {
  const [value, setValue] = useStateAccess();

  useEffect(() => {
    if (!promiseCheckAccess) {
      promiseCheckAccess = checkAccess();
      promiseCheckAccess.then(setValue).catch(setValue);
    }

    if (!countListeners) {
      onResponseUnsubscribe = axiosInterceptor.on("response", (response) => {
        const { url } = response.config;
        const is200 = response.status === 200;
        const isSignIn = url === "/auth-be/api/sign-in";
        const isSignOut = url === "/auth-be/api/sign-out";

        if (isSignIn && is200) {
          setValue(true);
        } else if (isSignOut && is200) {
          setValue(false);
        }
      });
    }

    if (!countListeners) {
      onFailureUnsubscribe = axiosInterceptor.on("failure", (error) => {
        if (error.response.status === 401) {
          setValue(false);
        }
      });
    }

    countListeners += 1;

    return () => {
      countListeners -= 1;

      if (!countListeners && onResponseUnsubscribe) {
        onResponseUnsubscribe();
        onResponseUnsubscribe = null;
      }

      if (!countListeners && onFailureUnsubscribe) {
        onFailureUnsubscribe();
        onFailureUnsubscribe = null;
      }
    };
  }, []);

  return [value, setValue];
};
