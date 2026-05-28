// src/components/AdminDashboard.jsx
// Fixed: 1) Math.max/min on empty array crash  2) products.length 0 division  3) animation name conflict

import { useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SALES_DATA  = [42000,65000,51000,78000,92000,85000,110000,98000,125000,140000,118000,162000];
const ORDERS_DATA = [120,185,142,210,256,238,298,267,342,389,325,445];

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, change, color, darkMode }) {
  const bg   = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub  = darkMode ? "#94a3b8" : "#64748b";
  const positive = typeof change === "number" ? change >= 0 : true;

  return (
    <div style={{
      background: bg, borderRadius: 14, padding: "18px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "20",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: positive ? "#10b981" : "#ef4444",
          background: positive ? "#d1fae5" : "#fee2e2",
          padding: "2px 7px", borderRadius: 20,
        }}>
          {positive ? "▲" : "▼"} {Math.abs(change)}%
        </span>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 900, color: text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Mini Line Chart (SVG) ─────────────────────────────────────────────────────
function MiniChart({ data, color, height = 60 }) {
  if (!data || data.length < 2) return null;
  const max   = Math.max(...data);
  const min   = Math.min(...data);
  const range = max - min || 1;
  const W = 280, H = height;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 12) - 6;
    return `${x},${y}`;
  });

  const linePoints = pts.join(" ");
  const areaPoints = `0,${H} ${linePoints} ${W},${H}`;
  const gradId = `grad-${color.replace("#","")}`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`}/>
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color, darkMode }) {
  const max    = Math.max(...data, 1);
  const textC  = darkMode ? "#64748b" : "#94a3b8";

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 130, padding: "10px 0 0" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg,${color},${color}88)`,
              transition: "height 0.5s ease", minHeight: 4,
            }}/>
          </div>
          <span style={{
            fontSize: 9, color: textC,
            transform: "rotate(-45deg)", transformOrigin: "top center",
            whiteSpace: "nowrap", display: "block", marginTop: 2,
          }}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Top Products ──────────────────────────────────────────────────────────────
