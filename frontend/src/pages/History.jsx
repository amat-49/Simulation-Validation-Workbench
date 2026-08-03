import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockHistory } from "../data/mockData";

function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const storedResult = localStorage.getItem("latestSimulationResult");

  let latestResult = null;

  try {
    latestResult = storedResult ? JSON.parse(storedResult) : null;
  } catch {
    latestResult = null;
  }

  const historyRecords = useMemo(() => {
    const records = [...mockHistory];

    if (latestResult) {
      const alreadyExists = records.some(
        (record) =>
          record.scenario === latestResult.scenarioName &&
          record.date ===
            new Date(latestResult.completedAt).toLocaleDateString()
      );

      if (!alreadyExists) {
        records.unshift({
          id: `RUN-${Date.now()}`,
          scenario: latestResult.scenarioName,
          date: new Date(latestResult.completedAt).toLocaleDateString(),
          duration: latestResult.executionTime,
          status: latestResult.overallStatus,
        });
      }
    }

    return records;
  }, [latestResult]);

  const filteredHistory = useMemo(() => {
    return historyRecords.filter((run) => {
      const matchesSearch = run.scenario
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || run.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [historyRecords, searchTerm, statusFilter]);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Run Records</p>
          <h2>Execution History</h2>
          <p>
            Search and review previous simulation runs and validation outcomes.
          </p>
        </div>

        <span className="history-count">
          {filteredHistory.length} record
          {filteredHistory.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="panel">
        <div className="history-controls">
          <div className="search-control">
            <label htmlFor="history-search">Search scenarios</label>

            <input
              id="history-search"
              type="search"
              value={searchTerm}
              placeholder="Search by scenario name"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-control">
            <label htmlFor="status-filter">Filter by status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="PASS">Pass</option>
              <option value="FAIL">Fail</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Scenario</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table-message">
                    No execution records match your search.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((run) => (
                  <tr key={run.id}>
                    <td>{run.id}</td>
                    <td>{run.scenario}</td>
                    <td>{run.date}</td>
                    <td>{run.duration}</td>
                    <td>
                      <span
                        className={`status-badge ${run.status.toLowerCase()}`}
                      >
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-actions split-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/results")}
        >
          Back to Results
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/reports")}
        >
          Go to Reports
        </button>
      </div>
    </section>
  );
}

export default History;