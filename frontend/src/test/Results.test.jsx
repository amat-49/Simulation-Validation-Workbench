import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Results from "../pages/Results";

describe("Results", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("shows an empty state when no results exist", () => {
    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No Results Available")
    ).toBeInTheDocument();
  });

  test("displays validation metrics and overall status", () => {
    localStorage.setItem(
      "latestSimulationResult",
      JSON.stringify({
        scenarioName: "Normal Operating Conditions",
        overallStatus: "PASS",
        executionTime: "2.4 seconds",
        completedAt: "2026-08-02T20:00:00.000Z",
        metrics: [
          {
            name: "Temperature",
            actual: 71,
            minimum: 60,
            maximum: 80,
            status: "PASS",
          },
        ],
      })
    );

    render(
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    );

    expect(
    screen.getAllByText("Normal Operating Conditions").length
    ).toBeGreaterThan(0);

    expect(screen.getByText("Temperature")).toBeInTheDocument();

    expect(
      screen.getByText(/overall pass/i)
    ).toBeInTheDocument();
  });
});