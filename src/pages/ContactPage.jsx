import React, { useState, useEffect } from "react"; 
import ContactList from "../components/ContactList";
import ContactForm from "../components/ContactForm"; 
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ModalAdd from "../components/Modal/Add";
import ModalEdit from "../components/Modal/Edit";
import ModalDelete from "../components/Modal/Delete";
import ModalCreateLabel from "../components/Modal/CreateLabel";
import ModalSettings from "../components/Modal/Settings";
import ModalProfile from "../components/Modal/Profile";
import ContactAlphaFilter from "../components/ContactAlphaFilter";
import "./ContactPage.css";
import Toast from '../components/Toast';

import { getContacts, createContact, updateContact, deleteContact, uploadAvatar, updateFavorite } from '../api/kontak';



const categories = ["Semua", "Teman", "Keluarga", "Kerja"];

function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateLabel, setShowCreateLabel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState("id");
  const [fontSize, setFontSize] = useState("normal");
  const [profileContact, setProfileContact] = useState(null);
  const [selectedAlpha, setSelectedAlpha] = useState("");
  const [openMenuMobile, setOpenMenuMobile] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchContacts = async () => {
    setLoading(true); 
    setError(null);   
    try {
      const response = await getContacts(); 
      // Mapping isFavorite dari backend ke favorite di frontend
      const mapped = response.data.data.map(c => ({
        ...c,
        favorite: c.isFavorite, // pastikan field ini konsisten
      }));
      setContacts(mapped);
    } catch (err) {
      console.error("Gagal mengambil kontak:", err);
      setError("Gagal memuat kontak. Pastikan backend berjalan dan terhubung ke database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []); 

  const handleAddContact = async (contactData) => {
    try {
      const response = await createContact(contactData);
      setAdding(false);
      fetchContacts();
      showToast("Kontak berhasil ditambahkan!", "success");
    } catch (err) {
      showToast("Gagal menambah kontak: " + (err.response?.data?.message || err.message), "error");
      console.error("Error adding contact:", err);
    }
  };

  const handleUpdateContact = async (contactData) => {
    try {
      const response = await updateContact(contactData._id, contactData);
      setEditing(null);
      fetchContacts();
      showToast("Kontak berhasil diperbarui!", "success");
    } catch (err) {
      showToast("Gagal mengupdate kontak: " + (err.response?.data?.message || err.message), "error");
      console.error("Error updating contact:", err);
    }
  };

  const handleDeleteContact = async () => {
    if (!deleting) return;
    try {
      await deleteContact(deleting._id);
      fetchContacts();
      setDeleting(null);
      showToast("Kontak berhasil dihapus!", "success");
    } catch (err) {
      showToast("Gagal menghapus kontak: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleCategory = (category) => {
    setFilter(category);
    if (category === "Semua") {
      setSearch("");
      setSearchInput("");
    }
  };

  const filteredContacts = contacts
  .filter(contact => {
    // Filter berdasarkan search
    const matchesSearch =
      contact.nama.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.no_hp.toLowerCase().includes(search.toLowerCase());

    // Filter berdasarkan kategori label
    const matchesFilter =
      filter === "Semua" ||
      (contact.grup && contact.grup.toLowerCase() === filter.toLowerCase());

    // Filter berdasarkan huruf awal nama (selectedAlpha)
    const matchesAlpha =
      !selectedAlpha ||
      (contact.nama && contact.nama.charAt(0).toUpperCase() === selectedAlpha);

    return matchesSearch && matchesFilter && matchesAlpha;
  })
  .sort((a, b) => {
    // Favorite di atas
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    // Lalu urutkan A-Z
    return (a.nama || "").localeCompare(b.nama || "");
  });

  const syncContacts = () => {
    fetchContacts(); 
    alert("Kontak berhasil disinkronkan!");
  };

  const handleChangeProfile = (contact) => {
    setProfileContact(contact);
  };

  const handleSaveProfile = async (contactId, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file); 


      const newAvatarUrl = response.data.url;


      setContacts(prevContacts =>
        prevContacts.map(c =>
          c._id === contactId ? { ...c, avatar: newAvatarUrl } : c
        )
      );
      setProfileContact(null);
      alert("Foto profil berhasil diupdate!");
    } catch (err) {
      alert("Gagal mengupload foto profil: " + (err.response?.data?.message || err.message));
      console.error("Error uploading avatar:", err);
    }
  };

  const handleSettingsSave = (theme, language, fontSize) => {
    setTheme(theme);
    setLanguage(language);
    setFontSize(fontSize);
    setShowSettings(false);
  };

  const handleToggleFavorite = async (contact) => {
    try {
      // Update ke backend
      await updateFavorite(contact._id, !contact.favorite);
      // Update state lokal setelah backend sukses
      setContacts(prev =>
        prev.map(c =>
          c._id === contact._id ? { ...c, favorite: !c.favorite } : c
        )
      );
    } catch (err) {
      alert("Gagal mengubah favorite");
    }
  };

  const handleChangeLabel = async (contact, label) => {
    try {
      await updateContact(contact._id, { ...contact, grup: label });
      fetchContacts();
    } catch (err) {
      alert("Gagal mengubah label: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [theme]);

  useEffect(() => {
    setSearch(searchInput); // Update search setiap kali searchInput berubah
  }, [searchInput]);

  if (loading) {
    return (
      <div className="contact-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Memuat kontak dari server...
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar onMenu={() => setSidebarOpen(true)} />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Overlay untuk blokir Navbar saat modal aktif */}
      {(adding || editing || deleting) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: 70, // tinggi Navbar
            zIndex: 2000, // lebih tinggi dari Navbar
            background: "rgba(0,0,0,0)", // transparan
            pointerEvents: "auto"
          }}
        />
      )}

      {sidebarOpen && (
        <>
          <Sidebar
            contactCount={contacts.length}
            onClose={() => setSidebarOpen(false)}
            onCreateLabel={() => { setShowCreateLabel(true); setSidebarOpen(false); }}
            onSettings={() => { setShowSettings(true); setSidebarOpen(false); }}
            onHelp={() => { alert("Help & Feedback: Lihat panduan, FAQ, atau kirim masukan ke pengembang."); setSidebarOpen(false); }}
            onAbout={() => { alert("Tentang: SoraContact v1.0. Aplikasi manajemen kontak."); setSidebarOpen(false); }}
          />
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        </>
      )}

      <div className={`contact-page-container theme-${theme} font-${fontSize}`}>
        <header className="contact-header">
          <div className="contact-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn${filter === cat ? " active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
  
        </header>

        <div className="contact-search-bar">
          <input
            type="text"
            placeholder="Cari nama/email/telepon"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {/* ...existing search elements... */}
        </div>

        {/* Area dengan alphabet filter dan button tambah kontak */}
        <div className="alpha-controls-container">
          <ContactAlphaFilter
            selected={selectedAlpha}
            onSelect={setSelectedAlpha}
          />
          
          <button 
            className="btn-add-contact-table" 
            onClick={() => setAdding(true)}
            title="Tambah Kontak Baru"
          >
            + Tambah Kontak
          </button>
        </div>

        <ContactList
          contacts={filteredContacts}
          onToggleFavorite={handleToggleFavorite}
          onEdit={setEditing}
          onDelete={setDeleting}
          onChangeLabel={handleChangeLabel}
          onOpenMenuMobile={setOpenMenuMobile}
        />

        {/* Modal Edit */}
        {editing && (
          <ModalEdit
            contact={editing}
            onSubmit={handleUpdateContact} 
            onCancel={() => setEditing(null)}
            language={language}
            existingContacts={contacts}
          />
        )}

        {/* Modal Add */}
        {adding && (
          <ModalAdd
            onSubmit={handleAddContact} 
            onCancel={() => setAdding(false)}
            language={language}
            existingContacts={contacts}
          />
        )}

        {/* Modal Konfirmasi Hapus */}
        {deleting && (
          <ModalDelete
            onCancel={() => setDeleting(null)}
            onConfirm={handleDeleteContact}
          >
            <button onClick={handleDeleteContact} className="btn-delete-confirm">Ya, Hapus</button>
          </ModalDelete>
        )}

        {/* Modal Create Label */}
        {showCreateLabel && (
          <ModalCreateLabel
            onSubmit={() => {
              alert("Label berhasil dibuat (dummy).");
              setShowCreateLabel(false);
            }}
            onCancel={() => setShowCreateLabel(false)}
          />
        )}

        {/* Modal Settings */}
        {showSettings && (
          <ModalSettings
            theme={theme}
            language={language}
            fontSize={fontSize}
            onSave={handleSettingsSave}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Modal Profile */}
        {profileContact && (
          <ModalProfile
            contact={profileContact}
            onSave={handleSaveProfile}
            onClose={() => setProfileContact(null)}
            language={language}
          />
        )}

        {/* Popup Menu Mobile */}
        {openMenuMobile !== null && (
          <div className="aksi-popup-menu" style={{ right: 0, top: 36, zIndex: 20 }}>
            {/* Tombol favorite di popup */}
            <button
              className="btn-favorite"
              onClick={() => {
                handleToggleFavorite(openMenuMobile);
                setOpenMenuMobile(null);
              }}
              style={{
                color: openMenuMobile.favorite ? "#FFD600" : "#1976d2",
                fontWeight: 600,
                background: "none",
                border: "none",
                textAlign: "left",
                width: "100%",
                padding: "10px 18px 8px 18px",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {openMenuMobile.favorite ? "★ Hapus Favorite" : "★ Jadikan Favorite"}
            </button>
            <button
              className="btn-delete"
              onClick={() => {
                setOpenMenuMobile(null);
                onDelete(openMenuMobile);
              }}
            >
              <span style={{ fontWeight: 600 }}>Delete</span>
            </button>
            <div className="label-section">
              <div className="label-title">Label:</div>
              <div className="label-options">
                {["Teman", "Keluarga", "Kerja", ""].map(label => (
                  <div
                    key={label}
                    className={`label-item${openMenuMobile.grup === label ? " label-item-active" : ""}`}
                    onClick={() => {
                      handleChangeLabel(openMenuMobile, label);
                      setOpenMenuMobile(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      cursor: "pointer",
                      fontWeight: openMenuMobile.grup === label ? "bold" : "normal",
                      color: openMenuMobile.grup === label ? "#1976d2" : "#333",
                      marginBottom: 5,
                    }}
                  >
                    {openMenuMobile.grup === label && (
                      <span style={{ color: "#1976d2", fontSize: 16 }}>✔</span>
                    )}
                    {label === "" ? "Tanpa Label" : label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactPage;