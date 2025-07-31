import React from "react";

function Sidebar({ contactCount, onClose, onCreateLabel, onSettings, onHelp, onAbout }) {
  return (
    <div className="sidebar">
      <button className="sidebar-close" onClick={onClose} title="Tutup">&times;</button>
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-list">
        <li>
          <span
            className="sidebar-link"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "default",
              opacity: 1,
              pointerEvents: "none",
              userSelect: "none",
              background: "#e3f0ff",
              borderRadius: 8,
              padding: "6px 10px", // lebih kecil, sama seperti menu lain
              marginBottom: 0,     // hilangkan margin bawah
              fontWeight: "bold"
            }}
          >
            <span className="sidebar-icon" role="img" aria-label="contacts">📇</span>
            <span className="sidebar-text" style={{ color: "#1976d2" }}>Contacts</span>
            <span style={{ marginLeft: 8, color: "#1976d2", fontWeight: "bold" }}>
              {contactCount}
            </span>
          </span>
        </li>
        <li>
          <button className="sidebar-link" onClick={onSettings}>
            <span className="sidebar-icon" role="img" aria-label="settings">⚙️</span>
            <span className="sidebar-text">Settings</span>
          </button>
        </li>
        <li>
          <button className="sidebar-link" onClick={onAbout}>
            <span className="sidebar-icon" role="img" aria-label="about">ℹ️</span>
            <span className="sidebar-text">Tentang</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;