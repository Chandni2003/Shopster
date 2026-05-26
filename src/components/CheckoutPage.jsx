import { useState } from "react";

function Field({ label, placeholder, value, onChange, error, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "11px 14px", border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
          borderRadius: 10, fontSize: 14, fontFamily: "inherit",
          background: "#f9fafb", transition: "border 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
        onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")}
      />
      {error && <span style={{ fontSize: 12, color: "#ef4444" }}>⚠ {error}</span>}
    </div>
  );
}

export default function CheckoutPage({ cart, onBack, onOrderPlace }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pincode: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [payMode, setPayMode] = useState("card");

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");
  const total = cart.reduce((s, i) => s + i.priceINR * i.qty, 0);
  const update = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pincode.trim() || form.pincode.length < 6) e.pincode = "Valid pincode required";
    if (payMode === "card") {
      if (!form.card.trim() || form.card.length < 16) e.card = "Valid card number required";
      if (!form.expiry.trim()) e.expiry = "Required";
      if (!form.cvv.trim() || form.cvv.length < 3) e.cvv = "Valid CVV required";
    }
    return e;
  };

  const handleOrder = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
      setTimeout(() => onOrderPlace(), 3000);
    }, 2000);
  };

  if (ordered) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "checkPop 0.5s ease" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <style>{`@keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }`}</style>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 8 }}>Order Placed! 🎉</div>
        <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 8 }}>Thank you, {form.name}!</div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>Your order of {fmt(total)} is confirmed. Redirecting...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Outfit','Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ border: "none", background: "#f3f4f6", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>
        <div style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Checkout</div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px", display: "flex", gap: 24, flexWrap: "wrap" }}>

        {/* Left — Form */}
        <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Delivery Info */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 18 }}>📦 Delivery Information</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Full Name" placeholder="Chandni gupta" value={form.name} onChange={(v) => update("name", v)} error={errors.name} />
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><Field label="Email" placeholder="you@example.com" value={form.email} onChange={(v) => update("email", v)} error={errors.email} type="email" /></div>
                <div style={{ flex: 1 }}><Field label="Phone" placeholder="9876543210" value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} type="tel" /></div>
              </div>
              <Field label="Address" placeholder="House no, Street, Area" value={form.address} onChange={(v) => update("address", v)} error={errors.address} />
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><Field label="City" placeholder="Mumbai" value={form.city} onChange={(v) => update("city", v)} error={errors.city} /></div>
                <div style={{ flex: 1 }}><Field label="Pincode" placeholder="400001" value={form.pincode} onChange={(v) => update("pincode", v)} error={errors.pincode} /></div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 18 }}>💳 Payment Method</div>

            {/* Payment toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[["card", "💳 Card"], ["upi", "📱 UPI"], ["cod", "💵 Cash on Delivery"]].map(([val, label]) => (
                <button key={val} onClick={() => setPayMode(val)} style={{ flex: 1, padding: "10px 6px", border: `1.5px solid ${payMode === val ? "#6366f1" : "#e5e7eb"}`, borderRadius: 10, background: payMode === val ? "#f0f0ff" : "#fff", color: payMode === val ? "#6366f1" : "#374151", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
              ))}
            </div>

            {payMode === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Card Number" placeholder="1234 5678 9012 3456" value={form.card} onChange={(v) => update("card", v.replace(/\D/g, "").slice(0, 16))} error={errors.card} />
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}><Field label="Expiry" placeholder="MM/YY" value={form.expiry} onChange={(v) => update("expiry", v)} error={errors.expiry} /></div>
                  <div style={{ flex: 1 }}><Field label="CVV" placeholder="123" value={form.cvv} onChange={(v) => update("cvv", v.replace(/\D/g, "").slice(0, 3))} error={errors.cvv} /></div>
                </div>
              </div>
            )}
            {payMode === "upi" && (
              <Field label="UPI ID" placeholder="yourname@upi" value={form.upi || ""} onChange={(v) => update("upi", v)} error={errors.upi} />
            )}
            {payMode === "cod" && (
              <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#16a34a", fontWeight: 500 }}>
                ✓ Pay when your order arrives at your doorstep. No charges.
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div style={{ flex: "1 1 280px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16 }}>🛒 Order Summary</div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, background: "#f9fafb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={item.image} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#6366f1" }}>{fmt(item.priceINR * item.qty)}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                <span>Subtotal</span><span style={{ fontWeight: 600 }}>{fmt(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#10b981" }}>
                <span>Delivery</span><span style={{ fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, color: "#111827", marginTop: 6 }}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              style={{
                width: "100%", marginTop: 20, padding: "14px 0",
                background: loading ? "#9ca3af" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Placing Order..." : `Place Order — ${fmt(total)}`}
            </button>

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
              🔒 Secure & Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}