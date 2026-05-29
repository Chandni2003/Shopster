import { useState } from "react";

const SAMPLE_ORDERS = [
  {
    id: "ORD-2025-001",
    date: "28 May 2025",
    status: "delivered",
    items: [
      { title: "iPhone 15 Pro Max", category: "Smartphones", qty: 1, price: 107417 },
      { title: "Apple AirPods Pro", category: "Accessories", qty: 2, price: 20667 },
    ],
    total: 148751,
    tracking: [
      { step: "Order Placed",     done: true,  time: "26 May, 10:00 AM" },
      { step: "Confirmed",        done: true,  time: "26 May, 10:30 AM" },
      { step: "Shipped",          done: true,  time: "27 May, 9:00 AM"  },
      { step: "Out for Delivery", done: true,  time: "28 May, 8:00 AM"  },
      { step: "Delivered",        done: true,  time: "28 May, 12:30 PM" },
    ],
  },
  {
    id: "ORD-2025-002",
    date: "24 May 2025",
    status: "shipped",
    items: [
      { title: "Samsung 4K Smart TV 55\"", category: "Electronics", qty: 1, price: 41583 },
    ],
    total: 41583,
    tracking: [
      { step: "Order Placed",     done: true,  time: "24 May, 2:00 PM"  },
      { step: "Confirmed",        done: true,  time: "24 May, 2:30 PM"  },
      { step: "Shipped",          done: true,  time: "25 May, 10:00 AM" },
      { step: "Out for Delivery", done: false, time: "Expected Today"    },
      { step: "Delivered",        done: false, time: "Expected by 8 PM"  },
    ],
  },
  {
    id: "ORD-2025-003",
    date: "20 May 2025",
    status: "processing",
    items: [
      { title: "Casual Summer T-Shirt Pack", category: "Men's Fashion", qty: 3, price: 2490 },
      { title: "Running Shoes Pro",          category: "Footwear",      qty: 1, price: 8300 },
    ],
    total: 15770,
    tracking: [
      { step: "Order Placed",     done: true,  time: "20 May, 5:00 PM"    },
      { step: "Confirmed",        done: true,  time: "20 May, 5:30 PM"    },
      { step: "Shipped",          done: false, time: "Expected Tomorrow"   },
      { step: "Out for Delivery", done: false, time: "—"                   },
      { step: "Delivered",        done: false, time: "—"                   },
    ],
  },
];

const STATUS_CONFIG = {
  delivered:  { label: "Delivered",  color: "#10b981", bg: "#d1fae5" },
  shipped:    { label: "Shipped",    color: "#6366f1", bg: "#ede9fe" },
  processing: { label: "Processing", color: "#f59e0b", bg: "#fef9c3" },
  cancelled:  { label: "Cancelled",  color: "#ef4444", bg: "#fee2e2" },
};

// Category → SVG icon
function CategoryIcon({ category, size = 20 }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "#6366f1", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const c = category?.toLowerCase() || "";
  if (c.includes("phone") || c.includes("mobile"))
    return <svg {...s}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2"/></svg>;
  if (c.includes("laptop") || c.includes("computer"))
    return <svg {...s}><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M1 21h22"/></svg>;
  if (c.includes("tv") || c.includes("television"))
    return <svg {...s}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
  if (c.includes("fashion") || c.includes("shirt") || c.includes("cloth"))
    return <svg {...s}><path d="M3 3l4 2 5-3 5 3 4-2v4l-3 2v10H6V9L3 7V3z"/></svg>;
  if (c.includes("shoe") || c.includes("foot"))
    return <svg {...s}><path d="M2 17l4-10h12l4 10H2z"/><path d="M6 17l1-5h8l1 5"/></svg>;
  if (c.includes("access") || c.includes("headphone") || c.includes("airpod"))
    return <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10M2 12a10 10 0 0 1 10-10"/><path d="M4 12h2M18 12h2"/></svg>;
  // default box
  return <svg {...s}><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><polyline points="12 22 12 12"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/></svg>;
}

// Status SVG icon
function StatusIcon({ status, size = 18 }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (status === "delivered")
    return <svg {...s} stroke="#10b981"><polyline points="20 6 9 17 4 12"/></svg>;
  if (status === "shipped")
    return <svg {...s} stroke="#6366f1"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
  if (status === "processing")
    return <svg {...s} stroke="#f59e0b"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  return <svg {...s} stroke="#ef4444"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}

