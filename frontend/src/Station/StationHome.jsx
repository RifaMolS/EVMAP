import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StationHome = () => {
  const [stations, setStations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));

  useEffect(() => {
    if (!auth?.userid) return;
    setLoading(true);

    const body = JSON.stringify({ ownerid: auth.userid });
    const headers = {
      Accept: "application/json",
      'Content-Type': "application/json"
    };

    Promise.all([
      fetch('http://localhost:4000/ev/statview', { method: 'POST', headers, body }).then(res => res.json()),
      fetch('http://localhost:4000/ev/viewslot', { method: 'POST', headers, body }).then(res => res.json()),
      fetch('http://localhost:4000/ev/viewstationpayment', { method: 'POST', headers, body }).then(res => res.json())
    ])
      .then(([stationsRes, slotsRes, paymentsRes]) => {
        setStations(Array.isArray(stationsRes) ? stationsRes : []);
        setSlots(Array.isArray(slotsRes) ? slotsRes : []);
        setPayments(Array.isArray(paymentsRes) ? paymentsRes : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard data fetch error:", err);
        setLoading(false);
      });
  }, [auth?.userid]);

  const getChargingRate = (type) => {
    if (type === 'AC') return 10;
    if (type === 'DC') return 18;
    return 0;
  };

  const totalChargingSessions = payments.length;

  const totalRevenue = payments.reduce((sum, p) => {
    const amount = p.booking_id?.amount || 0;
    return sum + amount;
  }, 0);

  const totalEnergyDelivered = payments.reduce((sum, p) => {
    const amount = p.booking_id?.amount || 0;
    const chargingType = p.sid?.chargingtype || 'AC';
    const rate = getChargingRate(chargingType);
    const energy = rate > 0 ? amount / rate : 0;
    return sum + energy;
  }, 0);

  const stationActivity = stations.length > 0
    ? (stations.filter(s => s.status === 'active' || s.isActive).length / stations.length) * 100
    : 0;

  const energyData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = {};
    payments.forEach(p => {
      const amount = p.booking_id?.amount || 0;
      const chargingType = p.sid?.chargingtype || 'AC';
      const rate = getChargingRate(chargingType);
      const energy = rate > 0 ? amount / rate : 0;
      const d = new Date(p.created_at || p.booking_id?.created_at || Date.now());
      const day = days[d.getDay()];
      map[day] = (map[day] || 0) + energy;
    });
    return days.map(day => ({ day, energy: +(map[day] || 0).toFixed(2) }));
  })();

  const cardStyle = {
    background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: 'blue' }}>Station Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20, marginBottom: 30 }}>
        <div style={cardStyle}><p>Total Charging Sessions</p><h2>{totalChargingSessions}</h2></div>
        <div style={cardStyle}><p>Total Energy Delivered</p><h2>{totalEnergyDelivered.toFixed(2)} kWh</h2></div>
        <div style={cardStyle}><p>Total Revenue</p><h2>₹ {totalRevenue.toFixed(2)}</h2></div>
        <div style={cardStyle}><p>Total Stations</p><h2>{stations.length}</h2></div>
        <div style={cardStyle}><p>Total Slots</p><h2>{slots.length}</h2></div>
        <div style={cardStyle}>
          <p>Station Activity</p>
          <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 10, overflow: 'hidden', marginTop: 5 }}>
            <div style={{ width: `${stationActivity.toFixed(1)}%`, background: '#facc15', height: '100%' }} />
          </div>
          <p style={{ fontSize: 12, marginTop: 5 }}>{stationActivity.toFixed(1)}% active</p>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 20 }}>
        <h2 style={{ marginBottom: 20 }}>Energy Consumption Over Time</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StationHome;
