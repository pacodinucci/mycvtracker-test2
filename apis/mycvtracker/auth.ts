import { SignupUserObject } from "../../types/auth_types";
import {
  getUserFromLocalStorage,
  getUserFromSessionStorage,
  storeUserInLocalStorage,
  storeUserInSessionStorage,
} from "../../utils/storage-utils";
import { apiInstance } from "./config";

export const getUserfromStorage = () => {
  let response = getUserFromLocalStorage();
  if (response === null) response = getUserFromSessionStorage();
  return response;
};

export const sendLoginUser = async (email: string, password: string, rememberme: boolean) => {
  try {
    const response = await apiInstance.post("/auth/login", {
      email,
      password,
      rememberme,
    });
    if (response.status === 200) {
      if (rememberme) {
        // Store in Local storage
        storeUserInLocalStorage(response.data.user, response.data.token);
      } else {
        // Store in session storage
        storeUserInSessionStorage(response.data.user, response.data.token);
      }
      return { user: response.data.user, token: response.data.token };
    }
  } catch (e) {
    throw e;
  }
};

export const sendAddUser = async (user: SignupUserObject) => {
  return await apiInstance.post("/auth/signup", user);
};

export const sendForgotPasswordRequest = async (email: string) => {
  return await apiInstance.post("/auth/forgotPassword", email, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export const sendUpdateProfileSettings = async (profile: {}, token: string) => {
  return await apiInstance.post("/auth/saveProfileSettings", profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const sendGetUserProfileSettings = async (token: string) => {
  return await apiInstance.get("/auth/getUserProfileSettings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