function TrackingTimeline({ steps, darkMode }) {
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub  = darkMode ? "#94a3b8" : "#64748b";
  const bdr  = darkMode ? "#334155" : "#e2e8f0";

  return (
    <div style={{ padding: "8px 0" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
          {i < steps.length - 1 && (
            <div style={{
              position: "absolute", left: 11, top: 26, width: 2,
              height: "calc(100% + 2px)",
              background: step.done ? "linear-gradient(180deg,#6366f1,#8b5cf6)" : bdr,
              zIndex: 0,
            }}/>
          )}
          <div style={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0, zIndex: 1, marginTop: 2,
            background: step.done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : (darkMode ? "#334155" : "#f1f5f9"),
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: step.done ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
          }}>
            {step.done
              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <div style={{ width: 8, height: 8, borderRadius: "50%", background: darkMode ? "#475569" : "#cbd5e1" }}/>
            }
          </div>
          <div style={{ paddingBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: step.done ? 700 : 500, color: step.done ? text : sub }}>{step.step}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, darkMode, expanded, onExpand }) {
  const bg   = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub  = darkMode ? "#94a3b8" : "#64748b";
  const bdr  = darkMode ? "#334155" : "#f1f5f9";
  const fmt  = n => "₹" + n.toLocaleString("en-IN");
  const st   = STATUS_CONFIG[order.status];

  return (
    <div style={{
      background: bg, borderRadius: 14, overflow: "hidden",
      boxShadow: expanded ? "0 4px 24px rgba(99,102,241,0.12)" : "0 2px 8px rgba(0,0,0,0.05)",
      border: `1px solid ${expanded ? "#6366f1" : bdr}`,
      marginBottom: 12, transition: "all 0.2s",
    }}>
      {/* Header */}
      <div
        onClick={onExpand}
        style={{
          padding: "14px 18px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10, cursor: "pointer",
          borderBottom: expanded ? `1px solid ${bdr}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: st.bg, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <StatusIcon status={order.status} size={20}/>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text }}>{order.id}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: 20 }}>{st.label}</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#6366f1" }}>{fmt(order.total)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="2"
            style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "16px 18px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {/* Items */}
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>Order Items</div>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
                  {/* SVG icon instead of broken image */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 10,
                    background: darkMode ? "#0f172a" : "#f8fafc",
                    border: `1px solid ${bdr}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <CategoryIcon category={item.category} size={22}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>Qty: {item.qty} · {fmt(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking */}
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Tracking</div>
              <TrackingTimeline steps={order.tracking} darkMode={darkMode}/>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 14, borderTop: `1px solid ${bdr}`, marginTop: 4 }}>
            {order.status === "delivered" && (
              <button style={{
                padding: "8px 16px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.08-1"/></svg>
                Reorder
              </button>
            )}
            <button style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1.5px solid ${bdr}`, background: "transparent",
              color: text, fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Invoice
            </button>
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button style={{
                padding: "8px 16px", borderRadius: 8,
                border: "1.5px solid #ef4444", background: "transparent",
                color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory({ onClose, darkMode }) {
  const [expandedId, setExpandedId] = useState("ORD-2025-002");
  const [activeTab, setActiveTab] = useState("all");

  const bg      = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg  = darkMode ? "#1e293b" : "#fff";
  const text    = darkMode ? "#f1f5f9" : "#1e293b";
  const sub     = darkMode ? "#94a3b8" : "#64748b";
  const bdr     = darkMode ? "#334155" : "#e2e8f0";

  const tabs = [
    { id: "all",        label: "All Orders" },
    { id: "processing", label: "Active"     },
    { id: "delivered",  label: "Delivered"  },
  ];

  const filtered = activeTab === "all"
    ? SAMPLE_ORDERS
    : SAMPLE_ORDERS.filter(o =>
        o.status === activeTab ||
        (activeTab === "processing" && o.status === "shipped")
      );

  const currentOrder = SAMPLE_ORDERS.find(o => o.status === "shipped");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}/>
      <div style={{
        position: "absolute", inset: "12px",
        background: bg, borderRadius: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", animation: "popIn 0.3s ease",
        maxWidth: 760, margin: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${bdr}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg,#4f46e5,#7c3aed)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><polyline points="12 22 12 12"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>My Orders</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Track & manage your orders</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.2)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Active Order Banner */}
        {currentOrder && (
          <div style={{
            margin: "14px 20px 0",
            background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "1px solid #c4b5fd", flexShrink: 0, flexWrap: "wrap", gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#6366f120", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5" }}>Order on the way!</div>
                <div style={{ fontSize: 12, color: "#7c3aed" }}>{currentOrder.id} · Out for delivery today</div>
              </div>
            </div>
            <button
              onClick={() => { setExpandedId(currentOrder.id); setActiveTab("all"); }}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >Track Now →</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "12px 20px 0", borderBottom: `1px solid ${bdr}`, flexShrink: 0, background: cardBg }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none",
              background: activeTab === t.id ? bg : "transparent",
              color: activeTab === t.id ? "#6366f1" : sub,
              fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer", fontFamily: "inherit",
              borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Orders */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: darkMode ? "#1e293b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="1.5"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: text }}>No orders yet</div>
              <div style={{ fontSize: 13, color: sub, marginTop: 4 }}>Your orders will appear here</div>
            </div>
          ) : filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              darkMode={darkMode}
              expanded={expandedId === order.id}
              onExpand={() => setExpandedId(expandedId === order.id ? null : order.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}