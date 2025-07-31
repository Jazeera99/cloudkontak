import React, { useRef } from "react";

function ModalProfile({ contact, onSave, onClose, language }) {
  const fileInput = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    if (fileInput.current.files[0]) {
      onSave(contact.id, fileInput.current.files[0]);
    }
  };

  return (
    <div className="modal-edit">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} title={language === "en" ? "Close" : "Tutup"}>&times;</button>
        <h3>{language === "en" ? "Change Profile Photo" : "Ganti Foto Profil"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="file" accept="image/*" ref={fileInput} required />
          <button type="submit" className="btn-add">
            {language === "en" ? "Save" : "Simpan"}
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

export default ModalProfile;