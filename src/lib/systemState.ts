export type SystemState = {
  humidity: number;
  rainDetected: boolean;
  coverDeployed: boolean;
  online: boolean;
  lastChecked: string;
};

export const systemState: SystemState = {
  humidity: 45,
  rainDetected: false,
  coverDeployed: false,
  online: true,
  lastChecked: new Date().toISOString(),
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const touchSystem = () => {
  systemState.lastChecked = new Date().toISOString();
};

export const randomizeSystem = () => {
  const delta = Math.floor(Math.random() * 7) - 3;
  systemState.humidity = clamp(systemState.humidity + delta, 20, 95);
  if (Math.random() > 0.85) {
    systemState.rainDetected = !systemState.rainDetected;
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

export const getSystemSnapshot = () => {
  randomizeSystem();
  return { ...systemState };
};
