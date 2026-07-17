const { saveLog, getRunById } = require('./DatabaseManager');

function createLogEntry(runId, level, message) {
  return saveLog({
    run_id: runId,
    timestamp: new Date().toISOString(),
    log_level: level,
    message,
  });
}

function getLogsByRunId(runId) {
  const result = getRunById(runId);
  return result ? result.logs : [];
}

module.exports = {
  createLogEntry,
  getLogsByRunId,
};
