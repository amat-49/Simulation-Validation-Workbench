const path = require('path');
const dbManager = require('../../database/DatabaseManager'); // Adjust path to reach your database folder
const { runEngine } = require('./engineRunner');

/**
 * Runs a scenario file through the C++ engine and saves all results to the database.
 * @param {string} configPath - Path to the scenario configuration file.
 * @param {number} scenarioId - The database ID of the scenario being run.
 * @returns {Promise<Object>} The saved run results.
 */
async function runAndSaveSimulation(configPath, scenarioId) {
    const startTime = new Date().toISOString();
    
    // 1. Run the C++ engine executable
    const engineOutput = await runEngine(configPath);
    const endTime = new Date().toISOString();

    // 2. Save the simulation run record
    const runInfo = dbManager.saveRun({
        scenario_id: scenarioId,
        start_time: startTime,
        end_time: endTime,
        overall_status: engineOutput.status === 'success' ? engineOutput.overall_validation : 'ERROR',
        config_snapshot: JSON.stringify(engineOutput)
    });
    const runId = runInfo.run_id;

    // 3. Save metrics (SimulationOutput table)
    if (engineOutput.metrics) {
        for (const [metricName, value] of Object.entries(engineOutput.metrics)) {
            dbManager.saveOutput({
                run_id: runId,
                metric_name: metricName,
                metric_value: value
            });
        }
    }

    // 4. Save validation results (ValidationResult table)
    if (engineOutput.validation_results) {
        for (const val of engineOutput.validation_results) {
            dbManager.saveValidationResult({
                run_id: runId,
                metric_name: val.metric_name,
                expected_min: val.expected_min,
                expected_max: val.expected_max,
                actual_value: val.actual_value,
                result_status: val.passed ? 'PASS' : 'FAIL'
            });
        }
    }

    // 5. Save execution logs (ExecutionLog table)
    if (engineOutput.logs) {
        for (const log of engineOutput.logs) {
            dbManager.saveLog({
                run_id: runId,
                timestamp: log.timestamp,
                log_level: log.level,
                message: log.message
            });
        }
    }

    // Return the complete saved run details from SQLite
    return dbManager.getRunById(runId);
}

module.exports = {
    runAndSaveSimulation
};