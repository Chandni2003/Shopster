export default function Navbar({ search, onSearch, cartCount, onCartOpen }) {
  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e5e7eb", padding: "0 20px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 22, fontWeight: 900,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >
          Shopster
        </span>
      </div>

      {/* Search Bar */}
      <div
        className="hide-mobile"
        style={{ flex: 1, maxWidth: 460, margin: "0 20px", position: "relative" }}
      >
        <svg
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search products, categories..."
          style={{
            width: "100%", padding: "10px 14px 10px 36px",
            border: "1.5px solid #e5e7eb", borderRadius: 12,
            fontSize: 14, fontFamily: "inherit",
            background: "#f9fafb", transition: "border 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          className="hide-mobile"
          style={{
            fontSize: 13, fontWeight: 600, color: "#374151",
            padding: "8px 14px", background: "#f3f4f6",
            borderRadius: 10, cursor: "pointer",
          }}
        >
          Sign In
        </div>

        <button
          onClick={onCartOpen}
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none", borderRadius: 10, padding: "9px 16px",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)", fontFamily: "inherit",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          Cart
          {cartCount > 0 && (
            <span
              style={{
                background: "#ef4444", borderRadius: "50%",
                width: 18, height: 18, fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}