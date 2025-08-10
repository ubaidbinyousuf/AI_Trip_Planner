import React, { useState } from 'react';
import './App.css';
import Map from './Map';

function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [tripPlan, setTripPlan] = useState('');
  const [mapLat, setMapLat] = useState(0);
  const [mapLng, setMapLng] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripPlan('');
    setResponseMessage('');

    try {
      // 🧠 Call Flask backend (Gemini AI)
      const res = await fetch('http://127.0.0.1:5000/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, startDate, endDate }),
      });

      const data = await res.json();

      if (data.error) {
        setResponseMessage("Error from backend: " + data.error);
        return;
      }

      setResponseMessage("Trip generated successfully!");
      setTripPlan(data.message);

      // 📍 Get coordinates from Google Geocoding API
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      const geoRes = await fetch(geocodeUrl);
      const geoData = await geoRes.json();

      if (geoData.status === 'OK') {
        const location = geoData.results[0].geometry.location;
        setMapLat(location.lat);
        setMapLng(location.lng);
      } else {
        console.warn("Geocoding failed:", geoData.status);
      }

    } catch (error) {
      console.error("Error fetching trip plan:", error);
      setResponseMessage("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>GoByBot AI Trip Planner</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Plan Trip</button>
      </form>

      {loading && <p>Thinking... Please wait.</p>}
      {responseMessage && <p><strong>Status:</strong> {responseMessage}</p>}

      {tripPlan && (
        <div className="trip-plan-output">
          <h2>Your Trip Plan:</h2>
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>{tripPlan}</pre>
        </div>
      )}

      {/* Display Map if we have coordinates */}
      {mapLat !== 0 && mapLng !== 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Map Location:</h2>
          <Map center={{ lat: mapLat, lng: mapLng }} />
        </div>
      )}
    </div>
  );
}

export default App;
