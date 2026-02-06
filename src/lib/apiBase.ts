export const resolveApiBase = () => {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (envBase && envBase.trim().length > 0) {
    return envBase;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:4000";
    }
  }

  return "";
};

export const resolveWsUrl = (apiBase: string) => {
  const envWs = process.env.NEXT_PUBLIC_WS_URL;
  if (envWs && envWs.trim().length > 0) {
    return envWs;
  }

  if (apiBase) {
    return apiBase.replace(/^https?/, (match) => (match === "https" ? "wss" : "ws"));
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "ws://localhost:4000";
    }
  }

  return "";
};
