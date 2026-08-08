import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // if using react-router
import "./Configuration.css";

export default function Configuration() {
  const [configData, setConfigData] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Automatically load the file path from localStorage when the component mounts
  useEffect(() => {
    const savedPath = localStorage.getItem("selectedScenarioPath");
    if (savedPath) {
      loadConfigFromFile(savedPath);
    }
  }, []);

  const loadConfigFromFile = async (path) => {
    try {
      setLoading(true);
      setError(null);
      setFilePath(path);

      const parsedData = await window.electronAPI.readJsonFile(path);
      if (!parsedData) {
        throw new Error("Failed to parse JSON configuration file.");
      }
      setConfigData(parsedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler if they want to manually choose a different file using the dialog
  const handleChooseDifferentFile = async () => {
    try {
      const selectedPath = await window.electronAPI.chooseScenarioFile();
      if (selectedPath) {
        localStorage.setItem("selectedScenarioPath", selectedPath);
        loadConfigFromFile(selectedPath);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Proceed to Execution page
  const handleProceed = () => {
    navigate("/execution");
  };

  return (
    <div className="config-container">
      <div className="config-header">
        <h2>Scenario Configuration</h2>
        <p className="subtitle">
          Review parameters and validation criteria before running the simulation.
        </p>
      </div>

      <div className="config-action-bar">
        <button className="secondary-btn" onClick={handleChooseDifferentFile}>
          Choose Different File
        </button>
        {filePath && <span className="file-path-label">Active: {filePath}</span>}
        
        {configData && (
          <button className="primary-btn proceed-btn" onClick={handleProceed}>
             Proceed to Execution
          </button>
        )}
      </div>

      {loading && <p className="status-text">Loading configuration...</p>}
      {error && <p className="error-text"> {error}</p>}

      {!configData && !loading && !error && (
        <div className="empty-state">
          <p>No configuration selected. Please go back to the Dashboard and select a scenario.</p>
        </div>
      )}

      {configData && (
        <div className="config-grid">
          {/* Overview Card */}
          <div className="config-card">
            <h3>Overview</h3>
            <div className="info-row">
              <span className="label">Scenario Name:</span>
              <span className="value highlight">{configData.scenario_name || "Unnamed Scenario"}</span>
            </div>
          </div>

          {/* Parameters Table */}
          <div className="config-card">
            <h3>Simulation Parameters</h3>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {configData.parameters && Object.entries(configData.parameters).map(([key, value]) => (
                  <tr key={key}>
                    <td className="param-key">{key}</td>
                    <td className="param-value">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expected Metrics Table */}
          <div className="config-card full-width">
            <h3>Validation Criteria (Expected Metrics)</h3>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Min Expected</th>
                  <th>Max Expected</th>
                </tr>
              </thead>
              <tbody>
                {configData.expected_metrics && Object.entries(configData.expected_metrics).map(([metricName, range]) => (
                  <tr key={metricName}>
                    <td className="param-key">{metricName}</td>
                    <td>{range.expected_min ?? range.min ?? "N/A"}</td>
                    <td>{range.expected_max ?? range.max ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}