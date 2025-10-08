import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function EditorModal({ song, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    if (song) {
      setTitle(song.title || "");
      setArtist(song.artist || "");
      if (contentRef.current) contentRef.current.innerText = song.content || "";
    } else {
      setTitle("");
      setArtist("");
      if (contentRef.current) contentRef.current.innerText = "";
    }
  }, [song]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const songData = {
      id: song?.id || null,
      title: title.trim(),
      artist: artist.trim(),
      content: contentRef.current?.innerText.trim() || "",
    };
    onSave(songData);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog"
        style={{
          width: "calc(100% - 40px)",
          maxWidth: "100%",
          margin: "20px auto",
          height: "calc(100% - 40px)",
        }}
      >
        <div className="modal-content h-100 d-flex flex-column">
          {/* Header */}
          <div className="modal-header flex-shrink-0">
            <h5 className="modal-title">{song ? "Edit Song" : "Add New Song"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
            <div
              className="modal-body d-flex flex-column"
              style={{
                padding: "20px",
                maxHeight: "100%",
                overflow: "hidden",
              }}
            >
              {/* Artist + Title inline */}
              <div className="mb-3 d-flex gap-2">
                <div className="flex-grow-1">
                  <label className="form-label">Artist</label>
                  <input
                    type="text"
                    className="form-control"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-grow-1">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mb-3 flex-grow-1" style={{ display: "flex", flexDirection: "column" }}>
                <label className="form-label">Content</label>
                <div
                  ref={contentRef}
                  contentEditable
                  className="form-control flex-grow-1"
                  style={{
                    fontFamily: "'Bai Jamjuree', sans-serif",
                    whiteSpace: "pre-wrap",
                    fontSize: "1.1em",
                    lineHeight: 1.5,
                    overflowY: "auto",
                    border: "1px solid #ced4da",
                    borderRadius: ".25rem",
                    padding: "20px",
                    maxHeight: "calc(100vh - 350px)",
                  }}
                  suppressContentEditableWarning={true}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer flex-shrink-0">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                <FontAwesomeIcon icon={faFloppyDisk} /> {song ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
