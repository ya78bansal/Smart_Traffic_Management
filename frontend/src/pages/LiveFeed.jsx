export default function LiveFeed() {
  return (
    <div className="content">
      <h2>🎥 Live Traffic Camera Feed</h2>

      <div className="card" style={{ padding: "0px", position: "relative" }}>

        {/* Live Badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "red",
            padding: "5px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700"
          }}
        >
          🔴 LIVE
        </div>

        <video
          autoPlay
          muted
          loop
          style={{
            width: "100%",
            borderRadius: "12px",
            border: "2px solid rgba(0,255,136,0.5)",
            boxShadow: "0 0 20px rgba(0,255,136,0.3)"
          }}
        >
          <source
            src="http://localhost:3000/video/traffic11.mp4"
            type="video/mp4"
          />
        </video>

        <div
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            opacity: 0.7,
            background: "rgba(255,255,255,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0 0 12px 12px"
          }}
        >
          Camera ID: CAM-001 | Location: Sector 21, Main Road
        </div>
      </div>
    </div>
  );
}
