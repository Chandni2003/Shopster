import { useState } from "react";

const SAMPLE_ORDERS = [
  {
    id: "ORD-2025-001",
    date: "28 May 2025",
    status: "delivered",
    items: [
      { title: "iPhone 15 Pro Max", image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro%20Max/thumbnail.webp", qty: 1, price: 107417 },
      { title: "Apple AirPods Pro", image: "https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Pro/thumbnail.webp", qty: 2, price: 20667 },
    ],
    total: 148751,
    tracking: [
      { step: "Order Placed", done: true, time: "26 May, 10:00 AM" },
      { step: "Confirmed", done: true, time: "26 May, 10:30 AM" },
      { step: "Shipped", done: true, time: "27 May, 9:00 AM" },
      { step: "Out for Delivery", done: true, time: "28 May, 8:00 AM" },
      { step: "Delivered", done: true, time: "28 May, 12:30 PM" },
    ],
  },
  {
    id: "ORD-2025-002",
    date: "24 May 2025",
    status: "shipped",
    items: [
      { title: "Samsung 4K Smart TV 55\"", image: "https://cdn.dummyjson.com/products/images/tvs/Samsung%20Curved%2054%22%20QLED%20TV/thumbnail.webp", qty: 1, price: 41583 },
    ],
    total: 41583,
    tracking: [
      { step: "Order Placed", done: true, time: "24 May, 2:00 PM" },
      { step: "Confirmed", done: true, time: "24 May, 2:30 PM" },
      { step: "Shipped", done: true, time: "25 May, 10:00 AM" },
      { step: "Out for Delivery", done: false, time: "Expected Today" },
      { step: "Delivered", done: false, time: "Expected by 8 PM" },
    ],
  },
  {
    id: "ORD-2025-003",
    date: "20 May 2025",
    status: "processing",
    items: [
      { title: "Casual Summer T-Shirt Pack", image: "https://cdn.dummyjson.com/products/images/tops/Black%20Hoode/thumbnail.webp", qty: 3, price: 2490 },
      { title: "Running Shoes Pro", image: "https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/thumbnail.webp", qty: 1, price: 8300 },
    ],
    total: 15770,
    tracking: [
      { step: "Order Placed", done: true, time: "20 May, 5:00 PM" },
      { step: "Confirmed", done: true, time: "20 May, 5:30 PM" },
      { step: "Shipped", done: false, time: "Expected Tomorrow" },
      { step: "Out for Delivery", done: false, time: "—" },
      { step: "Delivered", done: false, time: "—" },
    ],
  },
];

const STATUS_CONFIG = {
  delivered:  { label: "Delivered",   color: "#10b981", bg: "#d1fae5", icon: "✓" },
  shipped:    { label: "Shipped",     color: "#6366f1", bg: "#ede9fe", icon: "🚚" },
  processing: { label: "Processing",  color: "#f59e0b", bg: "#fef9c3", icon: "⏳" },
  cancelled:  { label: "Cancelled",   color: "#ef4444", bg: "#fee2e2", icon: "✕" },
};

function TrackingTimeline({ steps, darkMode }) {
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const bdr = darkMode ? "#334155" : "#e2e8f0";

  return (
    <div style={{ padding: "16px 0" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
          {/* Vertical line */}
          {i < steps.length - 1 && (
            <div style={{
              position: "absolute", left: 11, top: 26, width: 2,
              height: "calc(100% + 2px)",
              background: step.done ? "linear-gradient(180deg,#6366f1,#8b5cf6)" : bdr,
              zIndex: 0,
            }}/>
          )}
          {/* Dot */}
          <div style={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0, zIndex: 1, marginTop: 2,
            background: step.done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : (darkMode ? "#334155" : "#f1f5f9"),
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: step.done ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
          }}>
            {step.done ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: darkMode ? "#475569" : "#cbd5e1" }}/>
            )}
          </div>
          {/* Text */}
          <div style={{ paddingBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: step.done ? 700 : 500, color: step.done ? text : sub }}>{step.step}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, darkMode, onExpand, expanded }) {
  const bg = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const bdr = darkMode ? "#334155" : "#f1f5f9";
  const fmt = n => "₹" + n.toLocaleString("en-IN");
  const status = STATUS_CONFIG[order.status];

  return (
    <div style={{
      background: bg, borderRadius: 16, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: `1px solid ${bdr}`,
      marginBottom: 12,
    }}>
      {/* Order Header */}
      <div style={{
        padding: "16px 20px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10,
        borderBottom: expanded ? `1px solid ${bdr}` : "none",
        cursor: "pointer",
      }} onClick={onExpand}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: status.bg, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18,
          }}>{status.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text }}>{order.id}</div>
            <div style={{ fontSize: 12, color: sub }}>{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: status.color, background: status.bg, padding: "4px 10px", borderRadius: 20 }}>
            {status.label}
          </span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#6366f1" }}>{fmt(order.total)}</span>
          <span style={{ color: sub, fontSize: 18, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>⌄</span>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: "16px 20px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {/* Items */}
            <div style={{ flex: "1 1 240px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Order Items</div>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: darkMode ? "#0f172a" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={item.image} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={e => e.target.style.display="none"}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: text, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: sub }}>Qty: {item.qty} · {fmt(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking */}
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Tracking</div>
              <TrackingTimeline steps={order.tracking} darkMode={darkMode}/>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 12, borderTop: `1px solid ${bdr}` }}>
            {order.status === "delivered" && (
              <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                🔄 Reorder
              </button>
            )}
            <button style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${bdr}`, background: "transparent", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              📄 Invoice
            </button>
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ✕ Cancel Order
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

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const bdr = darkMode ? "#334155" : "#e2e8f0";

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "processing", label: "Active" },
    { id: "delivered", label: "Delivered" },
  ];

  const filtered = activeTab === "all"
    ? SAMPLE_ORDERS
    : SAMPLE_ORDERS.filter(o => o.status === activeTab || (activeTab === "processing" && o.status === "shipped"));

  const currentOrder = SAMPLE_ORDERS.find(o => o.status === "shipped");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}/>
      <div style={{
        position: "absolute", inset: "16px",
        background: bg, borderRadius: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", animation: "popIn 0.3s ease",
        maxWidth: 760, margin: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${bdr}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg,#4f46e5,#7c3aed)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>My Orders</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Track & manage your orders</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.2)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Current Order Banner */}
        {currentOrder && (
          <div style={{
            margin: "16px 24px 0",
            background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
            borderRadius: 12, padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "1px solid #c4b5fd", flexShrink: 0, flexWrap: "wrap", gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🚚</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5" }}>Order on the way!</div>
                <div style={{ fontSize: 12, color: "#7c3aed" }}>{currentOrder.id} · Out for delivery today</div>
              </div>
            </div>
            <button
              onClick={() => { setExpandedId(currentOrder.id); setActiveTab("all"); }}
              style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >Track Now →</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${bdr}`, flexShrink: 0, background: cardBg }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none",
              background: activeTab === t.id ? bg : "transparent",
              color: activeTab === t.id ? "#6366f1" : sub,
              fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer",
              borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Orders List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: text }}>No orders found</div>
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