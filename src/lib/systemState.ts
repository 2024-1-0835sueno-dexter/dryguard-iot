export type SystemState = {
  humidity: number;
  rainDetected: boolean;
  coverDeployed: boolean;
  online: boolean;
  lastChecked: string;
};

type NotificationItem = {
  icon: string;
  text: string;
  createdAt: string;
};

export const systemState: SystemState = {
  humidity: 45,
  rainDetected: false,
  coverDeployed: false,
  online: true,
  lastChecked: new Date().toISOString(),
};

const notifications: NotificationItem[] = [];
const activity: string[] = [];

const pushNotification = (icon: string, text: string) => {
  notifications.unshift({ icon, text, createdAt: new Date().toISOString() });
  if (notifications.length > 50) {
    notifications.length = 50;
  }
};

const pushActivity = (text: string) => {
  activity.unshift(text);
  if (activity.length > 50) {
    activity.length = 50;
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const touchSystem = () => {
  systemState.lastChecked = new Date().toISOString();
};

export const randomizeSystem = () => {
  const prevRain = systemState.rainDetected;
  const delta = Math.floor(Math.random() * 7) - 3;
  systemState.humidity = clamp(systemState.humidity + delta, 20, 95);
  if (Math.random() > 0.85) {
    systemState.rainDetected = !systemState.rainDetected;
  }
  if (prevRain !== systemState.rainDetected) {
    if (systemState.rainDetected) {
      pushNotification("⚠️", "Rain detected — cover protection recommended");
      pushActivity("Rain detected — protection advised");
    } else {
      pushNotification("✅", "Rain cleared — safe conditions detected");
      pushActivity("Rain cleared — safe conditions detected");
    }
  }
  touchSystem();
};

export const setCoverDeployed = (value: boolean) => {
  systemState.coverDeployed = value;
  touchSystem();
};

export const resetSystem = () => {
  systemState.humidity = 50;
  systemState.rainDetected = false;
  systemState.coverDeployed = false;
  systemState.online = true;
  touchSystem();
};

export const addNotification = (icon: string, text: string) => {
  pushNotification(icon, text);
};

export const addActivity = (text: string) => {
  pushActivity(text);
};

export const getNotifications = (limit = 8) =>
  notifications.slice(0, limit).map((item) => ({ icon: item.icon, text: item.text }));

export const getActivity = (limit = 8) => activity.slice(0, limit);

export const getSystemSnapshot = () => {
  randomizeSystem();
  return { ...systemState };
};
