export default function WishlistDrawer({ wishlistItems, onClose, onRemove, onAddToCart }) {
  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      />

      {/* Drawer */}
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
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>❤️ My Wishlist</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>❤️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Wishlist is empty</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Click heart on any product to save!</div>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #f9fafb" }}>
                {/* Image */}
                <div style={{ width: 70, height: 70, background: "#f9fafb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={item.image} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#6366f1" }}>{fmt(item.priceINR)}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>{fmt(item.originalINR)}</div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => onAddToCart(item)}
                      style={{ flex: 1, padding: "7px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      style={{ padding: "7px 10px", border: "1px solid #fecaca", borderRadius: 8, background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div style={{ padding: "18px 24px", borderTop: "1px solid #f3f4f6" }}>
            <button
              onClick={() => { wishlistItems.forEach(item => onAddToCart(item)); onClose(); }}
              style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
            >
              Add All to Cart 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );
}