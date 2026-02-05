const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let systemState = {
  humidity: 45,
  rainDetected: false,
  coverDeployed: false,
  online: true,
  lastChecked: new Date().toISOString(),
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const randomize = () => {
  const delta = Math.floor(Math.random() * 7) - 3;
  systemState.humidity = clamp(systemState.humidity + delta, 20, 95);
  if (Math.random() > 0.85) {
    systemState.rainDetected = !systemState.rainDetected;
  }
  systemState.lastChecked = new Date().toISOString();
};

const broadcast = () => {
  const payload = JSON.stringify(systemState);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

wss.on("connection", (socket) => {
  socket.send(JSON.stringify(systemState));

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message?.action === "deploy") {
        systemState.coverDeployed = true;
      }
      if (message?.action === "retract") {
        systemState.coverDeployed = false;
      }
      if (message?.action === "reset") {
        systemState = {
          humidity: 50,
          rainDetected: false,
          coverDeployed: false,
          online: true,
          lastChecked: new Date().toISOString(),
        };
      }
      broadcast();
    } catch {
      // ignore malformed messages
    }
  });
});

setInterval(() => {
  randomize();
  broadcast();
}, 5000);

const PORT = 4001;
server.listen(PORT, () => {
  console.log(`DryGuard WebSocket server running on ws://localhost:${PORT}`);
});
