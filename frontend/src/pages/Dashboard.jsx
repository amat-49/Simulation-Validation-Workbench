import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { scenarios } from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  function handleScenarioSelection(scenario) {
    setSelectedScenario(scenario);
    setErrorMessage("");
  }

  function handleContinue() {
    if (!selectedScenario) {
      setErrorMessage("Select a scenario before continuing.");
      return;
    }

    localStorage.setItem(
      "selectedScenario",
      JSON.stringify(selectedScenario)
    );

    navigate("/configuration");
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Simulation Workbench</p>
          <h2>Scenario Library</h2>
          <p>
            Select a simulation scenario to review its configuration and begin
            execution.
          </p>
        </div>
      </div>

      <div className="scenario-grid">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario?.id === scenario.id;

          return (
            <button
              type="button"
              key={scenario.id}
              className={
                isSelected
                  ? "scenario-card scenario-card-selected"
                  : "scenario-card"
              }
              onClick={() => handleScenarioSelection(scenario)}
              aria-pressed={isSelected}
            >
              <div className="scenario-card-header">
                <span className="scenario-number">
                  {String(scenario.id).padStart(2, "0")}
                </span>

                {isSelected && (
                  <span className="selected-label">Selected</span>
                )}
              </div>

              <h3>{scenario.name}</h3>
              <p>{scenario.description}</p>

              <div className="scenario-details">
                <span>{scenario.configuration.duration} seconds</span>
                <span>{scenario.configuration.temperature}°F</span>
                <span>{scenario.configuration.pressure} PSI</span>
              </div>
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="page-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleContinue}
        >
          Review Configuration
        </button>
      </div>
    </section>
  );
}

export default Dashboard;