function TopProducts({ products, darkMode }) {
  const bg   = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub  = darkMode ? "#94a3b8" : "#64748b";
  const bdr  = darkMode ? "#334155" : "#f1f5f9";

  const top = [...products].sort((a, b) => b.priceINR - a.priceINR).slice(0, 6);
  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  const medals = [
    "linear-gradient(135deg,#f59e0b,#fbbf24)",
    "linear-gradient(135deg,#94a3b8,#cbd5e1)",
    "linear-gradient(135deg,#f97316,#fb923c)",
  ];

  return (
    <div style={{ background: bg, borderRadius: 14, padding: "18px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${bdr}` }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: text, margin: "0 0 14px" }}>🏆 Top Products</h3>
      {top.map((p, i) => (
        <div key={p.id} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
          borderBottom: i < top.length - 1 ? `1px solid ${bdr}` : "none",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: i < 3 ? medals[i] : (darkMode ? "#334155" : "#f1f5f9"),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: i < 3 ? "#fff" : sub,
          }}>
            {i + 1}
          </div>
          <img src={p.image} alt={p.title} style={{
            width: 38, height: 38, objectFit: "contain", borderRadius: 8,
            background: darkMode ? "#0f172a" : "#f8fafc", flexShrink: 0,
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: text,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {p.title}
            </div>
            <div style={{ fontSize: 11, color: sub }}>{p.category}</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", flexShrink: 0 }}>
            {fmt(p.priceINR)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Category Stats ────────────────────────────────────────────────────────────
function CategoryStats({ products, darkMode }) {
  const bg   = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub  = darkMode ? "#94a3b8" : "#64748b";
  const bdr  = darkMode ? "#334155" : "#f1f5f9";

  const catCount = {};
  products.forEach((p) => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
  const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total  = products.length || 1;
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6"];

  return (
    <div style={{ background: bg, borderRadius: 14, padding: "18px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${bdr}` }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: text, margin: "0 0 14px" }}>
        📊 Category Distribution
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(([cat, count], i) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{cat}</span>
                <span style={{ fontSize: 11, color: sub }}>{count} ({pct}%)</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: darkMode ? "#334155" : "#f1f5f9" }}>
                <div style={{
                  width: `${pct}%`, height: "100%", borderRadius: 3,
                  background: colors[i], transition: "width 0.6s ease",
                }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────────────────────────────────
export default function AdminDashboard({ products = [], cart = [], wishlist = [], onClose, darkMode }) {
  const [activeTab, setActiveTab] = useState("overview");

  const bg      = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg  = darkMode ? "#1e293b" : "#fff";
  const text    = darkMode ? "#f1f5f9" : "#1e293b";
  const sub     = darkMode ? "#94a3b8" : "#64748b";
  const bdr     = darkMode ? "#334155" : "#e2e8f0";
  const fmt     = (n) => "₹" + n.toLocaleString("en-IN");

  // FIX 1: safe math — guard against empty products array
  const totalRevenue = products.reduce((s, p) => s + p.priceINR, 0);
  const avgPrice     = products.length > 0 ? Math.round(totalRevenue / products.length) : 0;
  const cartValue    = cart.reduce((s, i) => s + i.priceINR * i.qty, 0);

  // FIX 2: safe max/min — only run when products exist
  const highestPrice  = products.length > 0 ? Math.max(...products.map((p) => p.priceINR)) : 0;
  const lowestPrice   = products.length > 0 ? Math.min(...products.map((p) => p.priceINR)) : 0;
  const avgRating     = products.length > 0
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : "0.0";
  const uniqueCats    = [...new Set(products.map((p) => p.category))].length;

  const tabs = [
    { id: "overview",  label: "Overview",  icon: "📊" },
    { id: "products",  label: "Products",  icon: "📦" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
      {/* FIX 3: use unique animation name "dashPopIn" to avoid conflict with index.css "popIn" */}
      <style>{`
        @keyframes dashPopIn {
          0%   { transform: scale(0.92); opacity: 0; }
          70%  { transform: scale(1.02); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes dashFadeIn { from{opacity:0} to{opacity:1} }
      `}</style>

      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      }}/>

      <div style={{
        position: "absolute", inset: "12px",
        background: bg, borderRadius: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "dashPopIn 0.3s ease",
        maxWidth: 1200, margin: "auto",
      }}>

        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${bdr}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg,#4f46e5,#7c3aed)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              📊
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Admin Dashboard</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Shopster Analytics & Management</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            border: "none", background: "rgba(255,255,255,0.2)", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, padding: "10px 20px 0",
          borderBottom: `1px solid ${bdr}`, flexShrink: 0,
          background: cardBg, overflowX: "auto",
        }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none",
              background: activeTab === t.id ? bg : "transparent",
              color: activeTab === t.id ? "#6366f1" : sub,
              fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer", fontFamily: "inherit",
              borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                <StatCard icon="📦" label="Total Products"  value={products.length}   change={12}  color="#6366f1" darkMode={darkMode}/>
                <StatCard icon="🛒" label="Cart Items"      value={cart.reduce((s,i)=>s+i.qty,0)} change={8} color="#8b5cf6" darkMode={darkMode}/>
                <StatCard icon="❤️" label="Wishlisted"      value={wishlist.length}   change={24}  color="#ec4899" darkMode={darkMode}/>
                <StatCard icon="💰" label="Avg Price"       value={fmt(avgPrice)}     change={5}   color="#f59e0b" darkMode={darkMode}/>
                <StatCard icon="🛍️" label="Cart Value"      value={fmt(cartValue)}    change={cartValue > 0 ? 15 : -5} color="#10b981" darkMode={darkMode}/>
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>

                {/* Revenue Trend */}
                <div style={{ background: cardBg, borderRadius: 14, padding: "18px 20px",
                  border: `1px solid ${bdr}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: text, margin: 0 }}>Monthly Revenue</h3>
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>▲ 37%</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: text, marginBottom: 10 }}>
                    ₹1.62L <span style={{ fontSize: 11, color: sub, fontWeight: 500 }}>this month</span>
                  </div>
                  <MiniChart data={SALES_DATA} color="#6366f1" height={65}/>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {["Jan","Apr","Jul","Oct","Dec"].map((m) => (
                      <span key={m} style={{ fontSize: 9, color: sub }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Orders Bar */}
                <div style={{ background: cardBg, borderRadius: 14, padding: "18px 20px",
                  border: `1px solid ${bdr}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: text, margin: 0 }}>Monthly Orders</h3>
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>▲ 29%</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: text, marginBottom: 10 }}>
                    445 <span style={{ fontSize: 11, color: sub, fontWeight: 500 }}>this month</span>
                  </div>
                  <BarChart data={ORDERS_DATA.slice(-6)} labels={MONTHS.slice(-6)} color="#8b5cf6" darkMode={darkMode}/>
                </div>
              </div>

              {/* Bottom Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
                <TopProducts products={products} darkMode={darkMode}/>
                <CategoryStats products={products} darkMode={darkMode}/>
              </div>
            </div>
          )}

          {/* ── PRODUCTS TABLE ── */}
          {activeTab === "products" && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: text, margin: 0 }}>
                  All Products ({products.length})
                </h3>
              </div>
              <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`,
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr style={{ background: darkMode ? "#334155" : "#f8fafc" }}>
                        {["#","Product","Category","Price","Rating","Status"].map((h) => (
                          <th key={h} style={{ padding: "11px 14px", textAlign: "left",
                            fontSize: 10, fontWeight: 700, color: sub,
                            textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 20).map((p, i) => (
                        <tr key={p.id}
                          style={{ borderTop: `1px solid ${bdr}`, transition: "background 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#334155" : "#f8fafc"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "9px 14px", fontSize: 11, color: sub }}>{i + 1}</td>
                          <td style={{ padding: "9px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <img src={p.image} alt="" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 6, background: darkMode ? "#1e293b" : "#f8fafc" }}/>
                              <span style={{ fontSize: 12, fontWeight: 600, color: text, maxWidth: 180, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                {p.title}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "9px 14px" }}>
                            <span style={{ fontSize: 10, background: "#ede9fe", color: "#6366f1", padding: "2px 8px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: "#6366f1", whiteSpace: "nowrap" }}>
                            {fmt(p.priceINR)}
                          </td>
                          <td style={{ padding: "9px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <span style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{p.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td style={{ padding: "9px 14px" }}>
                            <span style={{ fontSize: 10, background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                              In Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Full Year Revenue */}
              <div style={{ background: cardBg, borderRadius: 14, padding: "18px 20px",
                border: `1px solid ${bdr}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: text, margin: "0 0 4px" }}>
                  Revenue Trend — Full Year
                </h3>
                <p style={{ fontSize: 12, color: sub, margin: "0 0 14px" }}>
                  Monthly revenue over 12 months
                </p>
                <MiniChart data={SALES_DATA} color="#6366f1" height={90}/>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {MONTHS.map((m) => (
                    <span key={m} style={{ fontSize: 9, color: sub }}>{m}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
                <CategoryStats products={products} darkMode={darkMode}/>

                {/* Quick Stats */}
                <div style={{ background: cardBg, borderRadius: 14, padding: "18px 20px",
                  border: `1px solid ${bdr}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: text, margin: "0 0 14px" }}>
                    📋 Quick Stats
                  </h3>
                  {[
                    { label: "Total Products",    value: products.length,  icon: "📦" },
                    { label: "Categories",         value: uniqueCats,       icon: "🗂️" },
                    { label: "Avg Rating",         value: avgRating + "★",  icon: "⭐" },
                    { label: "Highest Price",      value: fmt(highestPrice),icon: "💎" },
                    { label: "Most Affordable",    value: fmt(lowestPrice), icon: "🏷️" },
                    { label: "Total Cart Value",   value: fmt(cartValue),   icon: "🛒" },
                    { label: "Wishlist Items",     value: wishlist.length,  icon: "❤️" },
                  ].map((s) => (
                    <div key={s.label} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 0", borderBottom: `1px solid ${bdr}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15 }}>{s.icon}</span>
                        <span style={{ fontSize: 12, color: sub }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: text }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}