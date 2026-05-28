import { useState } from "react";

function Stars({ rating, reviews }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24"
            fill={i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0"}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>({reviews})</span>
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, onWishlist, wishlisted }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const fmt = n => "₹" + n.toLocaleString("en-IN");

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <div className="product-card" style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
      border: "1px solid #f1f5f9",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Badge */}
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 2,
        background: "linear-gradient(135deg,#ef4444,#f97316)",
        color: "#fff", borderRadius: 6,
        padding: "3px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
      }}>{product.badge}</div>

      {/* Wishlist */}
      <button
        onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 2,
          background: wishlisted ? "#fef2f2" : "rgba(255,255,255,0.95)",
          border: "none", borderRadius: "50%",
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.2s",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24"
          fill={wishlisted ? "#ef4444" : "none"}
          stroke={wishlisted ? "#ef4444" : "#94a3b8"}
          strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Image */}
      <div style={{
        height: 200, background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, overflow: "hidden",
      }}>
        {!imgLoaded && (
          <div style={{
            width: "100%", height: "100%", borderRadius: 8,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}/>
        )}
        <img
          src={product.image} alt={product.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            maxHeight: "100%", maxWidth: "100%",
            objectFit: "contain",
            display: imgLoaded ? "block" : "none",
            transition: "transform 0.4s ease",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          fontSize: 10, color: "#6366f1", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 0.8,
        }}>{product.category}</div>

        <div style={{
          fontSize: 13, fontWeight: 600, color: "#1e293b",
          lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          flex: 1,
        }}>{product.title}</div>

        <Stars rating={product.rating} reviews={product.reviews} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>{fmt(product.priceINR)}</span>
          <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>{fmt(product.originalINR)}</span>
        </div>

        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 500 }}>✓ Free Delivery</div>

        <button
          onClick={handleAdd}
          style={{
            marginTop: 6, padding: "9px 0",
            background: adding
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff", border: "none", borderRadius: 10,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.25s",
            boxShadow: adding
              ? "0 4px 12px rgba(16,185,129,0.3)"
              : "0 4px 12px rgba(99,102,241,0.25)",
          }}
        >
          {adding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}