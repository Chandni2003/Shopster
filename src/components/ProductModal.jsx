import { useState } from "react";

const NAMES = ["Aarav Sharma","Priya Patel","Rohit Verma","Sneha Iyer","Karan Mehta","Divya Nair","Arjun Singh","Pooja Gupta","Vikram Joshi","Ananya Das","Rahul Yadav","Simran Kaur","Nikhil Reddy","Meera Pillai","Akash Tiwari"];
const COMMENTS = ["Absolutely love this! Exceeded all my expectations.","Great quality for the price. Highly recommend!","Fast delivery, well packaged. Exactly as shown.","Good value for money. Works perfectly.","Amazing! Been using it for weeks, still perfect.","Very happy with my purchase. Excellent quality.","Solid build, looks premium. Very satisfied.","Does exactly what it's supposed to. Decent.","Not bad but expected slightly higher quality.","Way better than similar products I've tried!","Packaging was perfect, product as described.","Good product but delivery took a bit longer.","Excellent quality, very durable. Highly recommend.","Perfect gift! Everyone loved it.","Works great after a month of regular use."];

function generateReviews(product) {
  const count = Math.min(8, Math.max(4, product.id % 8 + 3));
  return Array.from({ length: count }, (_, i) => {
    const seed = (product.id * 7 + i * 13) % NAMES.length;
    const stars = Math.max(3, Math.min(5, 5 - ((product.id + i * 3) % 3)));
    const daysAgo = (product.id * 3 + i * 11) % 120 + 1;
    return {
      id: i, name: NAMES[seed], stars,
      comment: COMMENTS[(product.id + i * 5) % COMMENTS.length],
      date: daysAgo <= 7 ? `${daysAgo}d ago` : daysAgo <= 30 ? `${Math.ceil(daysAgo/7)}w ago` : `${Math.ceil(daysAgo/30)}mo ago`,
      verified: i % 3 !== 2,
      helpful: Math.floor((product.id + i * 7) % 40),
    };
  });
}

function StarRow({ value, size = 13, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={(interactive ? hover || value : value) >= s ? "#f59e0b" : "#e2e8f0"}
          stroke={(interactive ? hover || value : value) >= s ? "#f59e0b" : "#cbd5e1"}
          strokeWidth="1.5"
          style={{ cursor: interactive ? "pointer" : "default", transition: "all 0.1s" }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange && onChange(s)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ star, pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "#64748b", width: 20, textAlign: "right", flexShrink: 0 }}>{star}★</span>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 3,
          background: star >= 4 ? "#10b981" : star === 3 ? "#f59e0b" : "#ef4444",
          transition: "width 0.6s ease",
        }}/>
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8", width: 28, flexShrink: 0 }}>{pct}%</span>
    </div>
  );
}

