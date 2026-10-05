import { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// ===============================
// LEAFLET MARKER FIX
// ===============================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ===============================
// BACKEND URL
// ===============================
// IMPORTANT: Replace this with your actual Render backend URL.
const API_URL = "https://YOUR-BACKEND-NAME.onrender.com";

function App() {
  const [locations, setLocations] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          locationsResponse,
          sensorsResponse,
          predictionsResponse,
          alertsResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/locations/`),
          axios.get(`${API_URL}/sensors/`),
          axios.get(`${API_URL}/predictions/history`),
          axios.get(`${API_URL}/alerts/`),
        ]);

        setLocations(locationsResponse.data || []);
        setSensors(sensorsResponse.data || []);
        setPredictions(predictionsResponse.data || []);
        setAlerts(alertsResponse.data || []);

        setBackendConnected(true);
      } catch (error) {
        console.error("Backend connection error:", error);
        setBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ===============================
  // LATEST SENSOR
  // ===============================
  const latestSensor =
    sensors.length > 0 ? sensors[sensors.length - 1] : null;

  // ===============================
  // LATEST PREDICTION
  // ===============================
  const latestPrediction =
    predictions.length > 0
      ? predictions[predictions.length - 1]
      : null;

  const riskLevel =
    latestPrediction?.risk_level ||
    latestPrediction?.risk ||
    "N/A";

  // ===============================
  // RISK SCORE
  // ===============================
  const riskScore =
    latestPrediction?.risk_score ??
    latestPrediction?.score ??
    0;

  // ===============================
  // ENVIRONMENT DATA
  // ===============================
  const rainfall = latestSensor?.rainfall ?? 0;
  const soilMoisture = latestSensor?.soil_moisture ?? 0;
  const temperature = latestSensor?.temperature ?? 0;
  const humidity = latestSensor?.humidity ?? 0;
  const slope = latestSensor?.slope ?? 0;

  // ===============================
  // ACTIVE ALERTS
  // ===============================
  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status === "ACTIVE" ||
      alert.status === "active" ||
      alert.is_active === true ||
      !alert.status
  );

  // ===============================
  // RISK COLOR
  // ===============================
  const getRiskColor = (risk) => {
    const value = String(risk).toUpperCase();

    if (value === "HIGH") return "#dc2626";
    if (value === "MEDIUM") return "#f59e0b";
    if (value === "LOW") return "#16a34a";

    return "#64748b";
  };

  if (loading) {
    return (
      <div className="app">
        <h1>Landslide Risk Monitoring System</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* ===============================
          HEADER
      =============================== */}
      <header className="header">
        <div>
          <h1>AI-Based Landslide Risk Monitoring System</h1>
          <p>
            Early Warning and Risk Monitoring System for North Eastern Region
          </p>
        </div>

        <div
          className="connection-status"
          style={{
            color: backendConnected ? "#16a34a" : "#dc2626",
          }}
        >
          ● {backendConnected ? "Backend Connected" : "Backend Disconnected"}
        </div>
      </header>

      {/* ===============================
          SUMMARY CARDS
      =============================== */}
      <section className="cards">

        <div className="card">
          <h3>Monitored Locations</h3>
          <h2>{locations.length}</h2>
        </div>

        <div className="card">
          <h3>Rainfall</h3>
          <h2>{rainfall} mm</h2>
        </div>

        <div className="card">
          <h3>Risk Level</h3>
          <h2 style={{ color: getRiskColor(riskLevel) }}>
            {String(riskLevel).toUpperCase()}
          </h2>
        </div>

        <div className="card">
          <h3>Active Alerts</h3>
          <h2>{activeAlerts.length}</h2>
        </div>

      </section>

      {/* ===============================
          RISK INFORMATION
      =============================== */}
      <section className="section">

        <h2>Current Risk Assessment</h2>

        <div className="risk-box">

          <div>
            <h3>Risk Level</h3>

            <h1
              style={{
                color: getRiskColor(riskLevel),
              }}
            >
              {String(riskLevel).toUpperCase()}
            </h1>
          </div>

          <div>
            <h3>Risk Score</h3>
            <h1>{riskScore}</h1>
          </div>

          <div>
            <h3>Location ID</h3>
            <h1>
              {latestPrediction?.location_id ||
                latestSensor?.location_id ||
                "N/A"}
            </h1>
          </div>

        </div>

      </section>

      {/* ===============================
          ENVIRONMENT DATA
      =============================== */}
      <section className="section">

        <h2>Environmental Conditions</h2>

        <div className="environment-grid">

          <div className="environment-card">
            <h3>Rainfall</h3>
            <p>{rainfall} mm</p>
          </div>

          <div className="environment-card">
            <h3>Soil Moisture</h3>
            <p>{soilMoisture}%</p>
          </div>

          <div className="environment-card">
            <h3>Temperature</h3>
            <p>{temperature} °C</p>
          </div>

          <div className="environment-card">
            <h3>Humidity</h3>
            <p>{humidity}%</p>
          </div>

          <div className="environment-card">
            <h3>Slope</h3>
            <p>{slope}°</p>
          </div>

        </div>

      </section>

      {/* ===============================
          MAP
      =============================== */}
      <section className="section">

        <h2>Monitored Locations</h2>

        <div className="map-container">

          <MapContainer
            center={[25.5788, 91.8933]}
            zoom={6}
            style={{
              height: "450px",
              width: "100%",
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((location) => {

              const latitude =
                location.latitude ?? location.lat;

              const longitude =
                location.longitude ?? location.lon;

              if (
                latitude === undefined ||
                longitude === undefined
              ) {
                return null;
              }

              return (
                <Marker
                  key={location.id}
                  position={[latitude, longitude]}
                >
                  <Popup>
                    <strong>
                      {location.name || "Unknown Location"}
                    </strong>

                    <br />

                    Latitude: {latitude}

                    <br />

                    Longitude: {longitude}
                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>

        </div>

      </section>

      {/* ===============================
          ALERTS
      =============================== */}
      <section className="section">

        <h2>Recent Alerts</h2>

        {alerts.length === 0 ? (
          <p>No alerts available.</p>
        ) : (
          <div className="alerts-list">

            {alerts.slice(0, 10).map((alert) => (

              <div
                className="alert-card"
                key={alert.id}
              >

                <h3>
                  {alert.level ||
                    alert.risk_level ||
                    alert.severity ||
                    "ALERT"}
                </h3>

                <p>
                  {alert.message ||
                    alert.description ||
                    "Landslide risk detected"}
                </p>

                <small>
                  Location ID:{" "}
                  {alert.location_id || "N/A"}
                </small>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* ===============================
          FOOTER
      =============================== */}
      <footer>
        <p>
          AI-Based Early Warning and Landslide Risk Monitoring System in NER
        </p>
      </footer>

    </div>
  );
}

export default App;