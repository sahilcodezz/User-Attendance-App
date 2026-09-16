const jwt = require("jsonwebtoken");
const { User, Attendance, Leave } = require("../models/model");

// ─── Helper ───────────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendResponse = (res, statusCode, data) =>
  res.status(statusCode).json({ success: true, ...data });

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message });

// ─── AUTH CONTROLLERS ─────────────────────────────────────────────────────────

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, company, address, website } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, "Email already registered");

    const user = await User.create({
      name, email, password, phone, role, company, address, website,
    });

    const token = signToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    sendResponse(res, 201, { token, user: userObj });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 400, "Email and password required");

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return sendError(res, 401, "Invalid email or password");

    const token = signToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    sendResponse(res, 200, { token, user: userObj });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendError(res, 404, "User not found");
    sendResponse(res, 200, { user });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// ─── USER CONTROLLERS ─────────────────────────────────────────────────────────

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    sendResponse(res, 200, { users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found");
    sendResponse(res, 200, { user });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, website, role, company, address } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, "Email already registered");

    const user = await User.create({ name, email, password: password || "user@123", phone, website, role, company, address });
    const userObj = user.toObject();
    delete userObj.password;

    sendResponse(res, 201, { user: userObj });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // never allow password update here
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) return sendError(res, 404, "User not found");
    sendResponse(res, 200, { user });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return sendError(res, 404, "User not found");
    sendResponse(res, 200, { message: "User deleted successfully" });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// ─── ATTENDANCE CONTROLLERS ───────────────────────────────────────────────────

// GET /api/attendance?date=YYYY-MM-DD
const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};
    const records = await Attendance.find(query).sort({ createdAt: -1 });
    sendResponse(res, 200, { records });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// POST /api/attendance/save  — saves entire day's attendance in bulk
const saveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    // records = [{ userId, userName, userEmail, status, checkIn, checkOut, note }]
    if (!date || !records?.length)
      return sendError(res, 400, "date and records are required");

    const ops = records.map((r) => ({
      updateOne: {
        filter: { userId: r.userId, date },
        update: {
          $set: {
            userName: r.userName,
            userEmail: r.userEmail,
            status: r.status,
            checkIn: r.checkIn || "-",
            checkOut: r.checkOut || "-",
            note: r.note || "",
            date,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    sendResponse(res, 200, { message: "Attendance saved successfully" });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// GET /api/attendance/history?userId=&fromDate=&toDate=
const getAttendanceHistory = async (req, res) => {
  try {
    const { userId, fromDate, toDate, page = 1, limit = 20 } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = fromDate;
      if (toDate) query.date.$lte = toDate;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Attendance.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Attendance.countDocuments(query),
    ]);

    sendResponse(res, 200, { records, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// GET /api/attendance/stats?date=YYYY-MM-DD
const getAttendanceStats = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};

    const [total, present, absent, late, halfDay] = await Promise.all([
      Attendance.countDocuments(query),
      Attendance.countDocuments({ ...query, status: "Present" }),
      Attendance.countDocuments({ ...query, status: "Absent" }),
      Attendance.countDocuments({ ...query, status: "Late" }),
      Attendance.countDocuments({ ...query, status: "Half Day" }),
    ]);

    sendResponse(res, 200, { stats: { total, present, absent, late, halfDay } });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// ─── LEAVE CONTROLLERS ────────────────────────────────────────────────────────

// GET /api/leaves — get all leaves (admin) or own (user)
const getLeaves = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (Number(page) - 1) * Number(limit);
    const [leaves, total] = await Promise.all([
      Leave.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Leave.countDocuments(query),
    ]);

    sendResponse(res, 200, { leaves, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// POST /api/leaves — apply for leave
const applyLeave = async (req, res) => {
  try {
    const { userId, userName, userEmail, leaveType, fromDate, toDate, totalDays, reason } = req.body;

    if (!userId || !leaveType || !fromDate || !toDate || !reason)
      return sendError(res, 400, "All fields are required");

    const leave = await Leave.create({
      userId, userName, userEmail, leaveType, fromDate, toDate,
      totalDays: totalDays || 1, reason,
    });

    sendResponse(res, 201, { leave });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// PUT /api/leaves/:id — approve or reject (admin only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["Approved", "Rejected"].includes(status))
      return sendError(res, 400, "Status must be Approved or Rejected");

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote: reviewNote || "", reviewedBy: req.user?.id || null },
      { new: true, runValidators: true }
    );

    if (!leave) return sendError(res, 404, "Leave not found");
    sendResponse(res, 200, { leave });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// DELETE /api/leaves/:id — cancel leave (only if pending)
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return sendError(res, 404, "Leave not found");
    if (leave.status !== "Pending")
      return sendError(res, 400, "Only pending leaves can be cancelled");

    await Leave.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, { message: "Leave cancelled successfully" });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

module.exports = {
  // auth
  register, login, getMe,
  // users
  getAllUsers, getUserById, createUser, updateUser, deleteUser,
  // attendance
  getAttendance, saveAttendance, getAttendanceHistory, getAttendanceStats,
  // leaves
  getLeaves, applyLeave, updateLeaveStatus, deleteLeave,
};
