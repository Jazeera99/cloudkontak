import React from "react";

function ModalDelete({ onConfirm, onCancel, language }) {
  return (
    <div className="modal-edit">
      <div className="modal-content" style={{ textAlign: "center" }}>
        <button className="modal-close-btn" onClick={onCancel} title={language === "en" ? "Close" : "Tutup"}>&times;</button>
        <h3>{language === "en" ? "Delete Confirmation" : "Konfirmasi Hapus"}</h3>
        <p>{language === "en" ? "Are you sure you want to delete this contact?" : "Apakah Anda yakin untuk menghapus kontak ini?"}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18 }}>
          <button className="btn-delete" style={{ minWidth: 80 }} onClick={onConfirm}>
            {language === "en" ? "Yes, Delete" : "Ya, Hapus"}
          </button>
          <button className="btn-cancel" style={{ minWidth: 80 }} onClick={onCancel}>
            {language === "en" ? "Cancel" : "Batal"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel} />
    </div>
  );
}

export default ModalDelete;