import React from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ContactAlphaFilter({ selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
      {alphabet.map(huruf => (
        <button
          key={huruf}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: selected === huruf ? "2px solid #1976d2" : "1px solid #bbb",
            background: selected === huruf ? "#1976d2" : "#fff",
            color: selected === huruf ? "#fff" : "#1976d2",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => onSelect(selected === huruf ? "" : huruf)}
        >
          {huruf}
        </button>
      ))}
      <button
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #bbb",
          background: "#eee",
          color: "#1976d2",
          marginLeft: 8,
          cursor: "pointer"
        }}
        onClick={() => onSelect("")}
      >
        Semua
      </button>
    </div>
  );
}