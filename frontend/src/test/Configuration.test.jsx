import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("displays the available scenarios", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Normal Operating Conditions")
    ).toBeInTheDocument();

    expect(
      screen.getByText("High Temperature Test")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Low Pressure Test")
    ).toBeInTheDocument();
  });

  test("stores the selected scenario", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", {
        name: /high temperature test/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /review configuration/i,
      })
    );

    const storedScenario = JSON.parse(
      localStorage.getItem("selectedScenario")
    );

    expect(storedScenario.name).toBe("High Temperature Test");
  });
});