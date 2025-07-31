import React from "react";

function ModalCreateLabel({ onSubmit, onCancel, language }) {
  return (
    <div className="modal-edit">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onCancel} title={language === "en" ? "Close" : "Tutup"}>&times;</button>
        <h3>{language === "en" ? "Create Label" : "Buat Label Baru"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input type="text" placeholder={language === "en" ? "Label Name" : "Nama Label"} required />
          <button type="submit" className="btn-add">
            {language === "en" ? "Save" : "Simpan"}
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onCancel} />
    </div>
  );
}

export default ModalCreateLabel;