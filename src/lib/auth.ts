const TOKEN_KEY = "dryguard-token";
const ADMIN_NAME_KEY = "dryguard-admin-name";

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_NAME_KEY);
};

export const setAdminName = (name: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ADMIN_NAME_KEY, name);
};

export const getAdminName = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(ADMIN_NAME_KEY);
};

export const fetchWithAuth = async (url: string, init?: RequestInit) => {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
};
