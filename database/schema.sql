PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Scenario (
  scenario_id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario_name TEXT NOT NULL,
  description TEXT,
  config_file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SimulationRun (
  run_id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario_id INTEGER NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  overall_status TEXT,
  execution_duration REAL,
  config_snapshot TEXT,
  FOREIGN KEY (scenario_id) REFERENCES Scenario(scenario_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SimulationOutput (
  output_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL,
  unit TEXT,
  FOREIGN KEY (run_id) REFERENCES SimulationRun(run_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ValidationResult (
  validation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  expected_min REAL,
  expected_max REAL,
  actual_value REAL,
  result_status TEXT,
  message TEXT,
  FOREIGN KEY (run_id) REFERENCES SimulationRun(run_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ExecutionLog (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  log_level TEXT,
  message TEXT,
  FOREIGN KEY (run_id) REFERENCES SimulationRun(run_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Report (
  report_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  report_type TEXT,
  file_path TEXT,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES SimulationRun(run_id) ON DELETE CASCADE
);
