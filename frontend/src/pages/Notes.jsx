// src/pages/Notes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Redirect if no login
  if (!token) navigate("/login");

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching notes");
    }
  };

  // Add or Update Note
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return alert("Please fill fields");

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editingId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Note Updated!");
      } else {
        await axios.post(
          "http://localhost:5000/api/notes",
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Note Added!");
      }
      setTitle("");
      setContent("");
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      alert("Error saving note");
    }
  };

  // Start Editing
  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Delete Note
  const deleteNote = async (id) => {
    if (!window.confirm("Delete note?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Note Deleted");
      fetchNotes();
    } catch (err) {
      alert("Error deleting note");
    }
  };

  // Toggle Pin
  const togglePin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notes/pin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      alert("Error pinning note");
    }
  };

  // Download TXT
  const downloadNote = (note) => {
    const element = document.createElement("a");
    const file = new Blob([`Title: ${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    element.click();
  };

  // Share Note
  const shareNote = async (note) => {
    const text = `*${note.title}*\n\n${note.content}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Search filter (Title + Content)
  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h1>My Notes</h1>
        <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
      </div>

      {/* Search Bar */}
      <input
        className="form-control mb-3"
        placeholder="🔍 Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add/Edit Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editingId ? "✏ Edit Note" : "➕ Add Note"}</h5>
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Content"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button className="btn btn-primary me-2" onClick={saveNote}>
            {editingId ? "Save" : "Add"}
          </button>

          {editingId && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="row">
        {filtered.map((note) => (
          <div key={note._id} className="col-12 col-md-6 mb-3">
            <div className={`card h-100 shadow-sm`}>
              <div className="card-body d-flex flex-column">
                <h5>
                  {note.title}{" "}
                  {note.pinned && <span style={{ color: "gold" }}>📌</span>}
                </h5>
                <p className="flex-grow-1">{note.content}</p>

                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-warning" onClick={() => togglePin(note._id)}>
                    📌 {note.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button className="btn btn-sm btn-success" onClick={() => downloadNote(note)}>
                    💾
                  </button>
                  <button className="btn btn-sm btn-info" onClick={() => shareNote(note)}>
                    📤
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(note)}>
                    ✏
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNote(note._id)}>
                    🗑
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
