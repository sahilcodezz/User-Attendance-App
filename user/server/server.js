const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes/route");
const { errorHandler, notFound } = require("./middleware/middleware");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Database ─────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection failed ❌", err.message));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UserHub API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/register | /api/auth/login | /api/auth/me",
      users: "/api/users",
      attendance: "/api/attendance | /api/attendance/history | /api/attendance/stats | /api/attendance/save",
      leaves: "/api/leaves",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🌐`);
});
