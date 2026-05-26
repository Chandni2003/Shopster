import { useState, useEffect, useRef } from "react";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "Order Shipped! 🚚",
    message: "Your order #SH2025001 is on the way",
    time: "2 min ago",
    read: false,
    tracking: [
      { step: "Order Placed", done: true, time: "Today, 10:00 AM" },
      { step: "Processing", done: true, time: "Today, 10:30 AM" },
      { step: "Shipped", done: true, time: "Today, 12:00 PM" },
      { step: "Out for Delivery", done: false, time: "Expected Today" },
      { step: "Delivered", done: false, time: "Expected by 8 PM" },
    ],
  },
  {
    id: 2,
    type: "offer",
    title: "Flash Sale! ⚡",
    message: "50% OFF on Electronics — Today only!",
    time: "1 hr ago",
    read: false,
    tracking: null,
  },
  {
    id: 3,
    type: "wishlist",
    title: "Price Drop! 💰",
    message: "An item in your wishlist is now cheaper",
    time: "3 hr ago",
    read: true,
    tracking: null,
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered! ✅",
    message: "Your order #SH2025000 has been delivered",
    time: "Yesterday",
    read: true,
    tracking: [
      { step: "Order Placed", done: true, time: "Yesterday, 9:00 AM" },
      { step: "Processing", done: true, time: "Yesterday, 9:30 AM" },
      { step: "Shipped", done: true, time: "Yesterday, 11:00 AM" },
      { step: "Out for Delivery", done: true, time: "Yesterday, 4:00 PM" },
      { step: "Delivered", done: true, time: "Yesterday, 6:30 PM" },
    ],
  },
];

const TYPE_COLORS = {
  order: "#6366f1",
  offer: "#f59e0b",
  wishlist: "#ef4444",
};

const TYPE_ICONS = {
  order: "📦",
  offer: "🏷️",
  wishlist: "❤️",
};

export default function NotificationBell({ darkMode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [trackingId, setTrackingId] = useState(null);
  const ref = useRef();

  const unread = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const bg = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#111827";
  const sub = darkMode ? "#94a3b8" : "#6b7280";
  const bdr = darkMode ? "#334155" : "#e5e7eb";
  const hov = darkMode ? "#0f172a" : "#f9fafb";

  const trackingNotif = notifications.find((n) => n.id === trackingId);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 38, height: 38, borderRadius: 10,
          border: `1.5px solid ${bdr}`,
          background: open ? "#6366f1" : (darkMode ? "#1e293b" : "#f3f4f6"),
          cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", transition: "all 0.2s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open ? "#fff" : (darkMode ? "#f1f5f9" : "#374151")} strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white",
          }}>
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: "absolute", top: 46, right: 0,
          width: 360, maxHeight: 520,
          background: bg, borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          border: `1px solid ${bdr}`,
          zIndex: 500, overflow: "hidden",
          animation: "fadeUp 0.2s ease",
        }}>

          {/* Header */}
          <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: text }}>Notifications</div>
              {unread > 0 && <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{unread} unread</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {trackingId && (
                <button onClick={() => setTrackingId(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#6366f1", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>← Back</button>
              )}
              {!trackingId && unread > 0 && (
                <button onClick={markAllRead} style={{ border: "none", background: "none", cursor: "pointer", color: "#6366f1", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>Mark all read</button>
              )}
            </div>
          </div>

          {/* Order Tracking View */}
          {trackingId && trackingNotif?.tracking ? (
            <div style={{ padding: "16px 18px", overflowY: "auto", maxHeight: 420 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>{trackingNotif.title}</div>
              <div style={{ fontSize: 12, color: sub, marginBottom: 20 }}>Order #SH2025001</div>

              {/* Tracking Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {trackingNotif.tracking.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
                    {/* Line */}
                    {i < trackingNotif.tracking.length - 1 && (
                      <div style={{ position: "absolute", left: 11, top: 24, width: 2, height: "calc(100% + 4px)", background: step.done ? "#6366f1" : bdr, zIndex: 0 }} />
                    )}
                    {/* Dot */}
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: step.done ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : (darkMode ? "#334155" : "#e5e7eb"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 1, marginTop: 2,
                    }}>
                      {step.done ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: darkMode ? "#475569" : "#9ca3af" }} />
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
            </div>
          ) : (
            /* Notifications List */
            <div style={{ overflowY: "auto", maxHeight: 420 }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: sub }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: text }}>No notifications</div>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => { markRead(notif.id); if (notif.tracking) setTrackingId(notif.id); }}
                    style={{
                      padding: "14px 18px",
                      borderBottom: `1px solid ${bdr}`,
                      cursor: notif.tracking ? "pointer" : "default",
                      background: notif.read ? "transparent" : (darkMode ? "rgba(99,102,241,0.08)" : "#f5f3ff"),
                      transition: "background 0.2s",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = hov)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = notif.read ? "transparent" : (darkMode ? "rgba(99,102,241,0.08)" : "#f5f3ff"))}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: TYPE_COLORS[notif.type] + "20",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {TYPE_ICONS[notif.type]}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 13, fontWeight: notif.read ? 600 : 800, color: text, marginBottom: 2 }}>{notif.title}</div>
                        {!notif.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 4 }} />}
                      </div>
                      <div style={{ fontSize: 12, color: sub, lineHeight: 1.4 }}>{notif.message}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                        <div style={{ fontSize: 11, color: sub }}>{notif.time}</div>
                        {notif.tracking && (
                          <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700 }}>Track Order →</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}