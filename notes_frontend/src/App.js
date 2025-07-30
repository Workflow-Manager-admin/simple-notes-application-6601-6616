import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import useLocalNotes from "./hooks/useLocalNotes";
import "./App.css";
import "./styles/Sidebar.css";
import "./styles/NoteEditor.css";

// PUBLIC_INTERFACE
/**
 * Main App component for the Simple Notes application (minimal, light, responsive)
 * Features: List, create, edit, delete, and search notes with a sidebar UI and main editing area.
 */
function App() {
  // Theme handling (only light by default)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // Search & selection state
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editedNote, setEditedNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Notes hook (localStorage-based CRUD)
  const {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    searchNotes,
    reorderNotesToTop
  } = useLocalNotes();

  const notesToShow = search.trim() ? searchNotes(search) : notes;

  // Select a note
  const handleSelectNote = useCallback(
    (id) => {
      setSelectedId(id);
      const note = getNote(id);
      setEditedNote(note ? { ...note } : null);
    },
    [getNote]
  );

  // Add a new note
  const handleAddNote = useCallback(() => {
    const newNote = createNote();
    setSelectedId(newNote.id);
    setEditedNote({ ...newNote });
  }, [createNote]);

  // Edit note draft in editor
  const handleEditNoteDraft = updated => {
    setEditedNote(updated);
  };

  // Save note draft to storage
  const handleSaveNote = (upd) => {
    if (!upd?.id) return;
    setIsSaving(true);
    setTimeout(() => {
      updateNote(upd.id, { title: upd.title, body: upd.body });
      reorderNotesToTop(upd.id);
      setIsSaving(false);
    }, 150); // Simulate async
  };

  // Delete a note
  const handleDeleteNote = useCallback(
    id => {
      if (window.confirm("Delete this note?")) {
        deleteNote(id);
        if (id === selectedId) {
          setSelectedId(null);
          setEditedNote(null);
        }
      }
    },
    [deleteNote, selectedId]
  );

  // After storage changes, update editor selection if current note was deleted
  useEffect(() => {
    if (selectedId && !notes.find(n => n.id === selectedId)) {
      setSelectedId(null);
      setEditedNote(null);
    }
  }, [notes, selectedId]);

  // On first mount: auto-select first note if none
  useEffect(() => {
    if (!selectedId && notes.length > 0) {
      setSelectedId(notes[0].id);
      setEditedNote({ ...notes[0] });
    }
  }, [selectedId, notes]);

  // Theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="App" style={{
      backgroundColor: "var(--bg-primary, #fff)",
      color: "var(--text-primary, #282c34)",
      width: "100vw",
      height: "100vh",
      minHeight: 0,
      minWidth: 0,
      display: "flex",
      flexDirection: "row"
    }}>
      <Sidebar
        notes={notesToShow}
        selectedId={selectedId}
        onSelectNote={handleSelectNote}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <main style={{ flex: 1, minWidth: 0, background: "var(--bg-primary, #fff)" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ position: "fixed", top: 22, right: 30, zIndex: 10 }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {loading ? (
          <div style={{
            margin: "25vh auto",
            textAlign: "center",
            fontSize: "120%",
            color: "#b0b0b0"
          }}>
            Loading notes...
          </div>
        ) : !editedNote ? (
          <div style={{
            margin: "30vh auto",
            textAlign: "center",
            color: "#5d6d7e",
            opacity: 0.7
          }}>
            <h2>Welcome to Simple Notes!</h2>
            <p>Select or create a note to get started.</p>
          </div>
        ) : (
          <NoteEditor
            note={editedNote}
            onChange={handleEditNoteDraft}
            onSave={handleSaveNote}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}

export default App;
