export default function LanePreview({ label }) {
  return (
    <div className="lane-video">
      <video autoPlay muted loop>
        <source src="http://localhost:3000/video/traffic11.mp4" type="video/mp4" />
      </video>
      <span>{label}</span>
    </div>
  );
}
