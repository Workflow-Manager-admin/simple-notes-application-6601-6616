import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * Provides CRUD operations for notes using browser localStorage. Each note has {id, title, body, created, updated}.
 */
function useLocalNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local storage persistence key
  const KEY = "simple_notes_all";

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    let data = [];
    try {
      data = stored ? JSON.parse(stored) : [];
    } catch {
      data = [];
    }
    setNotes(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      window.localStorage.setItem(KEY, JSON.stringify(notes));
    }
    // eslint-disable-next-line
  }, [notes]);

  // PUBLIC_INTERFACE
  function createNote() {
    const newNote = {
      id: Date.now().toString(36),
      title: "",
      body: "",
      created: Date.now(),
      updated: Date.now()
    };
    setNotes(nlist => [newNote, ...nlist]);
    return newNote;
  }

  // PUBLIC_INTERFACE
  function updateNote(id, { title, body }) {
    setNotes(nlist =>
      nlist.map(n =>
        n.id === id ? { ...n, title, body, updated: Date.now() } : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    setNotes(nlist => nlist.filter(n => n.id !== id));
  }

  // PUBLIC_INTERFACE
  function getNote(id) {
    return notes.find(n => n.id === id);
  }

  // PUBLIC_INTERFACE
  function searchNotes(filter) {
    if (!filter.trim()) return notes;
    const f = filter.trim().toLowerCase();
    return notes.filter(
      n =>
        (n.title && n.title.toLowerCase().includes(f)) ||
        (n.body && n.body.toLowerCase().includes(f))
    );
  }

  // PUBLIC_INTERFACE
  function reorderNotesToTop(id) {
    setNotes(nlist => {
      const idx = nlist.findIndex(n => n.id === id);
      if (idx === -1) return nlist;
      const [note] = nlist.splice(idx, 1);
      return [note, ...nlist];
    });
  }

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    searchNotes,
    reorderNotesToTop
  };
}

export default useLocalNotes;
