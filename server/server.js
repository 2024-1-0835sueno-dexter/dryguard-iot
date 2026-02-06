const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");
const mqtt = require("mqtt");
const Datastore = require("nedb-promises");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;
const MQTT_URL = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const MQTT_SENSORS_TOPIC = process.env.MQTT_SENSORS_TOPIC || "dryguard/sensors";
const MQTT_ACTIONS_TOPIC = process.env.MQTT_ACTIONS_TOPIC || "dryguard/actions";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "dryguard";
const JWT_SECRET = process.env.JWT_SECRET || "dryguard-dev-secret";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME;

const app = express();
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials." });
  }

  const adminCount = await storage.countAdmins();
  if (!adminCount) {
    return res.status(503).json({ error: "Admin account not configured." });
  }

  const admin = await storage.findAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signToken(admin);
  return res.json({
    token,
    admin: { fullName: admin.fullName, username: admin.username },
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ fullName: req.user.fullName, username: req.user.username });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

app.use("/api", (req, res, next) => {
  if (req.path.startsWith("/auth")) {
    return next();
  }
  return authMiddleware(req, res, next);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let storage = {
  insertNotification: async () => {},
  insertActivity: async () => {},
  getNotifications: async () => [],
  getActivity: async () => [],
  findAdminByUsername: async () => null,
  upsertAdmin: async () => {},
  countAdmins: async () => 0,
};

const initStorage = async () => {
  if (MONGODB_URI) {
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db(MONGODB_DB);
      const notifications = db.collection("notifications");
      const activity = db.collection("activity");
      const admins = db.collection("admins");
      await notifications.createIndex({ createdAt: -1 });
      await activity.createIndex({ createdAt: -1 });
      await admins.createIndex({ username: 1 }, { unique: true });

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
        findAdminByUsername: async (username) => {
          return admins.findOne({ username });
        },
        upsertAdmin: async (username, fullName, passwordHash) => {
          await admins.updateOne(
            { username },
            { $set: { username, fullName, passwordHash } },
            { upsert: true },
          );
        },
        countAdmins: async () => admins.countDocuments(),
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
  const adminsDb = Datastore.create({
    filename: "server/admins.db",
    autoload: true,
  });
  await adminsDb.ensureIndex({ fieldName: "username", unique: true });

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
    findAdminByUsername: async (username) => {
      return adminsDb.findOne({ username });
    },
    upsertAdmin: async (username, fullName, passwordHash) => {
      await adminsDb.update(
        { username },
        { $set: { username, fullName, passwordHash } },
        { upsert: true },
      );
    },
    countAdmins: async () => adminsDb.count({}),
  };

  console.log("File storage initialized.");
};

const ensureAdmin = async () => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_NAME) {
    console.warn("ADMIN_USERNAME/ADMIN_PASSWORD/ADMIN_NAME not set. Login disabled.");
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await storage.upsertAdmin(ADMIN_USERNAME, ADMIN_NAME, hash);
  console.log("Admin account ready.");
};

const signToken = (admin) =>
  jwt.sign(
    { username: admin.username, fullName: admin.fullName },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
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

wss.on("connection", (socket, request) => {
  const url = new URL(request.url, "http://localhost");
  const token = url.searchParams.get("token");
  if (!token) {
    socket.close(1008, "Unauthorized");
    return;
  }
  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    socket.close(1008, "Unauthorized");
    return;
  }

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

initStorage().then(async () => {
  await ensureAdmin();
  server.listen(PORT, () => {
    console.log(`DryGuard API running on http://localhost:${PORT}`);
  });
});
