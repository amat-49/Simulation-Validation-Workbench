import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css";

export default function Results() {
  const [resultData, setResultData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("currentSimulationResult");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResultData(parsed.run ? { ...parsed.run, metrics: parsed.metrics, validation_results: parsed.validation_results } : parsed);
      } catch (e) {
        console.error("Failed to parse results", e);
      }
    }
  }, []);

  if (!resultData) {
    return (
      <div className="results-container">
        <h2>Simulation Results</h2>
        <div className="empty-state">
          <p>No execution results found. Run a simulation from the Execution page first.</p>
        </div>
      </div>
    );
  }

  const status = resultData.overall_status || resultData.overall_validation || "FAIL";
  const isPassed = status === "PASS";
  const fileName = localStorage.getItem("selectedScenarioPath") ? localStorage.getItem("selectedScenarioPath").split('/').pop() : "N/A";

  // Function to trigger JSON download
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resultData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `simulation_report_run_${resultData.run_id || 'result'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simple clean YAML converter for the report structure
  const downloadYAML = () => {
    let yamlContent = `run_id: ${resultData.run_id || 'N/A'}\n`;
    yamlContent += `file_name: "${fileName}"\n`;
    yamlContent += `timestamp: "${resultData.start_time || 'N/A'}"\n`;
    yamlContent += `overall_status: "${status}"\n`;
    
    if (resultData.metrics) {
      yamlContent += `metrics:\n`;
      for (const [k, v] of Object.entries(resultData.metrics)) {
        yamlContent += `  ${k}: ${v}\n`;
      }
    }

    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `simulation_report_run_${resultData.run_id || 'result'}.yaml`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <h2>Simulation Results Summary</h2>
          <p className="subtitle">Execution report overview and export options.</p>
        </div>
        <div className="action-buttons-group">
          <button className="download-btn json-btn" onClick={downloadJSON}>
            Download JSON
          </button>
          <button className="download-btn yaml-btn" onClick={downloadYAML}>
            Download YAML
          </button>
        </div>
      </div>

      <div className="results-action-bar">
        <button className="secondary-btn" onClick={() => navigate("/execution")}>
          ← Back to Execution
        </button>
      </div>

      {/* Prominent Status & Details Card */}
      <div className="results-hero-card">
        <div className="hero-status-section">
          <span className="hero-label">Overall Status</span>
          <div className={`hero-badge ${isPassed ? "pass" : "fail"}`}>
            {status}
          </div>
        </div>

        <div className="hero-divider"></div>

        <div className="hero-meta-section">
          <div className="meta-item">
            <span className="meta-label">Test / Run ID</span>
            <span className="meta-value">#{resultData.run_id || "N/A"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Configuration File</span>
            <span className="meta-value file-name-highlight">{fileName}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Timestamp</span>
            <span className="meta-value">{resultData.start_time ? new Date(resultData.start_time).toLocaleString() : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}