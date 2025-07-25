import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Header from './Header';
import Footer from './Footer';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Routing = ({ from, to }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!from || !to || !map) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: { styles: [{ color: 'blue', weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      map.removeControl(routingControlRef.current);
    };
  }, [from, to, map]);

  return null;
};

const TripPlanningAdvisor = () => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [battery, setBattery] = useState('');
  const [tripPlan, setTripPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripCost, setTripCost] = useState(null);

  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('https://ev-database.net/api/all');
        const data = await res.json();
        const names = data?.map(ev => ev.model) || [];
        setVehicleList(names);
      } catch (err) {
        console.error("Failed to fetch EVs:", err);
        setVehicleList([
          'Tata Nexon EV', 'MG ZS EV', 'Hyundai Kona Electric', 'Tata Tigor EV',
          'BYD Atto 3', 'Citroen eC3', 'Mahindra XUV400', 'Kia EV6'
        ]);
      }
    };
    fetchVehicles();
  }, []);

  const geocodeLocation = async (place) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`);
    const data = await res.json();
    return data?.[0] ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
  };

  const handleTripPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripPlan('');
    setTripCost(null);

    const startLoc = startCoords || await geocodeLocation(start);
    const endLoc = endCoords || await geocodeLocation(destination);

    if (!startLoc || !endLoc) {
      alert("Could not get coordinates for start or destination.");
      setLoading(false);
      return;
    }

    setStartCoords(startLoc);
    setEndCoords(endLoc);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert EV trip planner. Provide a complete, professional trip plan including:
- Optimal charging stations
- Travel time & distance
- Top tourist attractions
- Best restaurants along the route
- Comfortable hotels if needed
- Fun activities or tips at each stop`
            },
            {
              role: "user",
              content: `Plan a trip from ${start} (${startLoc.lat}, ${startLoc.lng}) to ${destination} (${endLoc.lat}, ${endLoc.lng}) for a ${vehicleModel} with ${battery}% battery. Include charging stations, travel time, attractions, restaurants, hotels, and suggested experiences.`
            }
          ]
        })
      });

      const data = await res.json();
      const planText = data.choices?.[0]?.message?.content || "No response received.";
      setTripPlan(planText);

      // Estimate cost
      const avgEfficiency = 6; // km per kWh
      const batteryCapacity = 40; // assumed kWh
      const electricityRate = 15; // ₹ per kWh
      const distanceMatch = planText.match(/(\d{2,5})\s?km/i);
      const distanceKm = distanceMatch ? parseInt(distanceMatch[1]) : 250;
      const energyUsedKWh = distanceKm / avgEfficiency;
      const estimatedCost = Math.ceil(energyUsedKWh * electricityRate);
      setTripCost(estimatedCost);

    } catch (err) {
      console.error(err);
      setTripPlan("Error generating trip plan.");
    }

    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const padding = 10;
    let y = padding;

    doc.setFontSize(18);
    doc.text("EV Trip Plan Report", padding, y);
    y += 10;

    const mapElement = document.querySelector('.leaflet-container');
    const canvas = await html2canvas(mapElement);
    const mapImg = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(mapImg);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * padding;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const lines = doc.splitTextToSize(tripPlan, pdfWidth);
    doc.setFontSize(12);
    for (let line of lines) {
      if (y > 270) {
        doc.addPage();
        y = padding;
      }
      doc.text(line, padding, y);
      y += 6;
    }

    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text(`Estimated Trip Cost: ₹${tripCost}`, padding, y);

    doc.save(`EV_Trip_Plan_${start}_to_${destination}.pdf`);
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!startCoords) {
          setStartCoords({ lat, lng });
          setStart(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        } else {
          setEndCoords({ lat, lng });
          setDestination(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
      }
    });
    return null;
  };

  return (
    <>
    <Header/>
     <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/page-title.jpg')" }}>
            <div className="container">
                <div className="row" style={{ marginTop: '100px' }}>
                    <div className="col-md-12">
                        <div className="position-relative text-center">
                            <h1>Trip</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li ><a href="" style={{color:"black"}}>Trip</a></li>
                </ul>
            </div>
        </section>
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>🚗 EV Trip Planning Advisor</h2>

      <form onSubmit={handleTripPlan} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input type="text" value={start} onChange={(e) => setStart(e.target.value)} placeholder="Start Location"
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} required />
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination"
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} required />
        <select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} required
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="">Select Vehicle Model</option>
          {vehicleList.map((v, i) => <option key={i} value={v}>{v}</option>)}
        </select>
        <input type="number" value={battery} onChange={(e) => setBattery(e.target.value)} placeholder="Battery %"
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} required />
        <button type="submit"
          style={{ padding: '0.6rem', background: '#2563eb', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px' }}>
          {loading ? "Planning..." : "Generate Trip Plan"}
        </button>
      </form>

      <div style={{ height: '400px', marginTop: '1.5rem', borderRadius: '10px', overflow: 'hidden' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors" />
          <LocationSelector />
          {startCoords && <Marker position={[startCoords.lat, startCoords.lng]} />}
          {endCoords && <Marker position={[endCoords.lat, endCoords.lng]} />}
          {startCoords && endCoords && <Routing from={startCoords} to={endCoords} />}
        </MapContainer>
      </div>

      {tripPlan && (
        <>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>🧭 Detailed Trip Plan</h3>
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Segoe UI, sans-serif', lineHeight: '1.6', color: '#374151' }}>
              {tripPlan}
            </div>
          </div>

          {tripCost !== null && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbe6', borderRadius: '8px', border: '1px solid #facc15', color: '#92400e' }}>
              <strong>💰 Estimated Total Charging Cost:</strong> ₹{tripCost}
            </div>
          )}

          <button
            onClick={handleDownloadPDF}
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            📄 Download Trip Plan as PDF
          </button>
        </>
      )}
    </div>
    <Footer></Footer>
    </>
  );
};

export default TripPlanningAdvisor;
