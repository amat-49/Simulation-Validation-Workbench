import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

export default function History() {
  const [runs, setRuns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await window.electronAPI.getAllRuns();
        if (response && response.success && response.data) {
          setRuns(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch execution history from database:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredRuns = runs.filter((run) => {
    const fileName = run.scenario_name || "";
    const matchesSearch = fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = (run.overall_status || "FAIL").toUpperCase();
    const matchesStatus = 
      statusFilter === "All statuses" || 
      status === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getScenarioDisplayName = (run) => {
  // Check if the config snapshot or path mentions scenario 2 or 3
  const snapshot = run.config_snapshot || "";
  if (snapshot.includes("scenario2") || run.run_id === 2) return "High Load Stress Test";
  if (snapshot.includes("scenario3") || run.run_id === 3) return "Thermal Overload Failure";
  
  if (run.run_id === 1 || snapshot.includes("scenario1") || run.scenario_name === "basic_test") {
    return "Normal Operating Conditions";
  }
  
  return run.scenario_name || "Custom Scenario";
  };
  
  return (
    <div className="history-container">
      <div className="history-top-header">
        <div>
          <span className="breadcrumb-tag">RUN RECORDS</span>
          <h2>Execution History</h2>
          <p className="subtitle">Review previous simulation runs and validation outcomes from the database.</p>
        </div>
        <div className="record-count-badge">
          {filteredRuns.length} {filteredRuns.length === 1 ? "record" : "records"}
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>Search scenarios</label>
          <input
            type="text"
            placeholder="Search by scenario name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Filter by status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="All statuses">All statuses</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>RUN ID</th>
              <th>SCENARIO NAME</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="empty-message">Loading records from database...</td></tr>
            ) : filteredRuns.length === 0 ? (
              <tr><td colSpan="4" className="empty-message">No execution records found in database.</td></tr>
            ) : (
              filteredRuns.map((run) => {
                const status = (run.overall_status || "FAIL").toUpperCase();
                const isPass = status === "PASS";
                const dateStr = run.start_time ? new Date(run.start_time).toLocaleString() : "N/A";

                return (
                  <tr key={run.run_id}>
                    <td className="run-id-cell">#{run.run_id}</td>
                    <td className="scenario-cell">{run.scenario_name || "N/A"}</td>
                    <td>{dateStr}</td>
                    <td>
                      <span className={`status-pill ${isPass ? "pass" : "fail"}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="history-footer-actions">
      </div>
    </div>
  );
}