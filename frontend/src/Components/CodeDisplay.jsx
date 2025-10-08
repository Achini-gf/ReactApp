import React, { useState } from "react";

export default function CodeDisplay({ title, code }) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <button
        onClick={() => setShow(!show)}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          color: "#4f46e5",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: "0.9rem" }}>{show ? "Hide" : "Show"}</span>
      </button>

      {show && (
        <div
          style={{
            marginTop: "0.75rem",
            background: "#f3f4f6",
            padding: "0.75rem",
            borderRadius: "6px",
            fontFamily: "monospace",
            wordBreak: "break-all",
          }}
        >
          {code}
        </div>
      )}
    </div>
  );
}