function ReviewsSection({ product, darkMode }) {
  const [reviews] = useState(() => generateReviews(product));
  const [userReviews, setUserReviews] = useState([]);
  const [helpfulMap, setHelpfulMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", stars: 5, comment: "" });
  const [filterStar, setFilterStar] = useState(0);
  const [sortBy, setSortBy] = useState("recent");

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const bdr = darkMode ? "#334155" : "#e2e8f0";

  const allReviews = [...userReviews, ...reviews];
  const displayed = allReviews
    .filter(r => filterStar === 0 || r.stars === filterStar)
    .sort((a,b) => sortBy === "helpful" ? b.helpful - a.helpful : sortBy === "highest" ? b.stars - a.stars : sortBy === "lowest" ? a.stars - b.stars : 0);

  const submitReview = () => {
    if (!form.name.trim() || !form.comment.trim()) return;
    setUserReviews(prev => [{ id: Date.now(), ...form, date: "Just now", verified: false, helpful: 0, isUser: true }, ...prev]);
    setForm({ name: "", stars: 5, comment: "" });
    setShowForm(false);
  };

  return (
    <div style={{ padding: "24px 28px", borderTop: `1px solid ${bdr}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: text, margin: 0 }}>Customer Reviews</h3>
          <p style={{ fontSize: 12, color: sub, margin: "2px 0 0" }}>{product.reviews} verified reviews</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: showForm ? "#fee2e2" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: showForm ? "#ef4444" : "#fff",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}
        >{showForm ? "✕ Cancel" : "✍ Write Review"}</button>
      </div>

      {/* Rating Overview */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr", gap: 20,
        background: bg, borderRadius: 12, padding: "16px 20px",
        marginBottom: 20, border: `1px solid ${bdr}`,
      }}>
        <div style={{ textAlign: "center", paddingRight: 20, borderRight: `1px solid ${bdr}` }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: text, lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
          <StarRow value={Math.round(product.rating)} size={14} />
          <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>out of 5</div>
        </div>
        <div style={{ alignSelf: "center" }}>
          {[{star:5,pct:38},{star:4,pct:32},{star:3,pct:16},{star:2,pct:8},{star:1,pct:6}].map(d => (
            <RatingBar key={d.star} {...d} />
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div style={{
          background: cardBg, border: "1.5px solid #6366f1",
          borderRadius: 12, padding: "20px", marginBottom: 20,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 14 }}>Share Your Experience</p>
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            placeholder="Your name"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${bdr}`, background: bg, color: text, fontSize: 13, marginBottom: 12, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: sub }}>Rating:</span>
            <StarRow value={form.stars} size={22} interactive onChange={s => setForm(f => ({...f, stars: s}))} />
            <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>
              {["","Poor","Fair","Good","Very Good","Excellent"][form.stars]}
            </span>
          </div>
          <textarea value={form.comment} onChange={e => setForm(f => ({...f, comment: e.target.value}))}
            placeholder="Tell others about your experience..."
            rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${bdr}`, background: bg, color: text, fontSize: 13, resize: "vertical", marginBottom: 12, boxSizing: "border-box" }}
          />
          <button onClick={submitReview}
            disabled={!form.name.trim() || !form.comment.trim()}
            style={{
              padding: "9px 20px", borderRadius: 8, border: "none",
              background: form.name.trim() && form.comment.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#e2e8f0",
              color: form.name.trim() && form.comment.trim() ? "#fff" : "#94a3b8",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >Post Review</button>
        </div>
      )}

      {/* Filter & Sort */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>Filter:</span>
        {[0,5,4,3].map(s => (
          <button key={s} onClick={() => setFilterStar(s)} style={{
            padding: "4px 10px", borderRadius: 20,
            border: `1.5px solid ${filterStar === s ? "#6366f1" : bdr}`,
            background: filterStar === s ? "#6366f1" : "transparent",
            color: filterStar === s ? "#fff" : text,
            fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}>{s === 0 ? "All" : `${s}★`}</button>
        ))}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          marginLeft: "auto", padding: "5px 10px", borderRadius: 8,
          border: `1.5px solid ${bdr}`, background: cardBg,
          color: text, fontSize: 12, cursor: "pointer",
        }}>
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Review Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {displayed.map(r => (
          <div key={r.id} style={{
            background: bg, border: `1px solid ${bdr}`,
            borderLeft: r.isUser ? "3px solid #6366f1" : `1px solid ${bdr}`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: `hsl(${r.name.charCodeAt(0) * 15 % 360},55%,${darkMode?"35%":"80%"})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: darkMode ? "#f1f5f9" : "#1e293b", flexShrink: 0,
                }}>{r.name[0]}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{r.name}</span>
                    {r.verified && <span style={{ fontSize: 9, fontWeight: 700, color: "#059669", background: "#d1fae5", padding: "1px 6px", borderRadius: 10 }}>✓ Verified</span>}
                    {r.isUser && <span style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", background: "#ede9fe", padding: "1px 6px", borderRadius: 10 }}>You</span>}
                  </div>
                  <StarRow value={r.stars} size={11} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: sub }}>{r.date}</span>
            </div>
            <p style={{ fontSize: 13, color: text, lineHeight: 1.6, marginBottom: 10, opacity: 0.9 }}>{r.comment}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: sub }}>Helpful?</span>
              <button onClick={() => setHelpfulMap(m => ({...m, [r.id]: !m[r.id]}))} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20,
                border: `1px solid ${helpfulMap[r.id] ? "#6366f1" : bdr}`,
                background: helpfulMap[r.id] ? "#ede9fe" : "transparent",
                color: helpfulMap[r.id] ? "#6366f1" : sub,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>👍 {r.helpful + (helpfulMap[r.id] ? 1 : 0)}</button>
            </div>
          </div>
        ))}
        {displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px", color: sub, fontSize: 13 }}>No reviews match this filter.</div>
        )}
      </div>
    </div>
  );
}

