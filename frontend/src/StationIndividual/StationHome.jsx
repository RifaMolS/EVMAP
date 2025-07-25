import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const energyData = [
    { day: 'Mon', energy: 120 },
    { day: 'Tue', energy: 150 },
    { day: 'Wed', energy: 100 },
    { day: 'Thu', energy: 180 },
    { day: 'Fri', energy: 130 },
  ];

  const cardStyle = {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const cardText = {
    color: '#666',
    marginBottom: '8px',
    fontSize: '14px',
  };

  const cardNumber = {
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const progressContainer = {
    width: '100%',
    height: '8px',
    backgroundColor: '#f3f3f3',
    borderRadius: '20px',
    marginTop: '10px',
    overflow: 'hidden',
  };

  const progressBar = {
    width: '75%', // Assume 75% station activity for now
    height: '100%',
    backgroundColor: '#facc15',
  };

  const sectionTitle = {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const pageStyle = {
    padding: '20px',
    backgroundColor: '#f7f7f7',
    minHeight: '100%',
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: 'blue' }}>DashBoard</h1>

      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Total Charging Sessions */}
        <div style={cardStyle}>
          <div>
            <p style={cardText}>Total Charging Sessions</p>
            <h2 style={cardNumber}>320</h2>
          </div>
        </div>

        {/* Total Energy Delivered */}
        <div style={{ ...cardStyle, border: '1px solid #bbf7d0' }}>
          <div>
            <p style={cardText}>Total Energy Delivered</p>
            <h2 style={{ ...cardNumber, color: '#16a34a' }}>12,500 kWh</h2>
          </div>
        </div>

        {/* Station Activity */}
        <div style={{ ...cardStyle, border: '1px solid #facc15' }}>
          <div style={{ width: '100%' }}>
            <p style={cardText}>Station Activity</p>
            <div style={progressContainer}>
              <div style={progressBar}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Consumption Chart */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={sectionTitle}>Energy Consumption Over Time (kWh)</h2>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#6366f1" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
