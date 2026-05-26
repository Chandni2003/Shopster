export default function Hero() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#ec4899 100%)",
        padding: "44px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "radial-gradient(circle at 15% 50%,rgba(255,255,255,0.08),transparent 45%)," +
            "radial-gradient(circle at 85% 20%,rgba(255,255,255,0.06),transparent 40%)",
        }}
      />

      <div style={{ position: "relative" }}>

        {/* Tag line */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 12, color: "rgba(255,255,255,0.9)",
            fontWeight: 600, marginBottom: 14, backdropFilter: "blur(8px)",
          }}
        >
          ⚡ Live Products
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(26px,4vw,44px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.2, marginBottom: 10,
          }}
        >
          Everything You Love,<br />Delivered to Your Door
        </h1>

        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: 24 }}>
          Electronics, Fashion, Jewellery & More — Free Delivery on first 5 orders
        </p>

        {/* Stats strip */}
        <div
          className="hide-mobile"
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
        >
          {[
            ["20+", "Live Products"],
            ["API",  "Powered"],
            ["Free", "Delivery"],
            ["4.5★", "Avg Rating"],
          ].map(([v, l]) => (
            <div
              key={l}
              style={{
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                borderRadius: 12, padding: "10px 18px", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}