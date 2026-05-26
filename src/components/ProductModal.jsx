import { useState } from "react";

export default function ProductModal({ product, onClose, onAddToCart, wishlisted, onWishlist }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
      <style>{`
        @keyframes modalSlide { from{opacity:0;transform:translate(-50%,-44%)} to{opacity:1;transform:translate(-50%,-50%)} }
      `}</style>

      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "#fff", borderRadius: 20,
        width: "95%", maxWidth: 720,
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        animation: "modalSlide 0.3s ease",
        maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, zIndex: 10, border: "none", background: "rgba(255,255,255,0.9)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Image */}
          <div style={{ flex: "1 1 280px", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, minHeight: 300, borderRadius: "20px 0 0 20px" }}>
            <img src={product.image} alt={product.title} style={{ maxWidth: "100%", maxHeight: 260, objectFit: "contain" }} />
          </div>

          {/* Info */}
          <div style={{ flex: "1 1 300px", padding: "36px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</div>

            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.4 }}>{product.title}</div>

            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? "#f59e0b" : "#e5e7eb"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>{product.rating?.toFixed(1)} · {product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>{fmt(product.priceINR)}</span>
              <span style={{ fontSize: 16, color: "#9ca3af", textDecoration: "line-through" }}>{fmt(product.originalINR)}</span>
              <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700 }}>{product.badge}</span>
            </div>

            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✓ Free Delivery &nbsp;·&nbsp; ✓ Easy Returns</div>

            {/* Description */}
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
              {product.description}
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Qty:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", borderRadius: 10, padding: "4px 8px", border: "1px solid #e5e7eb" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, padding: "0 4px" }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, padding: "0 4px" }}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1, padding: "13px 0",
                  background: added ? "#10b981" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: "background 0.3s",
                }}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button
                onClick={() => onWishlist(product.id)}
                style={{
                  width: 48, height: 48, border: "1.5px solid #e5e7eb",
                  borderRadius: 12, background: wishlisted ? "#fef2f2" : "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "#ef4444" : "none"} stroke={wishlisted ? "#ef4444" : "#9ca3af"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}