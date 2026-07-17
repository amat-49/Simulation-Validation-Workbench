const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'workbench.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const insertScenarioStmt = db.prepare(`
  INSERT INTO Scenario (scenario_name, description, config_file_path)
  VALUES (@scenario_name, @description, @config_file_path)
`);

const insertRunStmt = db.prepare(`
  INSERT INTO SimulationRun (scenario_id, start_time, end_time, overall_status, execution_duration, config_snapshot)
  VALUES (@scenario_id, @start_time, @end_time, @overall_status, @execution_duration, @config_snapshot)
`);

const insertOutputStmt = db.prepare(`
  INSERT INTO SimulationOutput (run_id, metric_name, metric_value, unit)
  VALUES (@run_id, @metric_name, @metric_value, @unit)
`);

const insertValidationStmt = db.prepare(`
  INSERT INTO ValidationResult (run_id, metric_name, expected_min, expected_max, actual_value, result_status, message)
  VALUES (@run_id, @metric_name, @expected_min, @expected_max, @actual_value, @result_status, @message)
`);

const insertLogStmt = db.prepare(`
  INSERT INTO ExecutionLog (run_id, timestamp, log_level, message)
  VALUES (@run_id, COALESCE(@timestamp, CURRENT_TIMESTAMP), @log_level, @message)
`);

const insertReportStmt = db.prepare(`
  INSERT INTO Report (run_id, report_type, file_path, generated_at)
  VALUES (@run_id, @report_type, @file_path, COALESCE(@generated_at, CURRENT_TIMESTAMP))
`);

const getExecutionHistoryStmt = db.prepare(`
  SELECT
    r.run_id,
    r.scenario_id,
    s.scenario_name,
    s.description AS scenario_description,
    r.start_time,
    r.end_time,
    r.overall_status,
    r.execution_duration,
    r.config_snapshot
  FROM SimulationRun r
  JOIN Scenario s ON r.scenario_id = s.scenario_id
  ORDER BY r.start_time DESC
`);

const getRunByIdStmt = db.prepare(`
  SELECT
    r.*, 
    s.scenario_name,
    s.description AS scenario_description,
    s.config_file_path,
    s.created_at AS scenario_created_at
  FROM SimulationRun r
  JOIN Scenario s ON r.scenario_id = s.scenario_id
  WHERE r.run_id = @run_id
`);

const getOutputsByRunStmt = db.prepare(`
  SELECT output_id, run_id, metric_name, metric_value, unit
  FROM SimulationOutput
  WHERE run_id = @run_id
  ORDER BY output_id
`);

const getValidationByRunStmt = db.prepare(`
  SELECT validation_id, run_id, metric_name, expected_min, expected_max, actual_value, result_status, message
  FROM ValidationResult
  WHERE run_id = @run_id
  ORDER BY validation_id
`);

const getLogsByRunStmt = db.prepare(`
  SELECT log_id, run_id, timestamp, log_level, message
  FROM ExecutionLog
  WHERE run_id = @run_id
  ORDER BY timestamp ASC
`);

const getReportsByRunStmt = db.prepare(`
  SELECT report_id, run_id, report_type, file_path, generated_at
  FROM Report
  WHERE run_id = @run_id
  ORDER BY generated_at ASC
`);

function saveScenario(scenario) {
  const info = insertScenarioStmt.run({
    scenario_name: scenario.scenario_name,
    description: scenario.description ?? null,
    config_file_path: scenario.config_file_path ?? null,
  });

  return { scenario_id: info.lastInsertRowid };
}

function saveRun(run) {
  const info = insertRunStmt.run({
    scenario_id: run.scenario_id,
    start_time: run.start_time ?? null,
    end_time: run.end_time ?? null,
    overall_status: run.overall_status ?? null,
    execution_duration: run.execution_duration ?? null,
    config_snapshot: run.config_snapshot ?? null,
  });

  return { run_id: info.lastInsertRowid };
}

function saveOutput(output) {
  const info = insertOutputStmt.run({
    run_id: output.run_id,
    metric_name: output.metric_name,
    metric_value: output.metric_value ?? null,
    unit: output.unit ?? null,
  });

  return { output_id: info.lastInsertRowid };
}

function saveValidationResult(result) {
  const info = insertValidationStmt.run({
    run_id: result.run_id,
    metric_name: result.metric_name,
    expected_min: result.expected_min ?? null,
    expected_max: result.expected_max ?? null,
    actual_value: result.actual_value ?? null,
    result_status: result.result_status ?? null,
    message: result.message ?? null,
  });

  return { validation_id: info.lastInsertRowid };
}

function saveLog(log) {
  const info = insertLogStmt.run({
    run_id: log.run_id,
    timestamp: log.timestamp ?? null,
    log_level: log.log_level ?? null,
    message: log.message ?? null,
  });

  return { log_id: info.lastInsertRowid };
}

function saveReport(report) {
  const info = insertReportStmt.run({
    run_id: report.run_id,
    report_type: report.report_type ?? null,
    file_path: report.file_path ?? null,
    generated_at: report.generated_at ?? null,
  });

  return { report_id: info.lastInsertRowid };
}

function getExecutionHistory() {
  return getExecutionHistoryStmt.all();
}

function getRunById(runId) {
  const run = getRunByIdStmt.get({ run_id: runId });
  if (!run) {
    return null;
  }

  const outputs = getOutputsByRunStmt.all({ run_id: runId });
  const validations = getValidationByRunStmt.all({ run_id: runId });
  const logs = getLogsByRunStmt.all({ run_id: runId });
  const reports = getReportsByRunStmt.all({ run_id: runId });

  return {
    run,
    outputs,
    validations,
    logs,
    reports,
  };
}

module.exports = {
  saveScenario,
  saveRun,
  saveOutput,
  saveValidationResult,
  saveLog,
  saveReport,
  getExecutionHistory,
  getRunById,
};
