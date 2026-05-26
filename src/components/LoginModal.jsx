import { useState } from "react";

function validate(mode, form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!form.password) errors.password = "Password required";
  else if (form.password.length < 6) errors.password = "Min 6 characters";
  if (mode === "signup") {
    if (!form.name.trim()) errors.name = "Name required";
    if (form.password !== form.confirm) errors.confirm = "Passwords don't match";
  }
  return errors;
}

export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = () => {
    const errs = validate(mode, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
        onClose();
      }, 1000);
    }, 1200);
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setErrors({});
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
      <style>{`
        @keyframes modalPop { from{opacity:0;transform:translate(-50%,-46%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .lm-input { width:100%; padding:12px 14px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; font-family:inherit; background:#f9fafb; transition:all 0.2s; box-sizing:border-box; }
        .lm-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.1); outline:none; background:#fff; }
        .lm-input-err { border-color:#ef4444 !important; }
        .lm-btn { width:100%; padding:14px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:inherit; transition:opacity 0.2s; }
        .lm-btn:hover { opacity:0.92; }
        .lm-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .lm-social { flex:1; padding:11px; border:1.5px solid #e5e7eb; border-radius:10px; background:#fff; cursor:pointer; font-size:13px; font-weight:600; color:#374151; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s; }
        .lm-social:hover { background:#f9fafb; }
      `}</style>

      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "checkPop 0.4s ease" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
              {mode === "login" ? "Welcome back! 👋" : "Account created! 🎉"}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Redirecting to shop...</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginBottom: 4 }}>
                  {mode === "login" ? "Welcome back 👋" : "Create account 🎉"}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {mode === "login" ? "Sign in to your Shopster account" : "Join thousands of happy shoppers"}
                </div>
              </div>
              <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button className="lm-social">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </button>
              <button className="lm-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Facebook
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "signup" && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
                  <input className={`lm-input${errors.name ? " lm-input-err" : ""}`} placeholder="Your full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                  {errors.name && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>⚠ {errors.name}</div>}
                </div>
              )}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
                <input className={`lm-input${errors.email ? " lm-input-err" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                {errors.email && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>⚠ {errors.email}</div>}
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input className={`lm-input${errors.password ? " lm-input-err" : ""}`} type={showPass ? "text" : "password"} placeholder="Min 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} style={{ paddingRight: 44 }} />
                  <button onClick={() => setShowPass((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>⚠ {errors.password}</div>}
              </div>
              {mode === "signup" && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Confirm Password</label>
                  <input className={`lm-input${errors.confirm ? " lm-input-err" : ""}`} type="password" placeholder="Re-enter password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} />
                  {errors.confirm && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>⚠ {errors.confirm}</div>}
                </div>
              )}
              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: -6 }}>
                  <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
                </div>
              )}
              <button className="lm-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <span onClick={switchMode} style={{ color: "#6366f1", fontWeight: 700, cursor: "pointer" }}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}