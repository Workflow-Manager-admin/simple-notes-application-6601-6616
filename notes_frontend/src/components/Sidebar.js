import React from "react";
import PropTypes from "prop-types";
import "../styles/Sidebar.css";

// PUBLIC_INTERFACE
function Sidebar({
  notes,
  selectedId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  searchValue,
  onSearchChange
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Notes</h1>
        <button className="accent-btn" onClick={onAddNote} title="Add new note">
          ＋
        </button>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Search notes"
        />
      </div>
      <ul className="sidebar-list">
        {notes.length === 0 && (
          <li className="sidebar-empty">No notes found.</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={`sidebar-note${note.id === selectedId ? " active" : ""}`}
            onClick={() => onSelectNote(note.id)}
          >
            <div className="sidebar-note-title" title={note.title || "(Untitled)"}>
              {note.title || <em>(Untitled)</em>}
            </div>
            <button
              className="delete-btn"
              tabIndex={-1}
              title="Delete note"
              onClick={e => { e.stopPropagation(); onDeleteNote(note.id); }}
              aria-label="Delete note"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  onSelectNote: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default Sidebar;
