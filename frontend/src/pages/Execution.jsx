import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExecutionLog from "../components/ExecutionLog";

function Execution() {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const storedScenario = localStorage.getItem("selectedScenario");

  let scenario = null;

  try {
    scenario = storedScenario ? JSON.parse(storedScenario) : null;
  } catch {
    scenario = null;
  }

  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function addLog(level, message) {
    setLogs((currentLogs) => [
      ...currentLogs,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
      },
    ]);
  }

  function runSimulation() {
    if (!scenario) {
      setErrorMessage("No scenario has been selected.");
      return;
    }

    if (isRunning) {
      return;
    }

    setErrorMessage("");
    setLogs([]);
    setProgress(0);
    setStatus("Running");
    setIsRunning(true);

    addLog("INFO", `Starting "${scenario.name}".`);

    const steps = [
      {
        progress: 20,
        level: "INFO",
        message: "Loading scenario configuration.",
      },
      {
        progress: 40,
        level: "INFO",
        message: "Configuration loaded successfully.",
      },
      {
        progress: 60,
        level: "INFO",
        message: "Running simulation engine.",
      },
      {
        progress: 80,
        level: "INFO",
        message: "Validating simulation output.",
      },
      {
        progress: 100,
        level: "SUCCESS",
        message: "Simulation completed successfully.",
      },
    ];

    let stepIndex = 0;

    intervalRef.current = window.setInterval(() => {
      const step = steps[stepIndex];

      setProgress(step.progress);
      addLog(step.level, step.message);

      if (step.progress === 100) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;

        const result = {
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          overallStatus: "PASS",
          executionTime: "2.4 seconds",
          completedAt: new Date().toISOString(),
          metrics: [
            {
              name: "Temperature",
              actual: scenario.configuration.temperature - 1,
              minimum: scenario.configuration.expectedMin,
              maximum: scenario.configuration.expectedMax,
              status: "PASS",
            },
            {
              name: "Pressure",
              actual: scenario.configuration.pressure + 1,
              minimum: 10,
              maximum: 40,
              status: "PASS",
            },
            {
              name: "Response Time",
              actual: 2.4,
              minimum: 0,
              maximum: 3,
              status: "PASS",
            },
          ],
        };

        localStorage.setItem(
          "latestSimulationResult",
          JSON.stringify(result)
        );

        setStatus("Completed");
        setIsRunning(false);
      }

      stepIndex += 1;
    }, 800);
  }

  function resetExecution() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStatus("Ready");
    setProgress(0);
    setLogs([]);
    setIsRunning(false);
    setErrorMessage("");
  }

  if (!scenario) {
    return (
      <section>
        <div className="empty-state">
          <h2>No Scenario Selected</h2>
          <p>
            Select and review a simulation scenario before starting execution.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Return to Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Simulation Control</p>
          <h2>Simulation Execution</h2>
          <p>{scenario.name}</p>
        </div>

        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Execution Control</h3>
            <p>
              Start the simulation and monitor its progress in real time.
            </p>
          </div>

          <span className="progress-value">{progress}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="execution-summary">
          <div>
            <span>Scenario</span>
            <strong>{scenario.name}</strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>{scenario.configuration.duration} seconds</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{status}</strong>
          </div>
        </div>

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="button-group execution-buttons">
          <button
            type="button"
            className="secondary-button"
            disabled={isRunning}
            onClick={resetExecution}
          >
            Reset
          </button>

          <button
            type="button"
            className="primary-button"
            disabled={isRunning || status === "Completed"}
            onClick={runSimulation}
          >
            {isRunning ? "Simulation Running..." : "Run Simulation"}
          </button>
        </div>
      </div>

      <ExecutionLog logs={logs} />

      <div className="page-actions split-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={isRunning}
          onClick={() => navigate("/configuration")}
        >
          Back to Configuration
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={status !== "Completed"}
          onClick={() => navigate("/results")}
        >
          View Results
        </button>
      </div>
    </section>
  );
}

export default Execution;