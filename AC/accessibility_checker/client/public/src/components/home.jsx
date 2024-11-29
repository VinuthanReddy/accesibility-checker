import React, { useState } from 'react';
import './index.css';  // Import your CSS file

const Home = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle URL submission
  const handleURLSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:5000/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  // Handle file submission
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const res = await fetch('http://localhost:5000/check-file', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Automated Accessibility Checker</h1>

      {/* URL Input Form */}
      <form onSubmit={handleURLSubmit} className="mb-6">
        <input
          type="url"
          className="p-2 border rounded-md"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="ml-3">
          Check URL
        </button>
      </form>

      {/* File Upload Form */}
      <form onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="p-2 border rounded-md"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" className="ml-3">
          Check File
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold">Accessibility Issues:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
