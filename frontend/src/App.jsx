import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://landslide-risk-monitoring-system.onrender.com";

function App() {
  const [locations, setLocations] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

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
    } catch (err) {
      console.error("Backend connection error:", err);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const latestSensor =
    sensors.length > 0 ? sensors[sensors.length - 1] : null;

  const latestPrediction =
    predictions.length > 0
      ? predictions[predictions.length - 1]
      : null;

  const activeAlerts = alerts.filter(
    (alert) => alert.is_active === true
  );

  if (loading) {
    return (
      <div className="loading">
        <h2>🌄 Loading Landslide Monitoring System...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🌄 Landslide Risk Monitoring System</h1>

          <p>
            AI-Based Early Warning System for North Eastern Region (NER)
          </p>
        </div>

        <button onClick={loadDashboard}>
          🔄 Refresh
        </button>
      </header>

      {/* BACKEND STATUS */}
      {error ? (
        <div className="error">
          ⚠️ {error}
        </div>
      ) : (
        <div className="success">
          🟢 Backend Connected
        </div>
      )}

      {/* DASHBOARD CARDS */}
      <section className="cards">

        {/* Locations */}
        <div className="card">
          <h3>📍 Locations</h3>

          <div className="value">
            {locations.length}
          </div>

          <p>Monitored locations</p>
        </div>

        {/* Rainfall */}
        <div className="card">
          <h3>🌧️ Rainfall</h3>

          <div className="value">
            {latestSensor
              ? `${latestSensor.rainfall} mm`
              : "N/A"}
          </div>

          <p>Latest reading</p>
        </div>

        {/* Risk Level */}
        <div className="card">
          <h3>📊 Risk Level</h3>

          <div className="value risk-high">
            {latestPrediction
              ? latestPrediction.risk_level
              : "N/A"}
          </div>

          <p>Latest prediction</p>
        </div>

        {/* Alerts */}
        <div className="card">
          <h3>🚨 Active Alerts</h3>

          <div className="value">
            {activeAlerts.length}
          </div>

          <p>Current warnings</p>
        </div>

      </section>

      {/* CURRENT LANDSLIDE RISK */}
      <section className="panel">

        <h2>⚠️ Current Landslide Risk</h2>

        {latestPrediction ? (

          <div className="risk-box">

            <div>
              <span>Risk Level</span>

              <strong>
                {latestPrediction.risk_level}
              </strong>
            </div>

            <div>
              <span>Risk Score</span>

              <strong>
                {latestPrediction.risk_score}
              </strong>
            </div>

            <div>
              <span>Location ID</span>

              <strong>
                {latestPrediction.location_id}
              </strong>
            </div>

          </div>

        ) : (

          <p>
            No prediction available.
          </p>

        )}

      </section>

      {/* ENVIRONMENTAL DATA */}
      <section className="panel">

        <h2>🌡️ Latest Environmental Data</h2>

        {latestSensor ? (

          <div className="sensor-grid">

            <div>
              <span>🌧️ Rainfall</span>

              <strong>
                {latestSensor.rainfall} mm
              </strong>
            </div>

            <div>
              <span>💧 Soil Moisture</span>

              <strong>
                {latestSensor.soil_moisture}
              </strong>
            </div>

            <div>
              <span>🌡️ Temperature</span>

              <strong>
                {latestSensor.temperature} °C
              </strong>
            </div>

            <div>
              <span>💦 Humidity</span>

              <strong>
                {latestSensor.humidity} %
              </strong>
            </div>

            <div>
              <span>⛰️ Slope</span>

              <strong>
                {latestSensor.slope}°
              </strong>
            </div>

          </div>

        ) : (

          <p>
            No sensor data available.
          </p>

        )}

      </section>

      {/* RECENT ALERTS */}
      <section className="panel">

        <h2>🚨 Recent Alerts</h2>

        {alerts.length === 0 ? (

          <p>
            No alerts available.
          </p>

        ) : (

          <div className="alerts">

            {alerts
              .slice(-5)
              .reverse()
              .map((alert) => (

                <div
                  className="alert"
                  key={alert.id}
                >

                  <div>

                    <strong>
                      {alert.severity}
                    </strong>

                    <p>
                      {alert.message}
                    </p>

                  </div>

                  <span>
                    Location {alert.location_id}
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>

      {/* MONITORED LOCATIONS */}
      <section className="panel">

        <h2>📍 Monitored Locations</h2>

        {locations.length === 0 ? (

          <p>
            No monitored locations available.
          </p>

        ) : (

          <div className="locations">

            {locations.map((location) => (

              <div
                className="location"
                key={location.id}
              >

                <h3>
                  {location.name}
                </h3>

                <p>
                  Latitude: {location.latitude}
                </p>

                <p>
                  Longitude: {location.longitude}
                </p>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer>

        <p>
          AI-Based Early Warning and Landslide Risk Monitoring System
        </p>

        <p>
          North Eastern Region (NER)
        </p>

      </footer>

    </div>
  );
}

export default App;