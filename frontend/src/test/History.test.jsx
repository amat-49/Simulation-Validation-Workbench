import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import History from "../pages/History";

describe("History", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("filters records by scenario name", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole("searchbox");

    await user.type(searchInput, "temperature");

    expect(
      screen.getByText("High Temperature Test")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Low Pressure Test")
    ).not.toBeInTheDocument();
  });

  test("filters records by status", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await user.selectOptions(
      screen.getByLabelText(/filter by status/i),
      "FAIL"
    );

    expect(
      screen.getByText("High Temperature Test")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Normal Operating Conditions")
    ).not.toBeInTheDocument();
  });
});