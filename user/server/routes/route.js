const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/middleware");
const {
  // auth
  register, login, getMe,
  // users
  getAllUsers, getUserById, createUser, updateUser, deleteUser,
  // attendance
  getAttendance, saveAttendance, getAttendanceHistory, getAttendanceStats,
  // leaves
  getLeaves, applyLeave, updateLeaveStatus, deleteLeave,
} = require("../controllers/controller");

// ─── Auth Routes ──────────────────────────────────────────────────────────────
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", protect, getMe);

// ─── User Routes ──────────────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// ─── Attendance Routes ────────────────────────────────────────────────────────
// GET  /api/attendance?date=YYYY-MM-DD        → fetch attendance by date
// GET  /api/attendance/history                → full history with filters
// GET  /api/attendance/stats?date=YYYY-MM-DD  → stats for a date
// POST /api/attendance/save                   → bulk save attendance
router.get("/attendance/history", getAttendanceHistory);
router.get("/attendance/stats", getAttendanceStats);
router.get("/attendance", getAttendance);
router.post("/attendance/save", saveAttendance);

// ─── Leave Routes ─────────────────────────────────────────────────────────────
// GET  /api/leaves?status=&userId=  → all leaves
// POST /api/leaves                  → apply for leave
// PUT  /api/leaves/:id              → approve/reject (admin)
// DELETE /api/leaves/:id            → cancel pending leave
router.get("/leaves", getLeaves);
router.post("/leaves", applyLeave);
router.put("/leaves/:id", protect, adminOnly, updateLeaveStatus);
router.delete("/leaves/:id", deleteLeave);

module.exports = router;
