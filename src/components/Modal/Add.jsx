import React from "react";
import ContactForm from "../ContactForm";

function ModalAdd({ onSubmit, onCancel, language, existingContacts }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onCancel} title={language === "en" ? "Close" : "Tutup"}>&times;</button>
        <h2>{language === "en" ? "Add Contact" : "Tambah Kontak"}</h2>
        <ContactForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          language={language}
          existingContacts={existingContacts}
        />
      </div>
    </div>
  );
}

export default ModalAdd;