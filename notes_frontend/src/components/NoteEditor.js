import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/NoteEditor.css";

// PUBLIC_INTERFACE
function NoteEditor({ note, onChange, onSave, isSaving }) {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setBody(note?.body || "");
  }, [note?.id]);

  // Handle edits
  function handleEdit() {
    onChange({ ...note, title, body });
  }

  function handleSave(e) {
    e.preventDefault();
    onSave({ ...note, title: title.trim(), body });
  }

  return (
    <section className="editor">
      <form className="editor-form" onSubmit={handleSave} autoComplete="off">
        <input
          className="editor-title"
          placeholder="Title"
          autoFocus
          value={title}
          onChange={e => { setTitle(e.target.value); handleEdit(); }}
          maxLength={48}
        />
        <textarea
          className="editor-body"
          placeholder="Write your note here..."
          rows={14}
          value={body}
          onChange={e => { setBody(e.target.value); handleEdit(); }}
        />
        <div className="editor-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={isSaving || (!title.trim() && !body.trim())}
            aria-label="Save note"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}

NoteEditor.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool
};

export default NoteEditor;
