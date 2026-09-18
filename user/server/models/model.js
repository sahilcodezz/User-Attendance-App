const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── User Model ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    company: {
      name: { type: String, default: "" },
      catchPhrase: { type: String, default: "" },
      bs: { type: String, default: "" },
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      zipcode: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Attendance Model ─────────────────────────────────────────────────────────
const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD"
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Half Day"],
      required: true,
    },
    checkIn: {
      type: String,
      default: "-",
    },
    checkOut: {
      type: String,
      default: "-",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// One attendance record per user per date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// ─── Leave Model ──────────────────────────────────────────────────────────────
const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick Leave", "Casual Leave", "Annual Leave", "Emergency Leave", "Other"],
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Leave = mongoose.model("Leave", leaveSchema);

module.exports = { User, Attendance, Leave };
