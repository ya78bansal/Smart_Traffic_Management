export default function EmergencyAlertBox({ type }) {
  return (
    <div className="alert-box">
      {type === "ambulance" && <h3>🚑 Ambulance Detected!</h3>}
      {type === "accident" && <h3>⚠️ Accident Detected!</h3>}
      {type === "fire" && <h3>🚒 Fire Truck Approaching!</h3>}
      <p>Signal cleared → Emergency lane opened.</p>
    </div>
  );
}
