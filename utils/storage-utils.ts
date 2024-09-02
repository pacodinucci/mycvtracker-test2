import { UserObject } from "../types/auth_types";

export const storeUserInLocalStorage = (user: UserObject, token: string) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }
};

export const getUserFromLocalStorage = () => {
  const value = localStorage.getItem("user");
  const token = localStorage.getItem("");
  if (value && token) {
    const user = JSON.parse(value);
    return { user, token };
  }
  return null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const storeUserInSessionStorage = (user: UserObject, token: string) => {
  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", token);
  }
};

export const getUserFromSessionStorage = () => {
  const value = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");
  if (value && token) {
    const user = JSON.parse(value);
    return { user, token };
  }
  return null;
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};
