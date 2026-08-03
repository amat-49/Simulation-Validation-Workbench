import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState("HTML");
  const [message, setMessage] = useState("");

  const storedResult = localStorage.getItem("latestSimulationResult");

  let result = null;

  try {
    result = storedResult ? JSON.parse(storedResult) : null;
  } catch {
    result = null;
  }

  function handleExport() {
    if (!result) {
      setMessage("Run a simulation before exporting a report.");
      return;
    }

    const reportData = {
      title: "Simulation Validation Report",
      scenario: result.scenarioName,
      overallStatus: result.overallStatus,
      executionTime: result.executionTime,
      completedAt: result.completedAt,
      metrics: result.metrics,
    };

    if (selectedFormat === "JSON") {
      const jsonContents = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonContents], {
        type: "application/json",
      });

      downloadBlob(blob, "simulation-validation-report.json");
      setMessage("JSON report exported successfully.");
      return;
    }

    const tableRows = reportData.metrics
      .map(
        (metric) => `
          <tr>
            <td>${metric.name}</td>
            <td>${metric.actual}</td>
            <td>${metric.minimum}</td>
            <td>${metric.maximum}</td>
            <td>${metric.status}</td>
          </tr>
        `
      )
      .join("");

    const htmlContents = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Simulation Validation Report</title>

          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: Arial, Helvetica, sans-serif;
              color: #172033;
              background: #f4f6fa;
            }

            .report {
              max-width: 900px;
              margin: 0 auto;
              padding: 32px;
              border: 1px solid #dbe3ee;
              border-radius: 12px;
              background: white;
            }

            h1 {
              margin-top: 0;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              margin: 24px 0;
            }

            .summary div {
              padding: 14px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              background: #f8fafc;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }

            th,
            td {
              padding: 12px;
              border: 1px solid #dbe3ee;
              text-align: left;
            }

            th {
              background: #f1f5f9;
            }

            .pass {
              color: #166534;
              font-weight: bold;
            }

            .fail {
              color: #991b1b;
              font-weight: bold;
            }
          </style>
        </head>

        <body>
          <main class="report">
            <h1>Simulation Validation Report</h1>

            <div class="summary">
              <div>
                <strong>Scenario</strong>
                <p>${reportData.scenario}</p>
              </div>

              <div>
                <strong>Overall Status</strong>
                <p class="${reportData.overallStatus.toLowerCase()}">
                  ${reportData.overallStatus}
                </p>
              </div>

              <div>
                <strong>Execution Time</strong>
                <p>${reportData.executionTime}</p>
              </div>

              <div>
                <strong>Completed</strong>
                <p>
                  ${new Date(reportData.completedAt).toLocaleString()}
                </p>
              </div>
            </div>

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
                ${tableRows}
              </tbody>
            </table>
          </main>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContents], {
      type: "text/html",
    });

    downloadBlob(blob, "simulation-validation-report.html");
    setMessage("HTML report exported successfully.");
  }

  function downloadBlob(blob, filename) {
    const fileUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileUrl;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(fileUrl);
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Report Generation</p>
          <h2>Report Export</h2>
          <p>
            Export the most recent simulation results as an HTML or JSON
            report.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="empty-state">
          <h2>No Results Available</h2>
          <p>
            Run a simulation before attempting to generate a report.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/execution")}
          >
            Go to Execution
          </button>
        </div>
      ) : (
        <>
          <div className="report-layout">
            <div className="panel report-preview-panel">
              <div className="panel-heading">
                <div>
                  <h3>Report Preview</h3>
                  <p>Review the report summary before exporting.</p>
                </div>

                <span
                  className={`status-badge ${result.overallStatus.toLowerCase()}`}
                >
                  {result.overallStatus}
                </span>
              </div>

              <div className="report-preview">
                <div>
                  <span>Scenario</span>
                  <strong>{result.scenarioName}</strong>
                </div>

                <div>
                  <span>Execution Time</span>
                  <strong>{result.executionTime}</strong>
                </div>

                <div>
                  <span>Completed</span>
                  <strong>
                    {new Date(result.completedAt).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Metric Count</span>
                  <strong>{result.metrics.length}</strong>
                </div>
              </div>
            </div>

            <div className="panel export-options-panel">
              <div className="panel-heading">
                <div>
                  <h3>Export Options</h3>
                  <p>Select the report format.</p>
                </div>
              </div>

              <div className="format-options">
                <label
                  className={
                    selectedFormat === "HTML"
                      ? "format-option selected-format"
                      : "format-option"
                  }
                >
                  <input
                    type="radio"
                    name="report-format"
                    value="HTML"
                    checked={selectedFormat === "HTML"}
                    onChange={(event) =>
                      setSelectedFormat(event.target.value)
                    }
                  />

                  <span>
                    <strong>HTML Report</strong>
                    <small>Formatted report for browser viewing.</small>
                  </span>
                </label>

                <label
                  className={
                    selectedFormat === "JSON"
                      ? "format-option selected-format"
                      : "format-option"
                  }
                >
                  <input
                    type="radio"
                    name="report-format"
                    value="JSON"
                    checked={selectedFormat === "JSON"}
                    onChange={(event) =>
                      setSelectedFormat(event.target.value)
                    }
                  />

                  <span>
                    <strong>JSON Report</strong>
                    <small>Structured data for software processing.</small>
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="primary-button export-button"
                onClick={handleExport}
              >
                Export {selectedFormat} Report
              </button>

              {message && (
                <p className="feedback-message" role="status">
                  {message}
                </p>
              )}
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
              className="secondary-button"
              onClick={() => navigate("/history")}
            >
              View Execution History
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Reports;