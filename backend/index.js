require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticateToken } = require("./utilities");

const logger = require("./logger");
const asyncHandler = require("./asyncHandler");
const errorHandler = require("./errorMiddleware");

const app = express();

// Connect to MongoDB
mongoose.connect(config.connectionString)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch(err => logger.error("MongoDB connection error", err));

app.use(express.json());
app.use(cors({ origin: "*" }));

// HTTP Request Logger
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, body: req.body });
  next();
});

// Routes
app.get("/", (req, res) => {
  logger.info("Root endpoint hit");
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  logger.info("Create-account request received", { email });

  if (!fullName || !email || !password) {
    logger.warn("Missing fields in create-account", { body: req.body });
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    logger.warn("User already exists", { email });
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign(
    { user: { _id: user._id, email: user.email } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  logger.info("User created successfully", { userId: user._id });

  res.json({ error: false, user, accessToken, message: "Registration Successful" });
}));

// Login
app.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  logger.info("Login request received", { email });

  if (!email || !password) {
    logger.warn("Missing email or password", { email });
    return res.status(400).json({ error: true, message: "Email and password required" });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    logger.warn("User not found during login", { email });
    return res.status(400).json({ error: true, message: "User not found" });
  }

  if (userInfo.password !== password) {
    logger.warn("Invalid credentials attempt", { email });
    return res.status(400).json({ error: true, message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { user: userInfo },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "3600m" }
  );

  logger.info("Login successful", { email, userId: userInfo._id });

  res.json({ error: false, message: "Login Successful", email, accessToken });
}));

// Add Note
app.post("/add-notes", authenticateToken, asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title || !content) {
    logger.warn("Missing title/content for add-notes", { userId: user._id });
    return res.status(400).json({ error: true, message: "Title and content required" });
  }

  const note = new Note({ title, content, tags: tags || [], userId: user._id });
  await note.save();

  logger.info("Note added successfully", { userId: user._id, noteId: note._id });
  res.json({ error: false, note, message: "Note added Successfully" });
}));

// Edit Note
app.put("/edit-notes/:noteId", authenticateToken, asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  const note = await Note.findOne({ _id: noteId, userId: user._id });
  if (!note) {
    logger.warn("Note not found for edit", { userId: user._id, noteId });
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags;
  if (isPinned !== undefined) note.isPinned = isPinned;

  await note.save();
  logger.info("Note updated successfully", { userId: user._id, noteId });
  res.json({ error: false, note, message: "Note Updated Successfully" });
}));

// Get all notes
app.get("/get-all-notes", authenticateToken, asyncHandler(async (req, res) => {
  const { user } = req.user;
  const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
  logger.info("Retrieved all notes", { userId: user._id, count: notes.length });
  res.json({ error: false, notes, message: "All notes retrieved successfully" });
}));

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  const note = await Note.findOne({ _id: noteId, userId: user._id });
  if (!note) {
    logger.warn("Note not found for delete", { userId: user._id, noteId });
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  await Note.deleteOne({ _id: noteId, userId: user._id });
  logger.info("Note deleted successfully", { userId: user._id, noteId });
  res.json({ error: false, message: "Note deleted successfully" });
}));

// Update Note Pin
app.put("/update-note-pinned/:noteId", authenticateToken, asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  const note = await Note.findOne({ _id: noteId, userId: user._id });
  if (!note) {
    logger.warn("Note not found for pin update", { userId: user._id, noteId });
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  note.isPinned = isPinned;
  await note.save();
  logger.info("Note pin status updated", { userId: user._id, noteId, isPinned });
  res.json({ error: false, note, message: "Note Updated Successfully" });
}));

// Get User
app.get("/get-user", authenticateToken, asyncHandler(async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    logger.warn("User not found in get-user", { userId: user._id });
    return res.sendStatus(401);
  }

  logger.info("User retrieved successfully", { userId: user._id });
  res.json({ user: { fullName: isUser.fullName, email: isUser.email, _id: isUser._id, createdOn: isUser.createdOn }, message: "" });
}));

// Global Error Handler
app.use(errorHandler);

app.listen(8000, () => {
  logger.info("Server running on http://localhost:8000");
});

module.exports = app;
