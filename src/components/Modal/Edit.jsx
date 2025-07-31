import React from "react";
import ContactForm from "../ContactForm";

function ModalEdit({ contact, onSubmit, onCancel, language, existingContacts }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ textAlign: 'center' }}>Edit Kontak</h2>
        <ContactForm
          contact={contact}
          onSubmit={onSubmit}
          onCancel={onCancel}
          language={language}
          existingContacts={existingContacts}
        />
      </div>
    </div>
  );
}

export default ModalEdit;