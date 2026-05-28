import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import SkeletonCard from "./components/SkeletonCard";
import Toast from "./components/Toast";
import LoginModal from "./components/LoginModal";
import ProductModal from "./components/ProductModal";
import CheckoutPage from "./components/CheckoutPage";
import NotificationBell from "./components/NotificationBell";
import WishlistDrawer from "./components/WishlistDrawer";
import FilterPanel from "./components/FilterPanel";
import AdminDashboard from "./components/AdminDashboard";
import OrderHistory from "./components/OrderHistory";

const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Most Reviews",
];

function enrichProduct(p) {
  const priceINR = Math.round(p.price * 83);
  const discountPct = Math.round(p.discountPercentage) || 10;
  const originalINR = Math.round(priceINR / (1 - discountPct / 100));
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.thumbnail,
    priceINR,
    originalINR,
    badge: `${discountPct}% OFF`,
    category: p.category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    rating: p.rating || 4.0,
    reviews: p.reviews?.length || Math.floor(Math.random() * 500) + 50,
  };
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Advanced Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("https://dummyjson.com/products?limit=200&skip=0").then((r) => r.json()),
      fetch("https://dummyjson.com/products/categories").then((r) => r.json()),
    ])
      .then(([productsData, catsData]) => {
        const enriched = productsData.products.map(enrichProduct);
        setProducts(enriched);
        const maxP = Math.max(...enriched.map((p) => p.priceINR));
        setPriceRange([0, maxP]);
        const catNames = catsData.map((c) =>
          (typeof c === "string" ? c : c.slug || c.name)
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        );
        setCategories(["All", ...catNames]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.body.style.background = darkMode ? "#0f172a" : "#f8fafc";
  }, [darkMode]);

  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.priceINR)) : 100000;

  const filtered = products
    .filter((p) =>
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      p.priceINR >= priceRange[0] &&
      p.priceINR <= priceRange[1] &&
      p.rating >= minRating
    )
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.priceINR - b.priceINR;
      if (sort === "Price: High to Low") return b.priceINR - a.priceINR;
      if (sort === "Top Rated") return b.rating - a.rating;
      if (sort === "Most Reviews") return b.reviews - a.reviews;
      return 0;
    });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      return existing
        ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
    setToast(`"${product.title.slice(0, 28)}..." added to cart!`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const changeQty = (id, delta) =>
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setSearch("");
    setCategory("All");
  };

  const activeFilterCount =
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishlistItems = products.filter((p) => wishlist.includes(p.id));

  const bg   = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#111827";
  const sub  = darkMode ? "#94a3b8" : "#6b7280";
  const bdr  = darkMode ? "#334155" : "#e5e7eb";

  if (showCheckout)
    return (
      <CheckoutPage
        cart={cart}
        onBack={() => setShowCheckout(false)}
        onOrderPlace={() => {
          setCart([]);
          setShowCheckout(false);
          setToast("Order placed successfully! 🎉");
        }}
        darkMode={darkMode}
      />
    );

  return (
    <div style={{ fontFamily: "'Outfit','Inter','Segoe UI',sans-serif", background: bg, minHeight: "100vh", transition: "background 0.3s" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { 0%{transform:scale(0.85);opacity:0} 70%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
        .product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
        .cat-scroll::-webkit-scrollbar { height:0; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
        button:focus,input:focus,select:focus{outline:none}
        .icon-btn { transition: all 0.2s ease; }
        .icon-btn:hover { transform: scale(1.08); background: #6366f1 !important; border-color: #6366f1 !important; }
        .icon-btn:hover svg { stroke: #fff !important; }
        @media(max-width:640px){
          .product-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}
          .hide-mobile{display:none!important}
          .show-mobile-flex{display:flex!important}
        }
        @media(min-width:641px){
          .show-mobile-only{display:none!important}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: darkMode ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${bdr}`,
        padding: "0 16px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 16px rgba(0,0,0,0.07)", transition: "all 0.3s", gap: 8,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Shopster
          </span>
        </div>

        {/* Search — desktop only */}
        <div className="hide-mobile" style={{ flex: 1, maxWidth: 420, margin: "0 12px", position: "relative" }}>
          <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 200+ products..."
            style={{ width: "100%", padding: "9px 12px 9px 34px", border: `1.5px solid ${bdr}`, borderRadius: 11, fontSize: 13, fontFamily: "inherit", background: darkMode ? "#1e293b" : "#f9fafb", color: text, transition: "all 0.2s" }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = bdr)}
          />
        </div>

        {/* Desktop Actions */}
        <div className="hide-mobile" style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          {/* Dark Mode */}
          <button className="icon-btn" onClick={() => setDarkMode((d) => !d)}
            style={{ width: 36, height: 36, borderRadius: 9, border: `1.5px solid ${bdr}`, background: darkMode ? "#1e293b" : "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <NotificationBell darkMode={darkMode} />

          {/* Wishlist */}
          <button className="icon-btn" onClick={() => setWishlistOpen(true)}
            style={{ width: 36, height: 36, borderRadius: 9, border: `1.5px solid ${bdr}`, background: wishlist.length > 0 ? "#fef2f2" : (darkMode ? "#1e293b" : "#f3f4f6"), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#ef4444" : "none"} stroke={wishlist.length > 0 ? "#ef4444" : (darkMode ? "#94a3b8" : "#6b7280")} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Orders */}
          <button onClick={() => setShowOrders(true)}
            style={{ fontSize: 12, fontWeight: 600, color: text, padding: "7px 12px", background: darkMode ? "#1e293b" : "#f3f4f6", border: `1px solid ${bdr}`, borderRadius: 9, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
            📦 Orders
          </button>

          {/* Stats */}
          <button onClick={() => setShowStats(true)}
            style={{ fontSize: 12, fontWeight: 600, color: text, padding: "7px 12px", background: darkMode ? "#1e293b" : "#f3f4f6", border: `1px solid ${bdr}`, borderRadius: 9, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
            📊 Stats
          </button>

          {/* User */}
          {user ? (
            <div onClick={() => { setUser(null); setToast("Logged out!"); }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 12px", background: darkMode ? "#1e293b" : "#f3f4f6", borderRadius: 9, cursor: "pointer", border: `1px solid ${bdr}` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{user.name}</span>
            </div>
          ) : (
            <button onClick={() => setLoginOpen(true)}
              style={{ fontSize: 12, fontWeight: 600, color: text, padding: "7px 12px", background: darkMode ? "#1e293b" : "#f3f4f6", border: `1px solid ${bdr}`, borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
              Sign In
            </button>
          )}

          {/* Cart */}
          <button onClick={() => setCartOpen(true)}
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(99,102,241,0.4)", fontFamily: "inherit", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span style={{ background: "#ef4444", borderRadius: "50%", width: 17, height: 17, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Right Actions */}
        <div className="show-mobile-only" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Mobile Search Toggle */}
          <button onClick={() => setMobileSearchOpen(o => !o)}
            style={{ width: 36, height: 36, borderRadius: 9, border: `1.5px solid ${bdr}`, background: darkMode ? "#1e293b" : "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Mobile Cart */}
          <button onClick={() => setCartOpen(true)} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, padding: "8px 12px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{ background: "#ef4444", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button onClick={() => setMobileMenuOpen(o => !o)}
            style={{ width: 36, height: 36, borderRadius: 9, border: `1.5px solid ${bdr}`, background: darkMode ? "#1e293b" : "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#94a3b8" : "#6b7280"} strokeWidth="2">
              {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="show-mobile-only" style={{ background: darkMode ? "#1e293b" : "#fff", padding: "10px 16px", borderBottom: `1px solid ${bdr}`, animation: "slideUp 0.2s ease" }}>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 200+ products..."
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid #6366f1`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: darkMode ? "#0f172a" : "#f9fafb", color: text }}
          />
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="show-mobile-only" style={{
          background: darkMode ? "#1e293b" : "#fff", borderBottom: `1px solid ${bdr}`,
          padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8,
          animation: "slideUp 0.2s ease", zIndex: 99, position: "relative",
        }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { setDarkMode(d => !d); setMobileMenuOpen(false); }}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${bdr}`, background: darkMode ? "#0f172a" : "#f3f4f6", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={() => { setWishlistOpen(true); setMobileMenuOpen(false); }}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${bdr}`, background: darkMode ? "#0f172a" : "#f3f4f6", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </button>
            <button onClick={() => { setShowOrders(true); setMobileMenuOpen(false); }}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${bdr}`, background: darkMode ? "#0f172a" : "#f3f4f6", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              📦 Orders
            </button>
            <button onClick={() => { setShowStats(true); setMobileMenuOpen(false); }}
              style={{ flex: 1, padding: "10px", borderRadius: 9, border: `1px solid ${bdr}`, background: darkMode ? "#0f172a" : "#f3f4f6", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              📊 Stats
            </button>
          </div>
          {user ? (
            <button onClick={() => { setUser(null); setToast("Logged out!"); setMobileMenuOpen(false); }}
              style={{ padding: "10px", borderRadius: 9, border: `1px solid ${bdr}`, background: darkMode ? "#0f172a" : "#f3f4f6", color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              👋 Logout ({user.name})
            </button>
          ) : (
            <button onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
              style={{ padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Sign In
            </button>
          )}
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#ec4899 100%)", padding: "36px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 50%,rgba(255,255,255,0.08),transparent 45%),radial-gradient(circle at 85% 20%,rgba(255,255,255,0.06),transparent 40%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: 12, backdropFilter: "blur(8px)" }}>
            ⚡ 200+ Products · 30+ Categories · Live API
          </div>
          <h1 style={{ fontSize: "clamp(22px,4vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>
            Everything You Love,<br />Delivered to Your Door
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 20 }}>
            Fashion, Electronics, Beauty & More — Free Delivery
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[["200+", "Products"], ["30+", "Categories"], ["Free", "Delivery"], ["4.5★", "Rating"]].map(([v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 14px" }}>

        {/* Category Tabs */}
        <div className="cat-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 8, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 14px", borderRadius: 20, border: "1.5px solid",
              borderColor: category === cat ? "#6366f1" : bdr,
              background: category === cat ? "#6366f1" : card,
              color: category === cat ? "#fff" : text,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.2s", flexShrink: 0,
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: sub }}>
            {loading ? "⏳ Loading..." : error ? "❌ Error" : (
              <>
                <strong style={{ color: text }}>{filtered.length}</strong> products
                {category !== "All" && <span> in <strong style={{ color: "#6366f1" }}>{category}</strong></span>}
                {search && <span> · "<strong>{search}</strong>"</span>}
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <button
              onClick={() => setShowFilters((f) => !f)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 12px", borderRadius: 9,
                border: `1.5px solid ${showFilters ? "#6366f1" : bdr}`,
                background: showFilters ? "#6366f1" : card,
                color: showFilters ? "#fff" : text,
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ padding: "7px 10px", border: `1.5px solid ${bdr}`, borderRadius: 9, fontSize: 12, fontFamily: "inherit", background: card, color: text, fontWeight: 600, cursor: "pointer" }}>
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && !loading && (
          <FilterPanel
            darkMode={darkMode}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            maxPrice={maxPrice}
            onReset={resetFilters}
          />
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: text }}>Could not load products</div>
            <div style={{ fontSize: 13, color: sub, marginTop: 6 }}>{error}</div>
            <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: "10px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>Retry</button>
          </div>
        )}

        {/* Skeletons */}
        {loading && !error && (
          <div className="product-grid">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 8 }}>No products found</div>
              <div style={{ fontSize: 13, color: sub }}>Try adjusting your filters</div>
              <button onClick={resetFilters} style={{ marginTop: 16, padding: "10px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>Clear Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((p, i) => (
                <div key={p.id} style={{ animation: `fadeUp 0.4s ease ${Math.min(i, 8) * 0.04}s both`, cursor: "pointer" }} onClick={() => setSelectedProduct(p)}>
                  <ProductCard product={p} onAddToCart={() => addToCart(p)} onWishlist={toggleWishlist} wishlisted={wishlist.includes(p.id)} />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* NEWSLETTER */}
      <div style={{ background: darkMode ? "#1e293b" : "#111827", marginTop: 40, padding: "44px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Stay in the Loop 📬</div>
          <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 20 }}>Exclusive deals and new arrivals in your inbox.</div>
          <div style={{ display: "flex", gap: 8, maxWidth: 360, margin: "0 auto" }}>
            <input placeholder="Enter your email" style={{ flex: 1, padding: "11px 12px", border: "none", borderRadius: 10, fontSize: 13, fontFamily: "inherit", background: "#1f2937", color: "#fff", minWidth: 0 }} />
            <button style={{ padding: "11px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "24px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </div>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>Shopster</span>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Powered by <a href="https://dummyjson.com" target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>DummyJSON API</a> · © 2025 Shopster
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onQtyChange={changeQty} onCheckout={() => { setCartOpen(false); setShowCheckout(true); }} />}
      {wishlistOpen && <WishlistDrawer wishlistItems={wishlistItems} onClose={() => setWishlistOpen(false)} onRemove={toggleWishlist} onAddToCart={addToCart} />}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onLogin={(u) => { setUser(u); setToast(`Welcome, ${u.name}! 👋`); }} />}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          wishlisted={wishlist.includes(selectedProduct.id)}
          onWishlist={toggleWishlist}
          darkMode={darkMode}
        />
      )}
      {showStats && (
        <AdminDashboard
          products={products}
          cart={cart}
          wishlist={wishlist}
          onClose={() => setShowStats(false)}
          darkMode={darkMode}
        />
      )}
      {showOrders && (
        <OrderHistory
          onClose={() => setShowOrders(false)}
          darkMode={darkMode}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}