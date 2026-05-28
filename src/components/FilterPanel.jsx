// src/components/FilterPanel.jsx
// Replace your existing FilterPanel.jsx with this file.
// Props received from App.jsx (already wired):
//   darkMode, priceRange, setPriceRange, minRating, setMinRating, maxPrice, onReset

export default function FilterPanel({
  darkMode,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  maxPrice,
  onReset,
}) {
  const card = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#111827";
  const sub  = darkMode ? "#94a3b8" : "#6b7280";
  const bdr  = darkMode ? "#334155" : "#e5e7eb";
  const inp  = darkMode ? "#0f172a" : "#f9fafb";

  const RATINGS = [
    { label: "All",  value: 0 },
    { label: "3★+",  value: 3 },
    { label: "3.5★+", value: 3.5 },
    { label: "4★+",  value: 4 },
    { label: "4.5★+", value: 4.5 },
  ];

  const formatINR = (v) =>
    "₹" + Number(v).toLocaleString("en-IN");

  return (
    <div style={{
      background: card,
      border: `1.5px solid ${bdr}`,
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 20,
      animation: "slideUp 0.25s ease",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "24px 32px",
    }}>

      {/* ── Price Range ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: sub, marginBottom: 12 }}>
          Price Range
        </div>

        {/* Min slider */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontSize: 12, color: sub, marginBottom: 4 }}>
            <span>Min</span>
            <span style={{ fontWeight: 700, color: "#6366f1" }}>
              {formatINR(priceRange[0])}
            </span>
          </div>
          <input
            type="range" min={0} max={maxPrice} step={100}
            value={priceRange[0]}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), priceRange[1] - 100);
              setPriceRange([v, priceRange[1]]);
            }}
            style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
          />
        </div>

        {/* Max slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontSize: 12, color: sub, marginBottom: 4 }}>
            <span>Max</span>
            <span style={{ fontWeight: 700, color: "#6366f1" }}>
              {formatINR(priceRange[1])}
            </span>
          </div>
          <input
            type="range" min={0} max={maxPrice} step={100}
            value={priceRange[1]}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), priceRange[0] + 100);
              setPriceRange([priceRange[0], v]);
            }}
            style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
          />
        </div>

        {/* Range labels */}
        <div style={{ display: "flex", justifyContent: "space-between",
          fontSize: 11, color: sub, marginTop: 4 }}>
          <span>₹0</span>
          <span>{formatINR(maxPrice)}</span>
        </div>
      </div>

      {/* ── Min Rating ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: sub, marginBottom: 12 }}>
          Minimum Rating
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {RATINGS.map(({ label, value }) => {
            const active = minRating === value;
            return (
              <button
                key={value}
                onClick={() => setMinRating(value)}
                style={{
                  padding: "5px 12px", borderRadius: 20,
                  border: `1.5px solid ${active ? "#6366f1" : bdr}`,
                  background: active ? "#6366f1" : inp,
                  color: active ? "#fff" : text,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.18s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Visual star bar */}
        <div style={{ marginTop: 14 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = star === 5 ? 30 : star === 4 ? 40 : star === 3 ? 18 : star === 2 ? 8 : 4;
            return (
              <div key={star} style={{ display: "flex", alignItems: "center",
                gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: sub, width: 14, textAlign: "right" }}>
                  {star}★
                </span>
                <div style={{ flex: 1, height: 6, borderRadius: 3,
                  background: darkMode ? "#0f172a" : "#f1f5f9", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 3,
                    background: star >= 4 ? "#10b981" : star === 3 ? "#f59e0b" : "#ef4444",
                  }} />
                </div>
                <span style={{ fontSize: 10, color: sub, width: 28 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Filters Summary ── */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: sub, marginBottom: 12 }}>
            Active Filters
          </div>

          {priceRange[0] === 0 && priceRange[1] === maxPrice && minRating === 0 ? (
            <div style={{ fontSize: 13, color: sub, fontStyle: "italic" }}>
              No filters applied
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#ede9fe", borderRadius: 20,
                  padding: "4px 10px", width: "fit-content" }}>
                  <span style={{ fontSize: 12, color: "#4f46e5", fontWeight: 600 }}>
                    💰 {formatINR(priceRange[0])} – {formatINR(priceRange[1])}
                  </span>
                  <span
                    onClick={() => setPriceRange([0, maxPrice])}
                    style={{ fontSize: 11, color: "#7c3aed", cursor: "pointer", fontWeight: 700 }}>
                    ✕
                  </span>
                </div>
              )}
              {minRating > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#fef3c7", borderRadius: 20,
                  padding: "4px 10px", width: "fit-content" }}>
                  <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>
                    ⭐ {minRating}+ Stars
                  </span>
                  <span
                    onClick={() => setMinRating(0)}
                    style={{ fontSize: 11, color: "#b45309", cursor: "pointer", fontWeight: 700 }}>
                    ✕
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          style={{
            marginTop: 20, padding: "9px 0", width: "100%",
            borderRadius: 10, border: `1.5px solid ${bdr}`,
            background: "transparent", color: sub,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#ef4444";
            e.target.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = bdr;
            e.target.style.color = sub;
          }}
        >
          🗑 Reset All Filters
        </button>
      </div>
    </div>
  );
}