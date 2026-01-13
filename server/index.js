const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("./database");
const { Activity, Feedback } = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins explicitly
    methods: ["GET", "POST"],
  },
});

// Helper to schedule auto-close
const scheduleAutoClose = (activity) => {
  if (!activity.durationMinutes || !activity.isActive) return;

  const startTime = new Date(activity.createdAt).getTime();
  const durationMs = activity.durationMinutes * 60000;
  const expiryTime = startTime + durationMs;
  const now = Date.now();
  const delay = expiryTime - now;

  if (delay <= 0) {
    // Already expired, close immediately
    closeActivity(activity.code);
  } else {
    console.log(
      `Scheduling auto-close for ${activity.code} in ${Math.round(
        delay / 1000
      )}s`
    );
    setTimeout(() => {
      closeActivity(activity.code);
    }, delay);
  }
};

const closeActivity = async (code) => {
  try {
    const activity = await Activity.findOne({ where: { code } });
    if (activity && activity.isActive) {
      activity.isActive = false;
      await activity.save();
      io.to(code).emit("activity_ended");
      console.log(`Activity ${code} auto-closed.`);
    }
  } catch (err) {
    console.error(`Failed to auto-close activity ${code}:`, err);
  }
};

// --- API ROUTES ---

// Auth (Mock)
app.post("/api/auth/login", (req, res) => {
  const { username, role } = req.body;
  if (!username || !role)
    return res.status(400).json({ error: "Missing fields" });

  const user = { id: uuidv4(), username, role };
  res.json(user);
});

// Create Activity (Professor)
app.post("/api/activities", async (req, res) => {
  try {
    const { professorId, name, description, durationMinutes } = req.body;
    if (!professorId || !name)
      return res.status(400).json({ error: "Missing fields" });

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create in DB
    const activity = await Activity.create({
      code,
      name,
      description,
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
      professorId,
      isActive: true,
    });

    // Schedule auto-close if duration is set
    if (activity.durationMinutes) {
      scheduleAutoClose(activity);
    }

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Join/Get Activity (Student/Professor)
app.get("/api/activities/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const activity = await Activity.findOne({ where: { code } });

    if (!activity) return res.status(404).json({ error: "Activity not found" });

    // Note: We don't need to check expiry here anymore because the server-side timer
    // or the startup scan should handles it.
    // But as a fallback/safety measure, we can check.
    if (activity.isActive && activity.durationMinutes) {
      const startTime = new Date(activity.createdAt).getTime();
      const now = Date.now();
      if (now > startTime + activity.durationMinutes * 60000) {
        // It should have been closed, but maybe server was down or timer missed
        // Close it now (lazy expiration)
        await closeActivity(code);
        activity.isActive = false; // reflect in response
      }
    }

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// End Activity (Professor)
app.put("/api/activities/:code/end", async (req, res) => {
  try {
    const { code } = req.params;
    await closeActivity(code); // Reuse helper
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Professor History
app.get("/api/professors/:professorId/activities", async (req, res) => {
  try {
    const { professorId } = req.params;
    const activities = await Activity.findAll({
      where: { professorId },
      order: [["createdAt", "DESC"]],
    });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Feedback Logs (Professor)
app.get("/api/activities/:code/feedbacks", async (req, res) => {
  try {
    const { code } = req.params;
    const activityFeedbacks = await Feedback.findAll({
      where: { activityCode: code },
      order: [["timestamp", "ASC"]],
    });
    res.json(activityFeedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- SOCKET.IO ---

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_activity", (code) => {
    socket.join(code);
    console.log(`User ${socket.id} joined activity ${code}`);
  });

  socket.on("send_feedback", async (data) => {
    const { activityCode, type } = data;

    try {
      // Check if active before accepting
      const activity = await Activity.findOne({
        where: { code: activityCode },
      });
      if (!activity || !activity.isActive) {
        // You could emit an error back to the user here
        return;
      }

      const feedback = await Feedback.create({
        activityCode,
        type,
        timestamp: new Date(),
      });

      io.to(activityCode).emit("receive_feedback", feedback);
    } catch (err) {
      console.error("Error saving feedback:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Sync DB and Start Server
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database synced");

    // Restore timers for active activities
    const activeActivities = await Activity.findAll({
      where: { isActive: true },
    });
    activeActivities.forEach((act) => scheduleAutoClose(act));
    console.log(
      `Restored timers for ${activeActivities.length} active activities.`
    );

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
