import axios from "axios";

export const checkAccess = (): Promise<boolean> => {
  return axios.get("/auth-be/api/check-access")
    .then(() => true)
    .catch(() => Promise.resolve(false));
};

export const signIn = (password: string) => {
  return axios.post("/auth-be/api/sign-in", { password });
};
