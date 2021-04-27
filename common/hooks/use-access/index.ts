import { checkAccess } from "api/auth";
import { AxiosResponse } from "axios";
import { axiosInterceptor } from "libs/axios-interceptor";
import { useStateGlobal } from "libs/use-state-global";
import { useEffect } from "react";

let promiseCheckAccess: null | Promise<boolean> = null;

export const useAccess = (): boolean => {
  const [value, setValue] = useStateGlobal<boolean>(false, "access", "auth");

  useEffect(() => {
    if (!promiseCheckAccess) {
      promiseCheckAccess = checkAccess();
      promiseCheckAccess.then(setValue).catch(setValue);
    }

    const onResponse = (response: AxiosResponse) => {
      if (response.config.url === "/auth-be/api/sign-in" && response.status === 200) {
        setValue(true);
      }
    };

    const onFailure = (error: any) => {
      if (error.response.status === 401) {
        setValue(false);
      }
    };

    axiosInterceptor.on("response", onResponse);
    axiosInterceptor.on("failure", onFailure);

    return () => {
      axiosInterceptor.off("response", onResponse);
      axiosInterceptor.off("failure", onFailure);
    };
  }, []);

  return value;
};
