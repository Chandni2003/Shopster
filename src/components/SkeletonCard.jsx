export default function SkeletonCard() {
  const shimmer = {
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ height: 220, ...shimmer }} />
      <div style={{ padding: 16 }}>
        {[80, 100, 60, 40].map((w, i) => (
          <div
            key={i}
            style={{
              height: 12,
              borderRadius: 6,
              width: `${w}%`,
              marginBottom: 10,
              ...shimmer,
            }}
          />
        ))}
        <div style={{ height: 38, borderRadius: 10, marginTop: 14, ...shimmer }} />
      </div>
    </div>
  );
}