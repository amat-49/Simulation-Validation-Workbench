import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // 1. Handler for pre-defined example cards
  const handleSelectExample = (filePath) => {
    localStorage.setItem("selectedScenarioPath", filePath);
    navigate("/configuration");
  };

  // 2. Handler for custom file upload via Electron dialog
  const handleUploadCustom = async () => {
    try {
      const filePath = await window.electronAPI.chooseScenarioFile();
      if (filePath) {
        localStorage.setItem("selectedScenarioPath", filePath);
        navigate("/configuration");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Select a Simulation Scenario</h2>
      
      {/* Upload Custom File Card/Button */}
      <div className="upload-section" style={{ marginBottom: "20px" }}>
        <button className="primary-button" onClick={handleUploadCustom}>
          Upload Custom JSON File
        </button>
      </div>

      <hr />

      <h3>Pre-defined Scenarios</h3>
        <div className="scenario-grid">
        {/* Scenario 1 */}
        <div className="panel scenario-card">
          <h4>Normal Operating Conditions</h4>
          <p>Standard baseline temperature and pressure testing profile.</p>
          <button 
            className="secondary-button" 
            onClick={() => {
              localStorage.setItem("selectedScenarioPath", "backend/config/scenarios/scenario1.json");
              localStorage.setItem("selectedScenarioId", 1);
              navigate("/configuration");
            }}
          >
            Select & Run
          </button>
        </div>

        {/* Scenario 2 */}
        <div className="panel scenario-card">
          <h4>High Load Stress Test</h4>
          <p>Pushing system throughput to maximum safe operational thresholds.</p>
          <button 
            className="secondary-button" 
            onClick={() => {
              localStorage.setItem("selectedScenarioPath", "backend/config/scenarios/scenario2.json");
              localStorage.setItem("selectedScenarioId", 2);
              navigate("/configuration");
            }}
          >
            Select & Run
          </button>
        </div>

        {/* Scenario 3 */}
        <div className="panel scenario-card">
          <h4>Thermal Overload Failure</h4>
          <p>Extreme environmental parameters designed to trigger safety faults.</p>
          <button 
            className="secondary-button" 
            onClick={() => {
              localStorage.setItem("selectedScenarioPath", "backend/config/scenarios/scenario3.json");
              localStorage.setItem("selectedScenarioId", 3);
              navigate("/configuration");
            }}
          >
            Select & Run
          </button>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;