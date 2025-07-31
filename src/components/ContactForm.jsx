// C:\apps\www\cloudkontak\src\components\ContactForm.jsx
import React, { useEffect, useRef, useState } from "react";
import "./ContactForm.css";

const initialState = { nama: "", no_hp: "", email: "", group: "", alamat: "", avatar: null };

function ContactForm({ contact, onSubmit, onCancel, language, existingContacts = [] }) {
  const [form, setForm] = useState({
    nama: contact?.nama || "",
    email: contact?.email || "",
    no_hp: contact?.no_hp || "",
    alamat: contact?.alamat || "",
    group: contact?.group || "",
    avatar: contact?.avatar || null,
  });
  const [error, setError] = useState(""); // Tambahkan state error
  const fileInput = useRef();

  useEffect(() => {
    if (contact) {
      setForm({
        nama: contact.nama || "",
        email: contact.email || "",
        no_hp: contact.no_hp || "",
        alamat: contact.alamat || "",
        group: contact.group || "",
        avatar: contact.avatar || null,
        _id: contact._id || null,
      });
    } else {
      setForm(initialState);
    }
    setError(""); // Reset error saat ganti contact
  }, [contact]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Reset error saat user mengetik
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target.result, newFile: file }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi email
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError(language === "en" ? "Email must contain '@' and '.'" : "Email harus mengandung '@' dan '.'");
      return;
    }

    // Validasi nomor telepon format
    if (!/^\d{1,13}$/.test(form.no_hp)) {
      setError(language === "en"
        ? "Phone number must be numbers only and max 13 digits"
        : "Nomor telepon harus berupa angka dan maksimal 13 digit");
      return;
    }

    // Validasi email duplikat
    const emailExists = existingContacts.some(c => 
      c.email === form.email && c._id !== form._id
    );
    if (emailExists) {
      setError(language === "en" ? "Email already exists" : "Email sudah ada");
      return;
    }

    // Validasi nomor HP duplikat
    const phoneExists = existingContacts.some(c => 
      c.no_hp === form.no_hp && c._id !== form._id
    );
    if (phoneExists) {
      setError(language === "en" ? "Phone number already exists" : "Nomor telepon sudah ada");
      return;
    }

    setError(""); // Bersihkan error jika lolos validasi
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}
    >
      <div className="photo-upload-container">
        {form.avatar && (
          <img
            src={form.avatar}
            alt="Avatar Preview"
            className="avatar-preview"
          />
        )}
        <div className="input-photo-wrapper">
          <label htmlFor="photo-upload" className="upload-btn">
            👤 {language === "en" ? "Upload Photo" : "Unggah Foto"}
          </label>
          <input
            id="photo-upload"
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
      </div>
      <input
        name="nama"
        type="text"
        placeholder={language === "en" ? "Name" : "Nama"}
        value={form.nama}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="no_hp"
        type="text"
        placeholder={language === "en" ? "Phone number" : "Nomor telepon"}
        value={form.no_hp}
        onChange={handleChange}
        required
      />
      <input
        name="alamat"
        type="text"
        placeholder={language === "en" ? "Address" : "Alamat"}
        value={form.alamat}
        onChange={handleChange}
      />
      <select name="group" value={form.group} onChange={handleChange}>
        <option value="">{language === "en" ? "Select group" : "Pilih grup"}</option>
        <option value="Teman">{language === "en" ? "Friend" : "Teman"}</option>
        <option value="Keluarga">{language === "en" ? "Family" : "Keluarga"}</option>
        <option value="Kerja">{language === "en" ? "Work" : "Kerja"}</option>
      </select>
      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="form-error-message">{error}</div>
      )}
      <div>
        <button type="submit" className="btn-add">
          {language === "en" ? "Save" : "Simpan"}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          {language === "en" ? "Cancel" : "Batal"}
        </button>
      </div>
      {/* Tambahkan style untuk error */}
      <style>{`
        .form-error-message {
          background: #ffeaea;
          color: #d32f2f;
          border: 1px solid #d32f2f;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 8px;
          font-weight: 500;
          text-align: center;
        }
        .theme-dark .form-error-message {
          background: #2a1a1a;
          color: #ff7675;
          border-color: #ff7675;
        }
      `}</style>
    </form>
  );
}

export default ContactForm;