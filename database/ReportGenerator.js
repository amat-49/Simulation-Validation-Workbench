const fs = require('fs');
const path = require('path');
const { getRunById } = require('./DatabaseManager');

const reportsDir = path.join(__dirname, 'reports');

function ensureReportsDir() {
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
}

function generateJSONReport(runId) {
  const data = getRunById(runId);
  if (!data) {
    throw new Error(`Run not found for id ${runId}`);
  }

  ensureReportsDir();

  const filePath = path.join(reportsDir, `run-${runId}-report.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  return filePath;
}

function buildHTMLTable(headers, rows) {
  const head = headers.map((header) => `<th>${header}</th>`).join('');
  const body = rows
    .map((row) => {
      const cells = Object.values(row)
        .map((value) => `<td>${String(value ?? '')}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('\n');

  return `
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>
        ${body}
      </tbody>
    </table>
  `;
}

function generateHTMLReport(runId) {
  const data = getRunById(runId);
  if (!data) {
    throw new Error(`Run not found for id ${runId}`);
  }

  ensureReportsDir();

  const { run, outputs, validations, logs } = data;
  const title = `Simulation Report - Run ${runId}`;
  const scenarioName = run.scenario_name || 'Unknown Scenario';
  const overallStatus = run.overall_status || 'Unknown';

  const outputHeaders = ['Metric', 'Value', 'Unit'];
  const outputRows = outputs.map((output) => ({
    metric_name: output.metric_name,
    metric_value: output.metric_value,
    unit: output.unit,
  }));

  const validationHeaders = ['Metric', 'Expected Min', 'Expected Max', 'Actual Value', 'Status', 'Message'];
  const validationRows = validations.map((validation) => ({
    metric_name: validation.metric_name,
    expected_min: validation.expected_min,
    expected_max: validation.expected_max,
    actual_value: validation.actual_value,
    result_status: validation.result_status,
    message: validation.message,
  }));

  const logHeaders = ['Timestamp', 'Level', 'Message'];
  const logRows = logs.map((log) => ({
    timestamp: log.timestamp,
    log_level: log.log_level,
    message: log.message,
  }));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    h1, h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f4f4f4; }
    tr:nth-child(even) { background: #fafafa; }
    .status { font-weight: bold; }
    .pass { color: green; }
    .fail { color: red; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p><strong>Scenario:</strong> ${scenarioName}</p>
  <p><strong>Overall Status:</strong> <span class="status">${overallStatus}</span></p>

  <h2>Output Metrics</h2>
  ${buildHTMLTable(outputHeaders, outputRows)}

  <h2>Validation Results</h2>
  ${buildHTMLTable(validationHeaders, validationRows)}

  <h2>Execution Logs</h2>
  ${buildHTMLTable(logHeaders, logRows)}
</body>
</html>`;

  const filePath = path.join(reportsDir, `run-${runId}-report.html`);
  fs.writeFileSync(filePath, html, 'utf8');

  return filePath;
}

module.exports = {
  generateJSONReport,
  generateHTMLReport,
};
