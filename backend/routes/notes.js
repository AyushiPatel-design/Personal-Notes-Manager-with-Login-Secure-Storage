const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// Get Notes
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user }).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// Add Note
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content, userId: req.user });
  await note.save();
  res.json(note);
});

// Update Note
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const updated = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(updated);
});

// Delete Note
router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note Deleted" });
});

// Toggle Pin
router.put("/pin/:id", auth, async (req, res) => {
  const note = await Note.findById(req.params.id);
  note.pinned = !note.pinned;
  await note.save();
  res.json({ message: note.pinned ? "Pinned" : "Unpinned" });
});

module.exports = router;
