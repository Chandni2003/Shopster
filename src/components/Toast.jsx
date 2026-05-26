import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: "#111827",
        color: "#fff",
        borderRadius: 12,
        padding: "14px 22px",
        fontSize: 14,
        fontFamily: "'Outfit', sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: "slideUp 0.3s ease",
      }}
    >
      <span style={{ fontSize: 18 }}>🛒</span>
      {message}
    </div>
  );
}