export default function ProductModal({ product, onClose, onAddToCart, wishlisted, onWishlist, darkMode }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const fmt = n => "₹" + n.toLocaleString("en-IN");

  const bg = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const bdr = darkMode ? "#334155" : "#e2e8f0";
  const imgBg = darkMode ? "#0f172a" : "#f8fafc";

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`@keyframes modalPop { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }`}</style>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}/>
      <div style={{
        position: "relative", background: bg, borderRadius: 20,
        width: "100%", maxWidth: 760,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        animation: "modalPop 0.25s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "sticky", top: 12, float: "right", marginRight: 12, zIndex: 10,
          border: "none", background: darkMode ? "#334155" : "#f1f5f9",
          borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: text, fontSize: 16, flexShrink: 0,
        }}>✕</button>

        <div style={{ display: "flex", flexWrap: "wrap", clear: "both" }}>
          {/* Image */}
          <div style={{
            flex: "1 1 260px", background: imgBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 32, minHeight: 260,
          }}>
            <img src={product.image} alt={product.title}
              style={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain" }}/>
          </div>

          {/* Info */}
          <div style={{ flex: "1 1 280px", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: text, lineHeight: 1.4, margin: 0 }}>{product.title}</h2>

            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StarRow value={Math.round(product.rating)} size={14} />
              <span style={{ fontSize: 12, color: sub }}>{product.rating?.toFixed(1)} · {product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: text }}>{fmt(product.priceINR)}</span>
              <span style={{ fontSize: 15, color: "#94a3b8", textDecoration: "line-through" }}>{fmt(product.originalINR)}</span>
              <span style={{ fontSize: 12, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{product.badge}</span>
            </div>

            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✓ Free Delivery &nbsp;·&nbsp; ✓ Easy Returns &nbsp;·&nbsp; ✓ 1 Year Warranty</div>

            <p style={{ fontSize: 13, color: sub, lineHeight: 1.7, borderTop: `1px solid ${bdr}`, paddingTop: 12, margin: 0 }}>{product.description}</p>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", background: imgBg, borderRadius: 10, border: `1px solid ${bdr}`, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ border: "none", background: "none", width: 36, height: 36, cursor: "pointer", fontSize: 18, color: text }}>−</button>
                <span style={{ fontWeight: 800, minWidth: 32, textAlign: "center", color: text, fontSize: 15 }}>{qty}</span>
                <button onClick={() => setQty(q => q+1)} style={{ border: "none", background: "none", width: 36, height: 36, cursor: "pointer", fontSize: 18, color: text }}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAdd} style={{
                flex: 1, padding: "13px 0",
                background: added ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.3s",
                boxShadow: added ? "0 4px 16px rgba(16,185,129,0.35)" : "0 4px 16px rgba(99,102,241,0.35)",
              }}>{added ? "✓ Added to Cart!" : `Add ${qty > 1 ? qty+" items" : ""} to Cart`}</button>
              <button onClick={() => onWishlist(product.id)} style={{
                width: 48, height: 48, border: `1.5px solid ${bdr}`,
                borderRadius: 12, background: wishlisted ? "#fef2f2" : imgBg,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={wishlisted ? "#ef4444" : "none"}
                  stroke={wishlisted ? "#ef4444" : sub} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ReviewsSection product={product} darkMode={darkMode} />
      </div>
    </div>
  );
}