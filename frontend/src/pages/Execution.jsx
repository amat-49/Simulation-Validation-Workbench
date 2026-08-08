import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Execution.css";

export default function Execution() {
  const [logs, setLogs] = useState("Ready to execute...");
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRunSimulation = async () => {
    const configPath = localStorage.getItem("selectedScenarioPath");
    if (!configPath) {
      alert("No configuration file selected! Please select one from the Dashboard or Configuration page.");
      return;
    }

    setLoading(true);
    setLogs("Sending file path to backend engine...\nRunning simulation...");

    try {
      // Calls your Electron IPC handler which runs the engine and saves to the DB
      const response = await window.electronAPI.runSimulation(configPath);

      console.log("FULL ENGINE RESPONSE:", response);

      if (response.success) {
        setExecutionResult(response.results);
        setLogs(JSON.stringify(response.results, null, 2));
        localStorage.setItem("currentSimulationResult", JSON.stringify(response.results));
      } else {
        setLogs(`Error: ${response.error}`);
      }
    } catch (err) {
      setLogs(`Execution Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  return (
    <div className="execution-container">
      <h2>Simulation Execution</h2>

      <div className="config-file-card">
        <h3>Selected Configuration File</h3>
        <p className="path-text">{localStorage.getItem("selectedScenarioPath") || "No file selected"}</p>
      </div>

      <div className="execution-action-bar">
        <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        
        <button className="primary-btn run-btn" onClick={handleRunSimulation} disabled={loading}>
          {loading ? "Running..." : "Run Simulation"}
        </button>

        {/* This button appears once the execution completes successfully */}
        {executionResult && (
          <button className="success-btn results-jump-btn" onClick={handleViewResults}>
            View Detailed Results →
          </button>
        )}
      </div>

      <div className="logs-section">
        <h3>Execution Logs</h3>
        <pre className="logs-output">
          <code>{logs}</code>
        </pre>
      </div>
    </div>
  );
}