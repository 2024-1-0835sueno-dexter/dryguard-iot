const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");
const mqtt = require("mqtt");
const Datastore = require("nedb-promises");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 4000;
const MQTT_URL = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const MQTT_SENSORS_TOPIC = process.env.MQTT_SENSORS_TOPIC || "dryguard/sensors";
const MQTT_ACTIONS_TOPIC = process.env.MQTT_ACTIONS_TOPIC || "dryguard/actions";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "dryguard";

const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload." });
  }
  return next(err);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let storage = {
  insertNotification: async () => {},
  insertActivity: async () => {},
  getNotifications: async () => [],
  getActivity: async () => [],
};

const initStorage = async () => {
  if (MONGODB_URI) {
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db(MONGODB_DB);
      const notifications = db.collection("notifications");
      const activity = db.collection("activity");
      await notifications.createIndex({ createdAt: -1 });
      await activity.createIndex({ createdAt: -1 });

      storage = {
        insertNotification: async (icon, text) => {
          await notifications.insertOne({ icon, text, createdAt: new Date() });
        },
        insertActivity: async (text) => {
          await activity.insertOne({ text, createdAt: new Date() });
        },
        getNotifications: async (limit) => {
          const rows = await notifications
            .find({}, { projection: { _id: 0, icon: 1, text: 1 } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
          return rows;
        },
        getActivity: async (limit) => {
          const rows = await activity
            .find({}, { projection: { _id: 0, text: 1 } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
          return rows.map((row) => row.text);
        },
      };

      console.log("MongoDB storage connected.");
      return;
    } catch (error) {
      console.warn("MongoDB connection failed, falling back to file storage.");
      console.warn(error?.message ?? error);
    }
  }

  const notificationsDb = Datastore.create({
    filename: "server/notifications.db",
    autoload: true,
  });
  const activityDb = Datastore.create({
    filename: "server/activity.db",
    autoload: true,
  });

  storage = {
    insertNotification: async (icon, text) => {
      await notificationsDb.insert({ icon, text, createdAt: new Date().toISOString() });
    },
    insertActivity: async (text) => {
      await activityDb.insert({ text, createdAt: new Date().toISOString() });
    },
    getNotifications: async (limit) => {
      const rows = await notificationsDb
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit);
      return rows.map((row) => ({ icon: row.icon, text: row.text }));
    },
    getActivity: async (limit) => {
      const rows = await activityDb.find({}).sort({ createdAt: -1 }).limit(limit);
      return rows.map((row) => row.text);
    },
  };

  console.log("File storage initialized.");
};

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
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

const addNotification = async (icon, text) => {
  await storage.insertNotification(icon, text);
};

const addActivity = async (text) => {
  await storage.insertActivity(text);
};

const handleRainTransition = async (nextRainDetected) => {
  if (nextRainDetected && !systemState.rainDetected) {
    await addNotification("⚠️", "Rain detected — cover protection recommended");
    await addActivity("Rain detected — protection advised");
  }
  if (!nextRainDetected && systemState.rainDetected) {
    await addNotification("✅", "Rain cleared — safe conditions detected");
    await addActivity("Rain cleared — safe conditions detected");
  }
};

app.get("/api/system", (req, res) => {
  res.json(systemState);
});

app.get("/api/notifications", async (req, res) => {
  const limit = Number(req.query.limit ?? 8) || 8;
  const rows = await storage.getNotifications(limit);
  res.json(rows);
});

app.get("/api/activity", async (req, res) => {
  const limit = Number(req.query.limit ?? 8) || 8;
  const rows = await storage.getActivity(limit);
  res.json(rows);
});

app.post("/api/deploy-cover", async (req, res) => {
  systemState.coverDeployed = true;
  touchSystem();
  await addNotification("✅", "Cover deployed successfully");
  await addActivity("Cover deployed");
  mqttClient?.publish(MQTT_ACTIONS_TOPIC, JSON.stringify({ action: "deploy" }));
  broadcast();
  res.json({ message: "Cover deployed successfully", state: systemState });
});

app.post("/api/retract-cover", async (req, res) => {
  systemState.coverDeployed = false;
  touchSystem();
  await addNotification("🟩", "Cover retracted successfully");
  await addActivity("Cover retracted");
  mqttClient?.publish(MQTT_ACTIONS_TOPIC, JSON.stringify({ action: "retract" }));
  broadcast();
  res.json({ message: "Cover retracted successfully", state: systemState });
});

app.post("/api/reset-device", async (req, res) => {
  systemState = {
    humidity: 50,
    wifi: true,
    online: true,
    rainDetected: false,
    coverDeployed: false,
    lastChecked: new Date().toISOString(),
  };
  await addNotification("🔄", "Device reset complete");
  await addActivity("Device reset");
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

initStorage().then(() => {
  server.listen(PORT, () => {
    console.log(`DryGuard API running on http://localhost:${PORT}`);
  });
});
