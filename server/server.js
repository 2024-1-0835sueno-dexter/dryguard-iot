const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const mqtt = require("mqtt");
const Datastore = require("nedb-promises");

const PORT = process.env.PORT || 4000;
const MQTT_URL = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const MQTT_SENSORS_TOPIC = process.env.MQTT_SENSORS_TOPIC || "dryguard/sensors";
const MQTT_ACTIONS_TOPIC = process.env.MQTT_ACTIONS_TOPIC || "dryguard/actions";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const notificationsDb = Datastore.create({
  filename: "server/notifications.db",
  autoload: true,
});
const activityDb = Datastore.create({
  filename: "server/activity.db",
  autoload: true,
});

let systemState = {
  humidity: 45,
  wifi: true,
  online: true,
  rainDetected: false,
  coverDeployed: false,
  lastChecked: new Date().toISOString(),
};

const touchSystem = () => {
  systemState.lastChecked = new Date().toISOString();
};

const broadcast = () => {
  const payload = JSON.stringify(systemState);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
};

const addNotification = (icon, text) => {
  notificationsDb.insert({ icon, text, createdAt: new Date().toISOString() });
};

const addActivity = (text) => {
  activityDb.insert({ text, createdAt: new Date().toISOString() });
};

const handleRainTransition = (nextRainDetected) => {
  if (nextRainDetected && !systemState.rainDetected) {
    addNotification("⚠️", "Rain detected — cover protection recommended");
    addActivity("Rain detected — protection advised");
  }
  if (!nextRainDetected && systemState.rainDetected) {
    addNotification("✅", "Rain cleared — safe conditions detected");
    addActivity("Rain cleared — safe conditions detected");
  }
};

app.get("/api/system", (req, res) => {
  res.json(systemState);
});

app.get("/api/notifications", async (req, res) => {
  const limit = Number(req.query.limit ?? 8) || 8;
  const rows = await notificationsDb
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json(rows.map((row) => ({ icon: row.icon, text: row.text })));
});

app.get("/api/activity", async (req, res) => {
  const limit = Number(req.query.limit ?? 8) || 8;
  const rows = await activityDb.find({}).sort({ createdAt: -1 }).limit(limit);
  res.json(rows.map((row) => row.text));
});

app.post("/api/deploy-cover", (req, res) => {
  systemState.coverDeployed = true;
  touchSystem();
  addNotification("✅", "Cover deployed successfully");
  addActivity("Cover deployed");
  mqttClient?.publish(MQTT_ACTIONS_TOPIC, JSON.stringify({ action: "deploy" }));
  broadcast();
  res.json({ message: "Cover deployed successfully", state: systemState });
});

app.post("/api/retract-cover", (req, res) => {
  systemState.coverDeployed = false;
  touchSystem();
  addNotification("🟩", "Cover retracted successfully");
  addActivity("Cover retracted");
  mqttClient?.publish(MQTT_ACTIONS_TOPIC, JSON.stringify({ action: "retract" }));
  broadcast();
  res.json({ message: "Cover retracted successfully", state: systemState });
});

app.post("/api/reset-device", (req, res) => {
  systemState = {
    humidity: 50,
    wifi: true,
    online: true,
    rainDetected: false,
    coverDeployed: false,
    lastChecked: new Date().toISOString(),
  };
  addNotification("🔄", "Device reset complete");
  addActivity("Device reset");
  mqttClient?.publish(MQTT_ACTIONS_TOPIC, JSON.stringify({ action: "reset" }));
  broadcast();
  res.json({ message: "Device reset complete", state: systemState });
});

wss.on("connection", (socket) => {
  socket.send(JSON.stringify(systemState));
  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message?.action === "deploy") {
        systemState.coverDeployed = true;
        addActivity("Cover deployed (WS)");
      }
      if (message?.action === "retract") {
        systemState.coverDeployed = false;
        addActivity("Cover retracted (WS)");
      }
      if (message?.action === "reset") {
        systemState = {
          humidity: 50,
          wifi: true,
          online: true,
          rainDetected: false,
          coverDeployed: false,
          lastChecked: new Date().toISOString(),
        };
        addActivity("Device reset (WS)");
      }
      touchSystem();
      broadcast();
    } catch {
      // ignore malformed messages
    }
  });
});

const mqttClient = mqtt.connect(MQTT_URL);

mqttClient.on("connect", () => {
  mqttClient.subscribe(MQTT_SENSORS_TOPIC);
});

mqttClient.on("message", (topic, message) => {
  if (topic !== MQTT_SENSORS_TOPIC) {
    return;
  }

  try {
    const data = JSON.parse(message.toString());
    if (typeof data.humidity === "number") {
      systemState.humidity = data.humidity;
    }
    if (typeof data.wifi === "boolean") {
      systemState.wifi = data.wifi;
    }
    if (typeof data.online === "boolean") {
      systemState.online = data.online;
    }
    if (typeof data.rainDetected === "boolean") {
      handleRainTransition(data.rainDetected);
      systemState.rainDetected = data.rainDetected;
    }
    touchSystem();
    broadcast();
  } catch {
    // ignore malformed messages
  }
});

server.listen(PORT, () => {
  console.log(`DryGuard API running on http://localhost:${PORT}`);
});
