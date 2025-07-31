import React, { useState, useEffect } from "react";

function ModalSettings({ theme, language, fontSize, onSave, onClose }) {
  const [isDark, setIsDark] = useState(theme === "dark");
  const [localLang, setLocalLang] = useState(language);
  const [localFont, setLocalFont] = useState(fontSize);

  // Objek teks sesuai bahasa
  const texts = localLang === "en"
    ? {
        title: "App Settings",
        theme: "Theme:",
        dark: "Dark",
        light: "Light",
        language: "Language:",
        fontSize: "Font Size:",
        small: "Small",
        normal: "Normal",
        large: "Large",
        autoSync: "Auto Sync:",
        save: "Save",
        close: "Close",
        upload: "Upload Photo",
        cancel: "Cancel",
        search: "Search",
      }
    : {
        title: "Pengaturan Aplikasi",
        theme: "Tema:",
        dark: "Gelap",
        light: "Terang",
        language: "Bahasa:",
        fontSize: "Ukuran Font:",
        small: "Kecil",
        normal: "Normal",
        large: "Besar",
        autoSync: "Sinkronisasi Otomatis:",
        save: "Simpan",
        close: "Tutup",
        upload: "Unggah Foto",
        cancel: "Batal",
        search: "Cari",
      };

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  useEffect(() => {
    setLocalLang(language);
  }, [language]);

  useEffect(() => {
    setLocalFont(fontSize);
  }, [fontSize]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(isDark ? "dark" : "light", localLang, localFont);
  };

  return (
    <div className="modal-edit">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} title={texts.close}>&times;</button>
        <h3>{texts.title}</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label>
            {texts.theme}
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => setIsDark((prev) => !prev)}
            />{" "}
            {isDark ? texts.dark : texts.light}
          </label>
          <label>
            {texts.fontSize}
            <select value={localFont} onChange={e => setLocalFont(e.target.value)}>
              <option value="small">{texts.small}</option>
              <option value="normal">{texts.normal}</option>
              <option value="large">{texts.large}</option>
            </select>
          </label>
          <button type="submit" className="btn-add">
            {texts.save}
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("normal");

  const handleSettingsSave = (newTheme, newFontSize) => {
    setTheme(newTheme);
    setFontSize(newFontSize);
    setShowSettings(false);
  };

  return (
    <div className={`app ${theme}`} style={{ fontSize: fontSize === "normal" ? "16px" : fontSize === "large" ? "20px" : "12px" }}>
      <header>
        <h1>{language === "en" ? "My Application" : "Aplikasi Saya"}</h1>
        <button onClick={() => setShowSettings(true)}>
          {language === "en" ? "Settings" : "Pengaturan"}
        </button>
      </header>
      {showSettings && (
        <ModalSettings
          theme={theme}
          language={language}
          fontSize={fontSize}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
      <main>
        <p>{language === "en" ? "Welcome to the app!" : "Selamat datang di aplikasi!"}</p>
      </main>
    </div>
  );
}

export default ModalSettings;