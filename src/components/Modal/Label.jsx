import React from "react";
import "./Label.css";

function ModalLabel({ open, contact, onClose, onChangeLabel }) {
  if (!open || !contact) return null;
  return (
    <div className="modal-label-backdrop" onClick={onClose}>
      <div className="modal-label" onClick={e => e.stopPropagation()}>
        <h3>Ubah Label untuk {contact.nama}</h3>
        <button onClick={() => onChangeLabel(contact, "Keluarga")}>Keluarga</button>
        <button onClick={() => onChangeLabel(contact, "Teman")}>Teman</button>
        <button onClick={() => onChangeLabel(contact, "Kerja")}>Kerja</button>
        <button onClick={onClose} style={{marginTop: 16}}>Batal</button>
      </div>
    </div>
  );
}

export default ModalLabel;