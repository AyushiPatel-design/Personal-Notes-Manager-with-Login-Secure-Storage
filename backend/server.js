const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load Models
require("./models/User");
require("./models/Note");

// Load Routes
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/personal_notes")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
