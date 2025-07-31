import React from "react";

function Navbar({ onMenu }) {
  return (
    <nav className="navbar">
      <button className="menu-icon" onClick={onMenu} title="Menu">&#9776;</button>
      <div className="brand-logo">
        <img src={`${process.env.PUBLIC_URL}/img/logo-sorakontak.png`} alt="Logo" style={{ height: 65, margin: 2 }} />
      </div>
    </nav>
  );
}

export default Navbar;