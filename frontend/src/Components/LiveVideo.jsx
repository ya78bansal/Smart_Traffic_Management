export default function LiveVideo() {
  return (
    <div className="live-video">
      <video autoPlay muted loop>
        <source src="http://localhost:3000/video/traffic11.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
