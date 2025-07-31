import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("landing-no-scroll");
    return () => {
      document.body.classList.remove("landing-no-scroll");
    };
  }, []);

  return (
    <div className="landing-gradient-bg">
      <div className="landing-bg-image" />
      <header className="landing-header">
        <div className="menu-logo">
          <img
            src={`${process.env.PUBLIC_URL}/img/logo-sorakontak.png`}
            alt="SoraContact Logo"
            className="logo"
          />
        </div>
      </header>
      <main className="landing-main left-align">
        <h1 className="landing-title big-title">SoraContact</h1>
        <p className="landing-desc big-desc">
          SoraContact adalah aplikasi daftar kontak berbasis cloud yang dirancang
          untuk memudahkan Anda mengelola informasi penting dengan cepat, aman, dan efisien.
        </p>
        <button className="btn-mulai big-btn" onClick={() => navigate("/contacts")}>
          Mulai Sekarang
        </button>
      </main>
    </div>
  );
}

export default Home;