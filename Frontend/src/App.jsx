import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortenPage from "./pages/ShortenPage";
import StatsPage from "./pages/StatsPage";

function App() {
  // Store the states
  const [urls, setUrls] = useState([
    { originalUrl: '', validity: '', customCode: '' }
  ]);

  
  const [results, setResults] = useState([]);

  // For input fields
  const handleChange = (index, field, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index][field] = value;
    setUrls(updatedUrls);
  };

  //  URLs using the API
  const handleShorten = async () => {
    const shortenedResults = [];

    for (let url of urls) {
      const response = await API.post('/shorten', url);
      shortenedResults.push(response.data);
    }

    setResults(shortenedResults);
  };

  return (
    <Router>
      <Routes>
        {/* This <Routes> tag is misused here; normally you put <Route> inside it.
            But keeping the structure as per your code. */}
        <h2>Shorten URLs</h2>

        {urls.map((url, index) => (
          <div key={index}>
            <input
              placeholder="Original URL"
              value={url.originalUrl}
              onChange={e => handleChange(index, 'originalUrl', e.target.value)}
            />
            <input
              type="number"
              placeholder="Validity (in days)"
              value={url.validity}
              onChange={e => handleChange(index, 'validity', e.target.value)}
            />
            <input
              placeholder="Custom Code (optional)"
              value={url.customCode}
              onChange={e => handleChange(index, 'customCode', e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleShorten}>Shorten</button>

        <div>
          {results.map((result, index) => (
            <p key={index}>
              {result.shortLink} - Expires at: {new Date(result.expiry).toLocaleString()}
            </p>
          ))}
        </div>
      </Routes>
    </Router>
  );
}

export default App;
