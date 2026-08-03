import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const storedResult = localStorage.getItem("latestSimulationResult");

  let result = null;

  try {
    result = storedResult ? JSON.parse(storedResult) : null;
  } catch {
    result = null;
  }

  if (!result) {
    return (
      <section>
        <div className="empty-state">
          <h2>No Results Available</h2>
          <p>
            Run a simulation before attempting to view validation results.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/execution")}
          >
            Go to Execution
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Validation Summary</p>
          <h2>Validation Results</h2>
          <p>{result.scenarioName}</p>
        </div>

        <span
          className={`status-badge ${result.overallStatus.toLowerCase()}`}
        >
          Overall {result.overallStatus}
        </span>
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <span>Scenario</span>
          <strong>{result.scenarioName}</strong>
        </div>

        <div className="summary-card">
          <span>Execution Time</span>
          <strong>{result.executionTime}</strong>
        </div>

        <div className="summary-card">
          <span>Completed</span>
          <strong>
            {new Date(result.completedAt).toLocaleString()}
          </strong>
        </div>

        <div className="summary-card">
          <span>Overall Status</span>
          <strong>{result.overallStatus}</strong>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Metric Validation</h3>
            <p>
              Each simulation output is compared against its expected range.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Actual</th>
                <th>Minimum</th>
                <th>Maximum</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {result.metrics.map((metric) => (
                <tr key={metric.name}>
                  <td>{metric.name}</td>
                  <td>{metric.actual}</td>
                  <td>{metric.minimum}</td>
                  <td>{metric.maximum}</td>
                  <td>
                    <span
                      className={`status-badge ${metric.status.toLowerCase()}`}
                    >
                      {metric.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={
          result.overallStatus === "PASS"
            ? "result-message result-message-pass"
            : "result-message result-message-fail"
        }
      >
        {result.overallStatus === "PASS"
          ? "All validation checks completed successfully."
          : "One or more validation checks failed. Review the affected metrics."}
      </div>

      <div className="page-actions split-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/execution")}
        >
          Back to Execution
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/reports")}
        >
          Continue to Reports
        </button>
      </div>
    </section>
  );
}

export default Results;

 