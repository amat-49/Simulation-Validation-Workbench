import { useNavigate } from "react-router-dom";

const configurationLabels = {
  duration: "Simulation Duration",
  temperature: "Starting Temperature",
  pressure: "Starting Pressure",
  expectedMin: "Expected Minimum",
  expectedMax: "Expected Maximum",
};

const configurationUnits = {
  duration: "seconds",
  temperature: "°F",
  pressure: "PSI",
  expectedMin: "",
  expectedMax: "",
};

function Configuration() {
  const navigate = useNavigate();
  const storedScenario = localStorage.getItem("selectedScenario");

  let scenario = null;

  try {
    scenario = storedScenario ? JSON.parse(storedScenario) : null;
  } catch {
    scenario = null;
  }

  if (!scenario) {
    return (
      <section>
        <div className="empty-state">
          <h2>No Scenario Selected</h2>
          <p>
            Return to the dashboard and select a scenario before reviewing its
            configuration.
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
          <p className="eyebrow">Selected Scenario</p>
          <h2>Configuration Review</h2>
          <p>{scenario.name}</p>
        </div>

        <span className="status-badge ready">Ready</span>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Scenario Details</h3>
            <p>{scenario.description}</p>
          </div>

          <span className="scenario-id">ID: {scenario.id}</span>
        </div>

        <dl className="configuration-list">
          {Object.entries(scenario.configuration).map(([key, value]) => (
            <div key={key} className="configuration-row">
              <dt>{configurationLabels[key] ?? key}</dt>

              <dd>
                {value} {configurationUnits[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="information-banner">
        Review the configuration values before continuing. The backend will
        validate the full YAML or JSON configuration before the simulation
        begins.
      </div>

      <div className="page-actions split-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          Back to Scenarios
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/execution")}
        >
          Continue to Execution
        </button>
      </div>
    </section>
  );
}

export default Configuration;