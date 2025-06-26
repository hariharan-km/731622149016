import React, { useState } from 'react';

export default function StatsPage() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/shorturl/' + code);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2>URL Stats</h2>
      <input
        placeholder="Enter shortcode"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={fetchStats}>Get Stats</button>
      {stats && (
        <div>
          <p>Original URL: {stats.originalUrl}</p>
          <p>Total Clicks: {stats.totalClicks}</p>
          <ul>
            {stats.clicks.map((click, index) => (
              <li key={index}>
                {click} from {click} ({click})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
