export default function CartDrawer({ cart, onClose, onRemove, onQtyChange, onCheckout }) {
  const fmt = (n) => "₹" + n.toLocaleString("en-IN");
  const total = cart.reduce((s, i) => s + i.priceINR * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }} />

      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: 400, maxWidth: "100vw",
        background: "#fff", display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        animation: "slideInRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Your Cart</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{count} item{count !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🛒</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Cart is empty</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Add some products!</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #f9fafb" }}>
                <div style={{ width: 64, height: 64, background: "#f9fafb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={item.image} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#6366f1" }}>{fmt(item.priceINR * item.qty)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <button onClick={() => onQtyChange(item.id, -1)} style={{ width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onQtyChange(item.id, 1)} style={{ width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>+</button>
                    <button onClick={() => onRemove(item.id)} style={{ marginLeft: "auto", border: "none", background: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "18px 24px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#6b7280", fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#10b981", fontSize: 13 }}>Delivery</span>
              <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>FREE</span>
            </div>
            <button
              onClick={onCheckout}
              style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
            >
              Checkout — {fmt(total)}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "11px 0", background: "none", color: "#6b7280", border: "none", cursor: "pointer", marginTop: 6, fontSize: 13, fontFamily: "inherit" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}