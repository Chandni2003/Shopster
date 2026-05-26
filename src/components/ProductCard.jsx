import { useState } from "react";

function StarsRow({ rating, reviews }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 2 }}>
        {rating?.toFixed(1)} ({reviews})
      </span>
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, onWishlist, wishlisted }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.13)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        cursor: "pointer",
        border: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Discount Badge */}
      <div
        style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          background: "#ef4444", color: "#fff", borderRadius: 6,
          padding: "3px 8px", fontSize: 11, fontWeight: 700,
        }}
      >
        {product.badge}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          background: wishlisted ? "#fef2f2" : "rgba(255,255,255,0.92)",
          border: "none", borderRadius: "50%", width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill={wishlisted ? "#ef4444" : "none"}
          stroke={wishlisted ? "#ef4444" : "#9ca3af"}
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Product Image */}
      <div
        style={{
          height: 220, background: "#f9fafb",
          display: "flex", alignItems: "center",
          justifyContent: "center", padding: 16, overflow: "hidden",
        }}
      >
        {!imgLoaded && (
          <div
            style={{
              width: "100%", height: "100%",
              background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s infinite",
              borderRadius: 8,
            }}
          />
        )}
        <img
          src={product.image}
          alt={product.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            maxHeight: "100%", maxWidth: "100%", objectFit: "contain",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            display: imgLoaded ? "block" : "none",
          }}
        />
      </div>

      {/* Product Info */}
      <div
        style={{
          padding: "14px 16px 18px", flex: 1,
          display: "flex", flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 11, color: "#6366f1", fontWeight: 600,
            marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8,
          }}
        >
          {product.category}
        </div>

        <div
          style={{
            fontSize: 13, fontWeight: 600, color: "#111827",
            marginBottom: 8, lineHeight: 1.45, flex: 1,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}
        >
          {product.title}
        </div>

        <StarsRow rating={product.rating} reviews={product.reviews} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
            {fmt(product.priceINR)}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", textDecoration: "line-through" }}>
            {fmt(product.originalINR)}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#10b981", marginTop: 3, fontWeight: 500 }}>
          ✓ Free Delivery
        </div>

        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%", marginTop: 12, padding: "11px 0",
            background: hovered ? "#4f46e5" : "#6366f1",
            color: "#fff", border: "none", borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            transition: "background 0.2s", fontFamily: "inherit",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}