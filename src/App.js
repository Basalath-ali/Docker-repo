import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [oasFile, setOasFile] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setOasFile(e.target.files[0]);
  };

  const uploadOAS = async () => {
    if (!oasFile) return setError('Please select a file to upload.');
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('oas', oasFile);
      const res = await axios.post('/api/upload', formData);
      setEndpoints(res.data.endpoints);
    } catch (err) {
      setError('Failed to upload and parse OAS file.');
    } finally {
      setLoading(false);
    }
  };

  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/execute');
      setLogs(res.data.log);
      const summaryRes = await axios.get('/api/summary');
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to execute endpoints.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>REST API Evaluator</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadOAS} disabled={loading}>Upload OAS</button>
      <button onClick={execute} disabled={!endpoints.length || loading}>Execute Endpoints</button>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Processing...</p>}

      <h3>Extracted Endpoints:</h3>
      <ul>
        {endpoints.map((ep, idx) => (
          <li key={idx}>{ep.method} {ep.endpoint}</li>
        ))}
      </ul>

      <h3>Execution Logs:</h3>
      <pre className="logs">{JSON.stringify(logs, null, 2)}</pre>

      <h3>Summary Report:</h3>
      {summary && (
        <div>
          <p><strong>Overall Success Rate:</strong> {summary.overallSuccessRate}</p>
          <ul>
            {summary.summary.map((s, idx) => (
              <li key={idx}>{s.endpoint} - {s.successRate}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
