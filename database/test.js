const {
  saveScenario,
  saveRun,
  saveOutput,
  saveValidationResult,
  saveLog,
  getRunById,
} = require('./DatabaseManager');

function main() {
  const scenarioData = {
    scenario_name: 'Dummy Scenario',
    description: 'Test scenario for database validation',
    config_file_path: 'configs/dummy.json',
  };

  const { scenario_id } = saveScenario(scenarioData);
  console.log('Saved scenario_id:', scenario_id);

  const runData = {
    scenario_id,
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    overall_status: 'completed',
    execution_duration: 0,
    config_snapshot: JSON.stringify({ test: true }),
  };

  const { run_id } = saveRun(runData);
  console.log('Saved run_id:', run_id);

  const outputData = {
    run_id,
    metric_name: 'throughput',
    metric_value: 0,
    unit: 'ops/s',
  };

  const { output_id } = saveOutput(outputData);
  console.log('Saved output_id:', output_id);

  const logData = {
    run_id,
    timestamp: new Date().toISOString(),
    log_level: 'INFO',
    message: 'Test run logged successfully.',
  };

  const { log_id } = saveLog(logData);
  console.log('Saved log_id:', log_id);

  const validationData = {
    run_id,
    metric_name: 'throughput',
    expected_min: 0,
    expected_max: 100,
    actual_value: 0,
    result_status: 'pass',
    message: 'Zero throughput is acceptable for this test.',
  };

  const { validation_id } = saveValidationResult(validationData);
  console.log('Saved validation_id:', validation_id);

  const fullRun = getRunById(run_id);
  console.log('Full run result:');
  console.log(JSON.stringify(fullRun, null, 2));
}

main();
